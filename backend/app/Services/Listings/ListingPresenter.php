<?php

namespace App\Services\Listings;

use App\Models\Listing;
use Illuminate\Support\Str;

class ListingPresenter
{
    /** @return array<string, mixed> */
    public function native(Listing $listing): array
    {
        $listing->loadMissing(['provider', 'media']);
        $images = $listing->media->map(fn ($media): ?string => $media->url ?: $this->mediaUrl($media->object_key))->filter()->values()->all();
        $primary = $listing->primary_image_url ?: ($images[0] ?? null);

        return [
            'id' => 'native:'.$listing->id,
            'source' => 'native',
            'source_id' => $listing->id,
            'reference' => $listing->reference,
            'read_only' => false,
            'title' => $listing->title,
            'provider' => [
                'id' => (string) $listing->provider_account_id,
                'name' => $listing->provider?->company_name ?: $listing->provider?->name ?: 'InvestorMart Provider',
                'phone' => $listing->contact_phone ?: $listing->provider?->phone,
                'verified' => $listing->provider?->phone_verified_at !== null,
                'type' => $listing->provider?->provider_type,
            ],
            'type' => $listing->property_type,
            'listing_type' => $listing->listing_type,
            'bhk' => $this->bedrooms($listing->bedrooms),
            'bedrooms_label' => $listing->bedrooms,
            'bathrooms' => $listing->bathrooms,
            'price' => (float) $listing->price,
            'price_display' => $this->priceDisplay((float) $listing->price, $listing->listing_type, $listing->price_period),
            'deposit' => $listing->deposit === null ? null : (float) $listing->deposit,
            'area_sqft' => $listing->area === null ? null : (float) $listing->area,
            'area_unit' => $listing->area_unit,
            'furnishing' => $listing->furnishing,
            'city' => $listing->city,
            'location' => $listing->location,
            'address' => $listing->address,
            'description' => $listing->description,
            'amenities' => $listing->amenities ?? [],
            'image_url' => $primary,
            'images' => $images,
            'status' => $this->status($listing),
            'approval_status' => $listing->approval_status,
            'provider_status' => $listing->provider_status,
            'capacity_status' => $listing->capacity_status,
            'posted_at' => $listing->created_at?->toIso8601String(),
            'views_count' => $listing->views_count,
            'inquiries_count' => 0,
            'details' => $listing->details ?? [],
        ];
    }

    /** @param object $property @return array<string, mixed> */
    public function legacy(object $property, bool $readOnly = true): array
    {
        $image = $this->legacyUrl($property->por_img_1 ?? $property->por_baner ?? $property->por_logo ?? null);
        $amenities = array_values(array_filter(array_map('trim', explode(',', (string) ($property->amenities ?? '')))));
        $price = $this->legacyPrice($property);

        return [
            'id' => 'legacy_property:'.$property->pro_id,
            'source' => 'legacy_property',
            'source_id' => (string) $property->pro_id,
            'read_only' => $readOnly,
            'title' => $property->pro_name ?: 'Property listing',
            'provider' => [
                'id' => (string) ($property->userid ?? ''),
                'name' => $property->por_builder ?: 'InvestorMart Provider',
                'phone' => $property->por_contact,
                'verified' => false,
                'type' => null,
            ],
            'type' => ($property->resolved_property_type ?? null) ?: ($property->property_type ?? null) ?: ($property->pro_type ?? null) ?: 'Property',
            'listing_type' => Str::title(strtolower((string) (($property->resolved_listing_type ?? null) ?: ($property->pro_for ?? null) ?: 'Sale'))),
            'bhk' => $this->bedrooms($property->por_bed ?? null),
            'bedrooms_label' => $property->por_bed,
            'bathrooms' => $this->numeric($property->pro_bath ?? null),
            'price' => $price,
            'price_display' => $price === null ? null : '₹'.number_format($price, 0, '.', ','),
            'deposit' => null,
            'area_sqft' => $this->numeric($property->por_size ?? $property->super_area ?? null),
            'area_unit' => $property->por_sq1 ?: 'Sq Ft',
            'furnishing' => $property->por_plan ?? null,
            'city' => ($property->resolved_city ?? null) ?: ($property->pro_city ?? null) ?: '',
            'location' => ($property->resolved_location ?? null) ?: ($property->por_location ?? null) ?: '',
            'address' => ($property->por_locationmap ?? null) ?: ($property->resolved_location ?? null) ?: ($property->por_location ?? null) ?: '',
            'description' => $property->por_overview ?: '',
            'amenities' => $amenities,
            'image_url' => $image,
            'images' => array_values(array_filter(array_map(fn ($key) => $this->legacyUrl($property->{$key} ?? null), ['por_img_1', 'por_img_2', 'por_img_3', 'por_img_4', 'por_img_5', 'por_img_6', 'por_img_7']))),
            'status' => $this->legacyWorkflowStatus($property),
            'approval_status' => $this->legacyApprovalStatus($property),
            'provider_status' => in_array(($property->mobile_status ?? null), ['paused', 'archived'], true) ? $property->mobile_status : 'active',
            'capacity_status' => 'legacy',
            'posted_at' => $property->time ?? null,
            'views_count' => (int) ($property->pageview ?? 0),
            'inquiries_count' => 0,
            'details' => ['legacy_project_id' => $property->project_id ?? $property->projid ?? null],
        ];
    }

    private function status(Listing $listing): string
    {
        if ($listing->approval_status === 'draft') {
            return 'DRAFT';
        }
        if ($listing->approval_status === 'pending') {
            return 'PENDING';
        }
        if ($listing->approval_status === 'rejected') {
            return 'REJECTED';
        }
        if ($listing->provider_status === 'archived') {
            return 'ARCHIVED';
        }
        if ($listing->provider_status === 'paused') {
            return 'PAUSED';
        }
        if ($listing->capacity_status === 'plan_hold') {
            return 'PLAN_HOLD';
        }

        return 'ACTIVE';
    }

    private function bedrooms(?string $value): ?int
    {
        return preg_match('/\d+/', (string) $value, $matches) === 1 ? (int) $matches[0] : null;
    }

    private function numeric(mixed $value): ?float
    {
        $number = preg_replace('/[^0-9.]/', '', (string) $value) ?? '';

        return $number === '' ? null : (float) $number;
    }

    private function legacyPrice(object $property): ?float
    {
        $stored = $this->numeric($property->por_money ?? $property->por_inr ?? null);
        if ($stored !== null && $stored > 0) {
            return $stored;
        }

        return ((int) ($property->crore ?? 0) * 10000000)
            + ((int) ($property->lakh ?? 0) * 100000)
            + ((int) ($property->thousand ?? 0) * 1000)
            + ((int) ($property->hundred ?? 0) * 100) ?: null;
    }

    private function legacyWorkflowStatus(object $property): string
    {
        return match ($property->mobile_status ?? null) {
            'rejected' => 'REJECTED', 'paused' => 'PAUSED', 'archived' => 'ARCHIVED',
            'pending' => 'PENDING', default => (int) ($property->status ?? 0) === 1 ? 'ACTIVE' : 'PENDING',
        };
    }

    private function legacyApprovalStatus(object $property): string
    {
        return ($property->mobile_status ?? null) ?: ((int) ($property->status ?? 0) === 1 ? 'approved' : 'pending');
    }

    private function priceDisplay(float $price, string $listingType, ?string $period): string
    {
        $display = '₹'.number_format($price, 0, '.', ',');

        return strtolower($listingType) === 'rent' && $period !== null ? $display.' '.$period : $display;
    }

    private function legacyUrl(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }
        $base = config('investormart.legacy_media_base_url');

        if (blank($base)) {
            return null;
        }

        $path = ltrim($value, '/');
        if (! str_contains($path, '/')) {
            $prefix = config('investormart.legacy_property_media_prefix');
            $path = blank($prefix) ? $path : trim($prefix, '/').'/'.$path;
        }

        return $base.'/'.$path;
    }

    private function mediaUrl(?string $objectKey): ?string
    {
        if (blank($objectKey)) {
            return null;
        }

        $base = config('investormart.media_public_base_url');

        return blank($base) ? null : $base.'/'.ltrim($objectKey, '/');
    }
}
