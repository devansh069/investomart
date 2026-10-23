<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Http\Controllers\Api\V1\Inquiries\InquiryController;
use App\Models\AdminAuditLog;
use App\Models\Inquiry;
use App\Models\Listing;
use App\Models\PlanOrder;
use App\Services\Listings\CatalogueService;
use App\Services\Listings\ListingCapacityService;
use App\Services\Listings\ListingPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends ApiController
{
    public function dashboard(): JsonResponse
    {
        return $this->success(['summary' => [
            'pending_listings' => Listing::query()->where('approval_status', 'pending')->count(),
            'live_listings' => Listing::query()->where('approval_status', 'approved')->where('provider_status', 'active')->where('capacity_status', 'eligible')->count(),
            'plan_held_listings' => Listing::query()->where('capacity_status', 'plan_hold')->count(),
            'new_inquiries' => Inquiry::query()->where('status', 'new')->count(),
            'payment_orders' => PlanOrder::query()->where('status', 'paid')->count(),
        ]]);
    }

    public function listings(Request $request, ListingPresenter $presenter): JsonResponse
    {
        $query = Listing::query()->with(['provider', 'media'])->latest();
        if ($request->filled('approval_status')) {
            $query->where('approval_status', $request->input('approval_status'));
        }
        if ($request->filled('provider_status')) {
            $query->where('provider_status', $request->input('provider_status'));
        }

        $page = $query->paginate(min(max($request->integer('per_page', 25), 1), 100));

        return $this->success(['listings' => $page->getCollection()->map(fn (Listing $listing) => $presenter->native($listing))->values()], null, 200, ['pagination' => [
            'page' => $page->currentPage(), 'per_page' => $page->perPage(), 'total' => $page->total(), 'last_page' => $page->lastPage(),
        ]]);
    }

    public function reviewListing(Request $request, string $id, ListingPresenter $presenter, ListingCapacityService $capacity): JsonResponse
    {
        $validated = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])], 'review_note' => ['nullable', 'string', 'max:3000'],
        ]);
        $listing = Listing::query()->with('provider')->find($id);
        abort_if($listing === null, 404, 'Property not found.');

        $listing->update([
            'approval_status' => $validated['decision'], 'review_note' => $validated['review_note'] ?? null,
            'approved_at' => $validated['decision'] === 'approved' ? now() : null,
            'approved_by_account_id' => $request->user()->id,
        ]);
        if ($validated['decision'] === 'approved') {
            $capacity->rebalance($listing->provider);
        }
        $this->audit($request, 'listing.'.$validated['decision'], 'listing', $listing->id, ['review_note' => $validated['review_note'] ?? null]);

        return $this->success(['listing' => $presenter->native($listing->fresh(['provider', 'media']))], 'Property review saved.');
    }

    public function inquiries(Request $request, InquiryController $presenter, CatalogueService $catalogue): JsonResponse
    {
        $query = Inquiry::query()->latest();
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        $page = $query->paginate(min(max($request->integer('per_page', 25), 1), 100));

        return $this->success(['inquiries' => $page->getCollection()->map(fn (Inquiry $inquiry) => $presenter->present($inquiry, $catalogue->find($inquiry->listing_source, $inquiry->listing_id)))->values()], null, 200, ['pagination' => [
            'page' => $page->currentPage(), 'per_page' => $page->perPage(), 'total' => $page->total(), 'last_page' => $page->lastPage(),
        ]]);
    }

    public function updateInquiry(Request $request, string $id, InquiryController $presenter): JsonResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(['new', 'contacted', 'site_visit', 'interested', 'accepted', 'closed'])]]);
        $inquiry = Inquiry::query()->find($id);
        abort_if($inquiry === null, 404, 'Inquiry not found.');
        $inquiry->update(['status' => $validated['status'], 'contacted_at' => $validated['status'] === 'contacted' ? now() : $inquiry->contacted_at]);
        $this->audit($request, 'inquiry.status_updated', 'inquiry', $inquiry->id, ['status' => $validated['status']]);

        return $this->success(['inquiry' => $presenter->present($inquiry->fresh(), null)]);
    }

    private function audit(Request $request, string $action, string $subjectType, string $subjectId, array $metadata): void
    {
        AdminAuditLog::query()->create([
            'actor_account_id' => $request->user()->id, 'action' => $action, 'subject_type' => $subjectType,
            'subject_id' => $subjectId, 'metadata' => $metadata, 'ip_address' => $request->ip(),
        ]);
    }
}
