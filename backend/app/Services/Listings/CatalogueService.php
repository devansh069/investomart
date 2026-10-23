<?php

namespace App\Services\Listings;

use App\Models\Account;
use App\Models\Listing;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CatalogueService
{
    public function __construct(private readonly ListingPresenter $presenter) {}

    /** @return LengthAwarePaginator<int, array<string, mixed>> */
    public function publicPage(Request $request): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 50);
        $page = max($request->integer('page', 1), 1);
        $native = $this->nativePublicQuery($request)->with(['provider', 'media'])->get()->map(
            fn (Listing $listing): array => $this->presenter->native($listing),
        );
        $legacy = $this->legacyQuery($request)->get()->map(
            fn (object $property): array => $this->presenter->legacy($property),
        );
        $items = $native->concat($legacy)->sortByDesc('posted_at')->values();

        return new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );
    }

    /** @return array<string, mixed>|null */
    public function find(string $source, string $id): ?array
    {
        if ($source === 'native') {
            $listing = Listing::query()->with(['provider', 'media'])->find($id);

            return $listing === null ? null : $this->presenter->native($listing);
        }

        if ($source === 'legacy_property') {
            $property = DB::table('property')->where('pro_id', $id)->where('is_delete', 0)->first();

            return $property === null ? null : $this->presenter->legacy($property);
        }

        return null;
    }

    /** @return Collection<int, array<string, mixed>> */
    public function providerListings(Account $provider): Collection
    {
        $native = Listing::query()
            ->where('provider_account_id', $provider->id)
            ->with(['provider', 'media'])
            ->latest()
            ->get()
            ->map(fn (Listing $listing): array => $this->presenter->native($listing));

        if ($provider->legacy_user_id === null) {
            return $native->values();
        }

        $legacy = DB::table('property')
            ->where('userid', (string) $provider->legacy_user_id)
            ->where('is_delete', 0)
            ->orderByDesc('time')
            ->get()
            ->map(fn (object $property): array => $this->presenter->legacy($property));

        return $native->concat($legacy)->sortByDesc('posted_at')->values();
    }

    public function resolveProvider(string $source, string $id): ?Account
    {
        if ($source === 'native') {
            return Listing::query()->find($id)?->provider;
        }

        if ($source === 'legacy_property') {
            $legacyUserId = DB::table('property')->where('pro_id', $id)->value('userid');

            return $legacyUserId === null
                ? null
                : Account::query()->where('legacy_user_id', (int) $legacyUserId)->first();
        }

        return null;
    }

    private function nativePublicQuery(Request $request): \Illuminate\Database\Eloquent\Builder
    {
        $query = Listing::query()
            ->where('approval_status', 'approved')
            ->where('provider_status', 'active')
            ->where('capacity_status', 'eligible');

        $this->applyNativeFilters($query, $request);

        return $query->latest();
    }

    private function legacyQuery(Request $request): Builder
    {
        $query = DB::table('property as p')
            ->leftJoin('city as c', 'p.pro_city', '=', 'c.id')
            ->leftJoin('localities as l', 'p.por_location', '=', 'l.lid')
            ->leftJoin('property_cat as pc', 'p.pro_cat', '=', 'pc.id')
            ->leftJoin('prperty_for as pf', 'p.pro_for', '=', 'pf.id')
            ->select(['p.*', 'c.city as resolved_city', 'l.lname as resolved_location', 'pc.name as resolved_property_type', 'pf.name as resolved_listing_type'])
            ->where('p.is_delete', 0);
        $search = trim((string) $request->input('search'));

        if ($search !== '') {
            $query->where(function (Builder $nested) use ($search): void {
                $like = '%'.$search.'%';
                $nested->where('p.pro_name', 'like', $like)->orWhere('l.lname', 'like', $like)->orWhere('c.city', 'like', $like);
            });
        }

        $this->applyLegacyStringFilter($query, 'city', 'c.city', $request);
        $this->applyLegacyStringFilter($query, 'property_type', 'pc.name', $request);
        $this->applyLegacyStringFilter($query, 'furnishing', 'p.furnishing', $request);

        if ($request->filled('bhk')) {
            $query->where('p.por_bed', 'like', '%'.$request->input('bhk').'%');
        }

        // The supplied production dump is MySQL 5.7 compatible, so this deliberately
        // avoids REGEXP_REPLACE, which was introduced in MySQL 8.
        if ($request->filled('min_price')) {
            $query->whereRaw('CAST(p.por_money AS DECIMAL(14,2)) >= ?', [$request->input('min_price')]);
        }
        if ($request->filled('max_price')) {
            $query->whereRaw('CAST(p.por_money AS DECIMAL(14,2)) <= ?', [$request->input('max_price')]);
        }

        return $query->orderByDesc('p.time');
    }

    private function applyNativeFilters(\Illuminate\Database\Eloquent\Builder $query, Request $request): void
    {
        $search = trim((string) $request->input('search'));
        if ($search !== '') {
            $query->where(function ($nested) use ($search): void {
                $like = '%'.$search.'%';
                $nested->where('title', 'like', $like)->orWhere('location', 'like', $like)->orWhere('city', 'like', $like);
            });
        }

        foreach (['city', 'property_type', 'listing_type', 'furnishing'] as $filter) {
            if ($request->filled($filter) && ! in_array($request->input($filter), ['All', 'All Cities'], true)) {
                $query->where($filter, $request->input($filter));
            }
        }

        foreach (['bhk' => 'bedrooms', 'bathrooms' => 'bathrooms'] as $input => $column) {
            if ($request->filled($input)) {
                $query->where($column, 'like', '%'.$request->input($input).'%');
            }
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }
        if ($request->filled('min_area')) {
            $query->where('area', '>=', $request->input('min_area'));
        }
        if ($request->filled('max_area')) {
            $query->where('area', '<=', $request->input('max_area'));
        }
        if ($request->filled('amenities')) {
            foreach (explode(',', (string) $request->input('amenities')) as $amenity) {
                $query->whereJsonContains('amenities', trim($amenity));
            }
        }
    }

    private function applyLegacyStringFilter(Builder $query, string $input, string $column, Request $request): void
    {
        $value = $request->input($input);
        if ($value !== null && ! in_array($value, ['All', 'All Cities'], true)) {
            $query->where($column, $value);
        }
    }
}
