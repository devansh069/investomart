<?php

namespace App\Http\Controllers\Api\V1\Provider;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Account;
use App\Services\Listings\CatalogueService;
use App\Services\Listings\LegacyPropertyService;
use App\Services\Listings\ListingPresenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProviderListingController extends ApiController
{
    public function dashboard(Request $request, CatalogueService $catalogue): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        $listings = $catalogue->providerListings($provider);

        return $this->success([
            'listing_capacity' => ['total' => 10, 'active' => $listings->where('status', 'ACTIVE')->count(), 'plan_hold' => 0],
            'listings' => $listings->values(),
            'summary' => [
                'pending' => $listings->where('status', 'PENDING')->count(),
                'paused' => $listings->where('status', 'PAUSED')->count(),
                'archived' => $listings->where('status', 'ARCHIVED')->count(),
            ],
        ]);
    }

    public function index(Request $request, CatalogueService $catalogue): JsonResponse
    {
        return $this->success(['listings' => $catalogue->providerListings($request->user())->values()]);
    }

    public function store(Request $request, LegacyPropertyService $properties, ListingPresenter $presenter): JsonResponse
    {
        /** @var Account $provider */
        $provider = $request->user();
        $property = $properties->create($provider, $this->validatedPayload($request));

        return $this->success(['listing' => $presenter->legacy($property, false)], 'Property submitted for admin approval.', 201);
    }

    public function update(Request $request, int $id, LegacyPropertyService $properties, ListingPresenter $presenter): JsonResponse
    {
        $property = $properties->update($request->user(), $id, $this->validatedPayload($request));

        return $this->success(['listing' => $presenter->legacy($property, false)], 'Property updated and submitted for approval.');
    }

    public function updateStatus(Request $request, int $id, LegacyPropertyService $properties, ListingPresenter $presenter): JsonResponse
    {
        $validated = $request->validate(['status' => ['required', Rule::in(['paused', 'archived', 'restore', 'delete'])]]);
        $property = $properties->changeProviderStatus($request->user(), $id, $validated['status']);

        return $this->success(['listing' => $presenter->legacy($property, false)]);
    }

    /** @return array<string, mixed> */
    private function validatedPayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'min:3', 'max:100'],
            'listing_type' => ['required', Rule::in(['rent', 'sale', 'Rent', 'Sale'])],
            'category_id' => ['required', 'integer', 'exists:property_cat,id'],
            'city_id' => ['required', 'integer', 'exists:city,id'],
            'locality_id' => ['required', 'integer', 'exists:localities,lid'],
            'price' => ['required', 'numeric', 'min:1', 'max:999999999999'],
            'cover_image' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'configuration' => ['nullable', 'string', 'max:30'], 'bedrooms' => ['nullable', 'string', 'max:30'],
            'bathrooms' => ['nullable', 'string', 'max:20'], 'balconies' => ['nullable', 'string', 'max:20'],
            'area' => ['nullable', 'numeric', 'min:0'], 'area_unit' => ['nullable', 'string', 'max:20'],
            'furnishing' => ['nullable', 'string', 'max:100'], 'property_age' => ['nullable', 'string', 'max:100'],
            'possession_status' => ['nullable', 'string', 'max:255'], 'possession_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:10000'], 'gallery_images' => ['nullable', 'array', 'max:20'],
            'gallery_images.*' => ['string', 'max:255', 'regex:/^[A-Za-z0-9._-]+$/'],
            'video_link' => ['nullable', 'url', 'max:255'], 'project_id' => ['nullable', 'integer', 'exists:bilder_proj,pid'],
            'project_name' => ['nullable', 'string', 'max:255'], 'floor_number' => ['nullable', 'string', 'max:255'],
            'total_floors' => ['nullable', 'string', 'max:255'], 'facing' => ['nullable', 'string', 'max:100'],
            'reserved_parking' => ['nullable', 'boolean'], 'visitor_parking' => ['nullable', 'boolean'],
            'amenity_ids' => ['nullable', 'array', 'max:50'], 'amenity_ids.*' => ['integer', 'exists:amenities,id'],
            'transaction_type' => ['nullable', 'string', 'max:255'], 'price_unit' => ['nullable', 'string', 'max:100'],
            'price_per_unit' => ['nullable', 'string', 'max:255'], 'sub_type' => ['nullable', 'string', 'max:100'],
            'plot_area_unit' => ['nullable', 'string', 'max:20'],
        ]);
    }
}
