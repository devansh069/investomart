<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ApiController;
use App\Services\Listings\ListingPresenter;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class LegacyPropertyAdminController extends ApiController
{
    public function index(Request $request, ListingPresenter $presenter): JsonResponse
    {
        $query = $this->propertyQuery()->where(function ($nested): void {
            $nested->where('p.is_delete', 0)->orWhereNull('p.is_delete');
        });
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'approved') {
                $query->where('p.status', 1)->where(function ($nested): void {
                    $nested->where('p.mobile_status', 'approved')->orWhereNull('p.mobile_status');
                });
            } else {
                $query->where('p.mobile_status', $status);
            }
        }
        if ($request->filled('city_id')) {
            $query->where('p.pro_city', $request->integer('city_id'));
        }
        if ($request->filled('category_id')) {
            $query->where('p.pro_cat', $request->integer('category_id'));
        }
        if ($request->filled('search')) {
            $search = '%'.trim((string) $request->input('search')).'%';
            $query->where(fn ($nested) => $nested->where('p.pro_name', 'like', $search)->orWhere('p.pro_id', 'like', $search)->orWhere('u.mobile_number', 'like', $search));
        }

        $page = $query->orderByDesc('p.add_time')->paginate(min(max($request->integer('per_page', 25), 1), 100));

        return $this->success(['listings' => $page->getCollection()->map(fn (object $property) => $presenter->legacy($property))->values()], null, 200, ['pagination' => [
            'page' => $page->currentPage(), 'per_page' => $page->perPage(), 'total' => $page->total(), 'last_page' => $page->lastPage(),
        ]]);
    }

    public function show(int $id, ListingPresenter $presenter): JsonResponse
    {
        $property = $this->propertyQuery()->where('p.pro_id', $id)->first();
        abort_if($property === null, 404, 'Property not found.');

        return $this->success(['listing' => $presenter->legacy($property), 'history' => $this->history($id)]);
    }

    public function review(Request $request, int $id, ListingPresenter $presenter): JsonResponse
    {
        $validated = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'reason' => ['nullable', 'string', 'max:5000', Rule::requiredIf($request->input('decision') === 'rejected')],
        ]);
        $property = DB::table('property')->where('pro_id', $id)->where(function ($q): void {
            $q->where('is_delete', 0)->orWhereNull('is_delete');
        })->first();
        abort_if($property === null, 404, 'Property not found.');
        $admin = $request->attributes->get('legacy_admin');
        $from = $property->mobile_status ?: ((int) $property->status === 1 ? 'approved' : 'pending');
        $approved = $validated['decision'] === 'approved';

        DB::table('property')->where('pro_id', $id)->update([
            'status' => $approved ? 1 : 0,
            'mobile_status' => $validated['decision'],
            'rejection_reason' => $approved ? null : $validated['reason'],
            'approved_at' => $approved ? now() : null,
            'approved_by' => $admin->user_id,
        ]);
        $this->writeHistory($id, $from, $validated['decision'], $validated['reason'] ?? null, $admin->user_id);

        return $this->show($id, $presenter);
    }

    public function history(int $id): array
    {
        return DB::table('property_status_history as h')
            ->leftJoin('tbl_users as u', 'h.acted_by_admin_id', '=', 'u.user_id')
            ->where('h.property_id', $id)
            ->orderByDesc('h.acted_at')
            ->select('h.*', 'u.user_fullname as admin_name')
            ->get()->all();
    }

    private function propertyQuery(): Builder
    {
        return DB::table('property as p')
            ->leftJoin('city as c', 'p.pro_city', '=', 'c.id')
            ->leftJoin('localities as l', 'p.por_location', '=', 'l.lid')
            ->leftJoin('property_cat as pc', 'p.pro_cat', '=', 'pc.id')
            ->leftJoin('prperty_for as pf', 'p.pro_for', '=', 'pf.id')
            ->leftJoin('app_users as u', 'p.userid', '=', 'u.id')
            ->select(['p.*', 'c.city as resolved_city', 'l.lname as resolved_location', 'pc.name as resolved_property_type', 'pf.name as resolved_listing_type', 'u.name as provider_name', 'u.mobile_number as provider_mobile']);
    }

    private function writeHistory(int $propertyId, string $from, string $to, ?string $reason, int $adminId): void
    {
        DB::table('property_status_history')->insert([
            'property_id' => $propertyId, 'from_status' => $from, 'to_status' => $to, 'reason' => $reason,
            'acted_by_admin_id' => $adminId, 'acted_at' => now(), 'source' => 'admin_api',
        ]);
    }
}
