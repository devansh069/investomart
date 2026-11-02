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
            // ID fields are the production contract. The matching display-name
            // fields keep the already-built mobile form usable during the
            // transition to master-data dropdowns.
            'category_id' => ['nullable', 'integer', 'exists:property_cat,id'],
            'property_type' => ['nullable', 'string', 'max:100', 'required_without:category_id'],
            'city_id' => ['nullable', 'integer', 'exists:city,id'],
            'city' => ['nullable', 'string', 'max:120', 'required_without:city_id'],
            'locality_id' => ['nullable', 'integer', 'exists:localities,lid'],
            'location' => ['nullable', 'string', 'max:180', 'required_without:locality_id'],
            'price' => ['required', 'numeric', 'min:1', 'max:999999999999'],
            'cover_image' => ['nullable', 'string', 'max:255', 'regex:/^[A-Za-z0-9._/-]+$/'],
            'primary_image_url' => ['nullable', 'url', 'max:2048'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'configuration' => ['nullable', 'string', 'max:30'], 'bedrooms' => ['nullable', 'string', 'max:30'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:99'], 'balconies' => ['nullable', 'integer', 'min:0', 'max:99'],
            'area' => ['nullable', 'numeric', 'min:0'], 'area_unit' => ['nullable', 'string', 'max:20'],
            'furnishing' => ['nullable', 'string', 'max:100'], 'property_age' => ['nullable', 'string', 'max:100'],
            'deposit' => ['nullable', 'numeric', 'min:0'], 'address' => ['nullable', 'string', 'max:1000'],
            'possession_status' => ['nullable', 'string', 'max:255'], 'possession_date' => ['nullable', 'date'],
            'description' => ['nullable', 'string', 'max:10000'], 'gallery_images' => ['nullable', 'array', 'max:20'],
            'gallery_images.*' => ['string', 'max:255', 'regex:/^[A-Za-z0-9._/-]+$/'],
            'media' => ['nullable', 'array', 'max:20'],
            'video_link' => ['nullable', 'url', 'max:255'], 'project_id' => ['nullable', 'integer', 'exists:bilder_proj,pid'],
            'project_name' => ['nullable', 'string', 'max:255'], 'floor_number' => ['nullable', 'string', 'max:255'],
            'total_floors' => ['nullable', 'string', 'max:255'], 'facing' => ['nullable', 'string', 'max:100'],
            'reserved_parking' => ['nullable', 'boolean'], 'visitor_parking' => ['nullable', 'boolean'],
            'amenity_ids' => ['nullable', 'array', 'max:50'], 'amenity_ids.*' => ['integer', 'exists:amenities,id'],
            'amenities' => ['nullable', 'array', 'max:50'], 'amenities.*' => ['string', 'max:100'],
            'transaction_type' => ['nullable', 'string', 'max:255'], 'price_unit' => ['nullable', 'string', 'max:100'],
            'price_per_unit' => ['nullable', 'string', 'max:255'], 'sub_type' => ['nullable', 'string', 'max:100'],
            'plot_area_unit' => ['nullable', 'string', 'max:20'],
            'garden' => ['nullable', 'boolean'], 'swimming' => ['nullable', 'boolean'], 'power_backup' => ['nullable', 'boolean'],
            'lift' => ['nullable', 'boolean'], 'club' => ['nullable', 'boolean'], 'security' => ['nullable', 'boolean'], 'gym' => ['nullable', 'boolean'],
            'rent_details' => ['nullable', 'string', 'max:10000'], 'nearby_bus' => ['nullable', 'string', 'max:255'],
            'nearby_railway' => ['nullable', 'string', 'max:255'], 'nearby_atm' => ['nullable', 'string', 'max:255'],
            'nearby_school' => ['nullable', 'string', 'max:255'], 'nearby_hospital' => ['nullable', 'string', 'max:255'],
            'other_features' => ['nullable', 'string', 'max:10000'], 'map_location' => ['nullable', 'string', 'max:255'],
            'completion_date' => ['nullable', 'date'], 'available_from_month' => ['nullable', 'string', 'max:255'],
            'maintenance' => ['nullable', 'string', 'max:100'], 'broker_excuse' => ['nullable', 'string', 'max:255'],
            'pooja_rooms' => ['nullable', 'string', 'max:255'], 'study_rooms' => ['nullable', 'string', 'max:255'],
            'servant_rooms' => ['nullable', 'string', 'max:255'], 'other_rooms' => ['nullable', 'string', 'max:255'],
            'parking' => ['nullable', 'string', 'max:255'], 'overlooking' => ['nullable', 'string', 'max:255'],
            'flat_view' => ['nullable', 'string', 'max:255'], 'super_area' => ['nullable', 'string', 'max:255'],
            'project_area' => ['nullable', 'string', 'max:255'], 'average_price' => ['nullable', 'string', 'max:255'],
            'total_units' => ['nullable', 'string', 'max:255'], 'total_towers' => ['nullable', 'string', 'max:255'],
            'car_parking' => ['nullable', 'integer', 'min:0', 'max:99'], 'price_breakup' => ['nullable', 'string', 'max:255'],
            'booking_amount' => ['nullable', 'string', 'max:255'], 'unit_number' => ['nullable', 'string', 'max:255'],
            'landmarks' => ['nullable', 'string', 'max:255'], 'flooring' => ['nullable', 'string', 'max:255'],
            'type_of_ownership' => ['nullable', 'string', 'max:255'], 'additional_rooms' => ['nullable', 'string', 'max:255'],
            'water_availability' => ['nullable', 'string', 'max:255'], 'status_of_electricity' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
