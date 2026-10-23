<?php

namespace App\Http\Controllers\Api\V1\Provider;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Account;
use App\Models\Listing;
use App\Services\Listings\CatalogueService;
use App\Services\Listings\ListingCapacityService;
use App\Services\Listings\ListingPresenter;
use App\Services\Listings\ListingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProviderListingController extends ApiController
{
    public function dashboard(Request $request, CatalogueService $catalogue, ListingCapacityService $capacity): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        $capacity->rebalance($provider);
        $listings = $catalogue->providerListings($provider);

        return $this->success([
            'listing_capacity' => [
                'total' => $capacity->capacityFor($provider),
                'active' => $listings->where('status', 'ACTIVE')->count(),
                'plan_hold' => $listings->where('status', 'PLAN_HOLD')->count(),
            ],
            'listings' => $listings->values(),
            'summary' => [
                'pending' => $listings->where('status', 'PENDING')->count(),
                'paused' => $listings->where('status', 'PAUSED')->count(),
                'archived' => $listings->where('status', 'ARCHIVED')->count(),
            ],
        ]);
    }

    public function index(Request $request, CatalogueService $catalogue, ListingCapacityService $capacity): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        $capacity->rebalance($provider);

        return $this->success(['listings' => $catalogue->providerListings($provider)->values()]);
    }

    public function store(Request $request, ListingService $listings, ListingPresenter $presenter): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        $listing = $listings->create($provider, $this->validatedPayload($request));

        return $this->success(['listing' => $presenter->native($listing)], 'Property submitted for admin approval.', 201);
    }

    public function update(Request $request, string $id, ListingService $listings, ListingPresenter $presenter): JsonResponse
    {
        $listing = $this->owned($request, $id);
        $listing = $listings->update($listing, $this->validatedPayload($request));

        return $this->success(['listing' => $presenter->native($listing)], 'Property updated and submitted for approval.');
    }

    public function updateStatus(Request $request, string $id, ListingService $listings, ListingPresenter $presenter): JsonResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(['active', 'paused', 'archived'])]]);
        $listing = $listings->setProviderStatus($this->owned($request, $id), $validated['status']);

        return $this->success(['listing' => $presenter->native($listing)]);
    }

    private function owned(Request $request, string $id): Listing
    {
        $listing = Listing::query()->whereKey($id)->where('provider_account_id', $request->user()->id)->first();
        abort_if($listing === null, 404, 'Property not found.');

        return $listing;
    }

    /** @return array<string, mixed> */
    private function validatedPayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:180'],
            'property_type' => ['required', 'string', 'max:50'], 'listing_type' => ['required', Rule::in(['Rent', 'Sale', 'rent', 'sale'])],
            'price' => ['required', 'numeric', 'min:0'], 'price_period' => ['nullable', 'string', 'max:20'],
            'bedrooms' => ['nullable', 'string', 'max:20'], 'bathrooms' => ['nullable', 'integer', 'min:0', 'max:30'],
            'area' => ['nullable', 'numeric', 'min:0'], 'area_unit' => ['nullable', 'string', 'max:20'],
            'furnishing' => ['nullable', 'string', 'max:40'], 'deposit' => ['nullable', 'numeric', 'min:0'],
            'city' => ['required', 'string', 'max:120'], 'location' => ['required', 'string', 'max:180'], 'address' => ['nullable', 'string', 'max:1000'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'], 'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'description' => ['nullable', 'string', 'max:10000'], 'amenities' => ['nullable', 'array', 'max:50'], 'amenities.*' => ['string', 'max:80'],
            'details' => ['nullable', 'array'], 'contact_name' => ['nullable', 'string', 'max:120'], 'contact_phone' => ['nullable', 'string', 'max:20'],
            'primary_image_url' => ['nullable', 'url', 'max:2048'], 'media' => ['nullable', 'array', 'max:20'],
            'media.*' => ['nullable'],
        ]);
    }
}
