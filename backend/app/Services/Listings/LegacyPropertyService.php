<?php

namespace App\Services\Listings;

use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LegacyPropertyService
{
    /** @param array<string, mixed> $data */
    public function create(Account $provider, array $data): object
    {
        $legacyUserId = $this->legacyUserId($provider);
        $now = now();
        $propertyId = $this->insertProperty($this->payload($provider, $legacyUserId, $data, [
            'status' => 0,
            'mobile_status' => 'pending',
            'submitted_at' => $now,
            'source' => 'mobile',
            'postdate' => $now->toDateString(),
            'add_time' => $now->format('Y-m-d H:i:s'),
            'is_delete' => 0,
        ]), 'pro_id');

        $this->syncGallery($propertyId, $data['gallery_images'] ?? []);
        $this->history($propertyId, null, 'pending', null, 'mobile_app');

        return $this->find($propertyId);
    }

    /** @param array<string, mixed> $data */
    public function update(Account $provider, int $propertyId, array $data): object
    {
        $property = $this->owned($provider, $propertyId);
        $previousStatus = $this->workflowStatus($property);
        $updates = $this->payload($provider, $this->legacyUserId($provider), $data, []);
        $updates['status'] = 0;
        $updates['mobile_status'] = 'pending';
        $updates['submitted_at'] = now();
        $updates['approved_at'] = null;
        $updates['approved_by'] = null;
        $updates['rejection_reason'] = null;

        DB::table('property')->where('pro_id', $propertyId)->update($updates);
        if (array_key_exists('gallery_images', $data)) {
            $this->syncGallery($propertyId, $data['gallery_images'] ?? []);
        }
        $this->history($propertyId, $previousStatus, 'pending', null, 'mobile_app');

        return $this->find($propertyId);
    }

    public function changeProviderStatus(Account $provider, int $propertyId, string $action): object
    {
        $property = $this->owned($provider, $propertyId);
        $from = $this->workflowStatus($property);
        $to = match ($action) {
            'paused' => 'paused',
            'archived' => 'archived',
            'restore' => 'pending',
            'delete' => 'archived',
        };
        $updates = ['status' => 0, 'mobile_status' => $to];
        if ($action === 'restore') {
            $updates['submitted_at'] = now();
        }
        if ($action === 'delete') {
            $updates['is_delete'] = 1;
            $updates['delete_date'] = now();
            $updates['delete_by'] = $this->legacyUserId($provider);
        }
        DB::table('property')->where('pro_id', $propertyId)->update($updates);
        $this->history($propertyId, $from, $to, null, 'mobile_app');

        return $this->find($propertyId);
    }

    public function owned(Account $provider, int $propertyId): object
    {
        $property = DB::table('property')
            ->where('pro_id', $propertyId)
            ->where('userid', (string) $this->legacyUserId($provider))
            ->where(function ($query): void {
                $query->where('is_delete', 0)->orWhereNull('is_delete');
            })
            ->first();

        abort_if($property === null, 404, 'Property not found.');

        return $property;
    }

    public function find(int $propertyId): object
    {
        $property = DB::table('property as p')
            ->leftJoin('city as c', 'p.pro_city', '=', 'c.id')
            ->leftJoin('localities as l', 'p.por_location', '=', 'l.lid')
            ->leftJoin('property_cat as pc', 'p.pro_cat', '=', 'pc.id')
            ->leftJoin('prperty_for as pf', 'p.pro_for', '=', 'pf.id')
            ->select(['p.*', 'c.city as resolved_city', 'l.lname as resolved_location', 'pc.name as resolved_property_type', 'pf.name as resolved_listing_type'])
            ->where('p.pro_id', $propertyId)
            ->first();

        abort_if($property === null, 404, 'Property not found.');

        return $property;
    }

    /** @param array<string, mixed> $data @param array<string, mixed> $state @return array<string, mixed> */
    private function payload(Account $provider, int $legacyUserId, array $data, array $state): array
    {
        $category = DB::table('property_cat')->where('id', $data['category_id'])->first();
        $city = DB::table('city')->where('id', $data['city_id'])->first();
        $locality = DB::table('localities')->where('lid', $data['locality_id'])->where('lcity', (string) $data['city_id'])->first();
        if ($category === null || $city === null || $locality === null) {
            throw ValidationException::withMessages(['location' => ['Choose a valid property category, city, and locality.']]);
        }

        $price = (string) $data['price'];
        $gallery = array_values(array_filter($data['gallery_images'] ?? [], 'is_string'));
        $images = array_pad(array_slice($gallery, 0, 5), 5, null);
        $listingType = strtolower((string) $data['listing_type']) === 'rent' ? '1' : '2';

        return array_merge([
            'pro_for' => $listingType,
            'pro_type' => (string) $category->type,
            'pro_cat' => $category->id,
            'pro_name' => $data['title'],
            'pro_city' => (string) $city->id,
            'por_location' => (string) $locality->lid,
            'por_builder' => $provider->company_name ?: $provider->name ?: 'InvestorMart Provider',
            'por_size' => (string) ($data['area'] ?? ''),
            'por_sq1' => (string) ($data['area_unit'] ?? 'Sq Ft'),
            'por_plan' => (string) ($data['furnishing'] ?? ''),
            'por_inr' => $price,
            'por_money' => $price,
            'por_unit' => $data['price_unit'] ?? 'Total Price',
            'ppunit' => $data['price_per_unit'] ?? null,
            'por_sq2' => (string) ($data['plot_area_unit'] ?? ''),
            'por_sub' => (string) ($data['sub_type'] ?? ''),
            'por_bed' => (string) ($data['configuration'] ?? $data['bedrooms'] ?? ''),
            'pro_bath' => $data['bathrooms'] ?? null,
            'pro_bal' => $data['balconies'] ?? null,
            'por_logo' => $data['cover_image'],
            'por_contact' => $data['contact_phone'],
            'por_overview' => $data['description'] ?? null,
            'por_img_1' => $images[0], 'por_img_2' => $images[1], 'por_img_3' => $images[2], 'por_img_4' => $images[3], 'por_img_5' => $images[4],
            'pro_posdate' => $data['possession_date'] ?? null,
            'pro_pstatus' => $data['possession_status'] ?? null,
            'amenities' => implode(',', $data['amenity_ids'] ?? []),
            'floor_number' => $data['floor_number'] ?? null,
            'totalFloorNumber' => $data['total_floors'] ?? null,
            'transactionType' => $data['transaction_type'] ?? null,
            'property_age' => $data['property_age'] ?? null,
            'proj' => $data['project_name'] ?? null,
            'projid' => $data['project_id'] ?? 0,
            'video_link' => $data['video_link'] ?? null,
            'reserve_Parking' => ! empty($data['reserved_parking']) ? 1 : 0,
            'visitor_Parking' => ! empty($data['visitor_parking']) ? 1 : 0,
            'userid' => (string) $legacyUserId,
            'crore' => $price >= 10000000 ? 1 : 0,
            'lakh' => $price >= 100000 ? 1 : 0,
            'thousand' => $price >= 1000 ? 1 : 0,
            'hundred' => $price >= 100 ? 1 : 0,
        ], $state);
    }

    /** @param array<int, mixed> $gallery */
    private function syncGallery(int $propertyId, array $gallery): void
    {
        foreach (array_slice(array_values(array_filter($gallery, 'is_string')), 5) as $filename) {
            DB::table('project_galery')->insert([
                'galery_image' => $filename, 'reference_id' => $propertyId, 'type' => 2, 'is_delete' => 0, 'add_time' => now(),
            ]);
        }
    }

    private function history(int $propertyId, ?string $from, string $to, ?string $reason, string $source): void
    {
        DB::table('property_status_history')->insert([
            'property_id' => $propertyId, 'from_status' => $from, 'to_status' => $to, 'reason' => $reason,
            'acted_at' => now(), 'source' => $source,
        ]);
    }

    private function workflowStatus(object $property): string
    {
        return $property->mobile_status ?: ((int) $property->status === 1 ? 'approved' : 'pending');
    }

    private function legacyUserId(Account $provider): int
    {
        abort_if($provider->legacy_user_id === null, 422, 'Your provider account is not linked to a legacy user.');

        return (int) $provider->legacy_user_id;
    }

    /** @param array<string, mixed> $payload */
    private function insertProperty(array $payload): int
    {
        $idColumn = DB::selectOne("SHOW COLUMNS FROM `property` WHERE Field = 'pro_id'");
        $isAutoIncrement = str_contains(strtolower((string) ($idColumn->Extra ?? '')), 'auto_increment');

        if ($isAutoIncrement) {
            return (int) DB::table('property')->insertGetId($payload, 'pro_id');
        }

        // The supplied local dump omits AUTO_INCREMENT from property.pro_id.
        // Production should retain AUTO_INCREMENT; this fallback only lets the
        // exact dump be used locally without altering a legacy definition.
        $propertyId = ((int) DB::table('property')->max('pro_id')) + 1;
        DB::table('property')->insert(array_merge(['pro_id' => $propertyId], $payload));

        return $propertyId;
    }
}
