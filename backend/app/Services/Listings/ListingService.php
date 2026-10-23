<?php

namespace App\Services\Listings;

use App\Models\Account;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListingService
{
    public function __construct(private readonly ListingCapacityService $capacity) {}

    /** @param array<string, mixed> $data */
    public function create(Account $provider, array $data): Listing
    {
        return DB::transaction(function () use ($provider, $data): Listing {
            $listing = Listing::query()->create(array_merge($this->payload($data), [
                'provider_account_id' => $provider->id,
                'reference' => $this->reference(),
                'approval_status' => 'pending',
                'provider_status' => 'active',
                'capacity_status' => 'eligible',
                'submitted_at' => now(),
                'slot_priority' => (int) Listing::query()->where('provider_account_id', $provider->id)->max('slot_priority') + 1,
            ]));

            $this->syncMedia($listing, $data['media'] ?? []);

            return $listing->load('media', 'provider');
        });
    }

    /** @param array<string, mixed> $data */
    public function update(Listing $listing, array $data): Listing
    {
        return DB::transaction(function () use ($listing, $data): Listing {
            $listing->fill($this->payload($data));
            if ($listing->approval_status === 'approved') {
                $listing->approval_status = 'pending';
                $listing->approved_at = null;
                $listing->review_note = null;
            }
            $listing->save();

            if (array_key_exists('media', $data)) {
                $this->syncMedia($listing, $data['media'] ?? []);
            }

            return $listing->fresh(['media', 'provider']);
        });
    }

    public function setProviderStatus(Listing $listing, string $status): Listing
    {
        $listing->update(['provider_status' => $status]);
        $this->capacity->rebalance($listing->provider);

        return $listing->fresh(['media', 'provider']);
    }

    /** @param array<int, mixed> $media */
    private function syncMedia(Listing $listing, array $media): void
    {
        $listing->media()->delete();
        foreach ($media as $index => $item) {
            $value = is_string($item) ? ['url' => $item] : $item;
            if (! is_array($value)) {
                continue;
            }
            $listing->media()->create([
                'disk' => $value['disk'] ?? 's3',
                'object_key' => $value['object_key'] ?? null,
                'url' => $value['url'] ?? null,
                'media_type' => $value['media_type'] ?? 'image',
                'sort_order' => $index,
                'metadata' => $value['metadata'] ?? null,
            ]);
        }
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function payload(array $data): array
    {
        return [
            'title' => $data['title'], 'property_type' => $data['property_type'], 'listing_type' => $data['listing_type'],
            'price' => $data['price'], 'price_period' => $data['price_period'] ?? null, 'bedrooms' => $data['bedrooms'] ?? null,
            'bathrooms' => $data['bathrooms'] ?? null, 'area' => $data['area'] ?? null, 'area_unit' => $data['area_unit'] ?? null,
            'furnishing' => $data['furnishing'] ?? null, 'deposit' => $data['deposit'] ?? null, 'city' => $data['city'],
            'location' => $data['location'], 'address' => $data['address'] ?? null, 'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null, 'description' => $data['description'] ?? null,
            'amenities' => $data['amenities'] ?? [], 'details' => $data['details'] ?? [],
            'contact_name' => $data['contact_name'] ?? null, 'contact_phone' => $data['contact_phone'] ?? null,
            'primary_image_url' => $data['primary_image_url'] ?? null,
        ];
    }

    private function reference(): string
    {
        do {
            $reference = 'IM-'.now()->format('ym').'-'.Str::upper(Str::random(7));
        } while (Listing::query()->where('reference', $reference)->exists());

        return $reference;
    }
}
