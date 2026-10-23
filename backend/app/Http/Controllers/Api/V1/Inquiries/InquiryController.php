<?php

namespace App\Http\Controllers\Api\V1\Inquiries;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Account;
use App\Models\Inquiry;
use App\Services\Listings\CatalogueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InquiryController extends ApiController
{
    public function store(Request $request, CatalogueService $catalogue): JsonResponse
    {
        /** @var Account $client */
        $client = $request->user();
        $validated = $request->validate([
            'listing_source' => ['required', Rule::in(['native', 'legacy_property'])], 'listing_id' => ['required', 'string', 'max:64'],
            'channel' => ['required', Rule::in(['form', 'whatsapp', 'call'])], 'name' => ['nullable', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:20'], 'email' => ['nullable', 'email:rfc', 'max:160'],
            'message' => ['nullable', 'string', 'max:5000'], 'move_in_date' => ['nullable', 'string', 'max:64'], 'metadata' => ['nullable', 'array'],
        ]);
        $listing = $catalogue->find($validated['listing_source'], $validated['listing_id']);
        if ($listing === null) {
            return $this->failure('Property not found.', 'LISTING_NOT_FOUND', 404);
        }

        $inquiry = Inquiry::query()->create([
            'listing_source' => $validated['listing_source'], 'listing_id' => $validated['listing_id'],
            'provider_account_id' => $catalogue->resolveProvider($validated['listing_source'], $validated['listing_id'])?->id,
            'client_account_id' => $client->id, 'channel' => $validated['channel'], 'status' => 'new',
            'client_name' => $validated['name'] ?? $client->name, 'client_phone' => $validated['phone'] ?? $client->phone,
            'client_email' => $validated['email'] ?? $client->email, 'message' => $validated['message'] ?? null,
            'move_in_date' => $validated['move_in_date'] ?? null, 'metadata' => $validated['metadata'] ?? [],
        ]);

        return $this->success(['inquiry' => $this->present($inquiry, $listing)], 'Your enquiry has been recorded.', 201);
    }

    public function providerIndex(Request $request, CatalogueService $catalogue): JsonResponse
    {
        $inquiries = Inquiry::query()->where('provider_account_id', $request->user()->id)->latest()->get();

        return $this->success(['inquiries' => $inquiries->map(fn (Inquiry $inquiry) => $this->present($inquiry, $catalogue->find($inquiry->listing_source, $inquiry->listing_id)))->values()]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(['new', 'contacted', 'site_visit', 'interested', 'accepted', 'closed'])]]);
        $inquiry = Inquiry::query()->whereKey($id)->where('provider_account_id', $request->user()->id)->first();
        abort_if($inquiry === null, 404, 'Inquiry not found.');
        $inquiry->update(['status' => $validated['status'], 'contacted_at' => $validated['status'] === 'contacted' ? now() : $inquiry->contacted_at]);

        return $this->success(['inquiry' => $this->present($inquiry->fresh(), null)]);
    }

    /** @param array<string, mixed>|null $listing @return array<string, mixed> */
    public function present(Inquiry $inquiry, ?array $listing): array
    {
        return [
            'id' => $inquiry->id, 'listing_source' => $inquiry->listing_source, 'listing_id' => $inquiry->listing_id,
            'channel' => $inquiry->channel, 'status' => strtoupper($inquiry->status), 'customer_name' => $inquiry->client_name,
            'customer_phone' => $inquiry->client_phone, 'customer_email' => $inquiry->client_email, 'message' => $inquiry->message,
            'move_in_date' => $inquiry->move_in_date, 'created_at' => $inquiry->created_at?->toIso8601String(),
            'property' => $listing,
        ];
    }
}
