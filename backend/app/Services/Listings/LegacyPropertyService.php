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
        $category = isset($data['category_id'])
            ? DB::table('property_cat')->where('id', $data['category_id'])->first()
            : $this->categoryByDisplayName((string) ($data['property_type'] ?? ''));
        $city = isset($data['city_id'])
            ? DB::table('city')->where('id', $data['city_id'])->first()
            : DB::table('city')->where('city', 'like', '%'.trim((string) ($data['city'] ?? '')).'%')->orderBy('id')->first();
        $locality = isset($data['locality_id'])
            ? DB::table('localities')->where('lid', $data['locality_id'])->where('lcity', (string) $city?->id)->first()
            : $this->localityByDisplayName((string) ($data['location'] ?? ''), (string) $city?->id);
        if ($category === null || $city === null || $locality === null) {
            throw ValidationException::withMessages(['location' => ['Choose a valid property category, city, and locality.']]);
        }

        $price = (string) $data['price'];
        $gallery = array_values(array_filter($data['gallery_images'] ?? [], 'is_string'));
        $images = array_pad(array_slice($gallery, 0, 7), 7, null);
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
            // A real S3 filename is required in production. Until device
            // upload is wired, leave the legacy filename empty so the mobile
            // client uses its existing visual fallback rather than requesting
            // a non-existent object from S3.
            'por_logo' => $data['cover_image'] ?? null,
            'por_contact' => $data['contact_phone'],
            'por_overview' => $data['description'] ?? null,
            'por_locationmap' => $data['address'] ?? null,
            'por_other_pro' => isset($data['deposit']) ? 'Security Deposit: '.((string) $data['deposit']) : null,
            'por_rent' => $data['rent_details'] ?? null,
            'bus' => $data['nearby_bus'] ?? null,
            'rls' => $data['nearby_railway'] ?? null,
            'atm' => $data['nearby_atm'] ?? null,
            'school' => $data['nearby_school'] ?? null,
            'hospital' => $data['nearby_hospital'] ?? null,
            'por_other_feat' => $data['other_features'] ?? null,
            'por_img_1' => $images[0], 'por_img_2' => $images[1], 'por_img_3' => $images[2], 'por_img_4' => $images[3], 'por_img_5' => $images[4],
            'por_img_6' => $images[5], 'por_img_7' => $images[6],
            'pro_posdate' => $data['possession_date'] ?? null,
            'pro_pstatus' => $data['possession_status'] ?? null,
            'pro_locmap' => $data['map_location'] ?? null,
            'amenities' => implode(',', $this->amenityIds($data)),
            'floor_number' => $data['floor_number'] ?? null,
            'totalFloorNumber' => $data['total_floors'] ?? null,
            'transactionType' => $data['transaction_type'] ?? null,
            'property_age' => $data['property_age'] ?? null,
            'completiondatem' => $data['completion_date'] ?? null,
            'availFromMonth' => $data['available_from_month'] ?? null,
            'maintenance' => $data['maintenance'] ?? null,
            'brokerExcuse' => $data['broker_excuse'] ?? null,
            'pooja_rooms' => $data['pooja_rooms'] ?? null,
            'study_rooms' => $data['study_rooms'] ?? null,
            'servant_rooms' => $data['servant_rooms'] ?? null,
            'others_rooms' => $data['other_rooms'] ?? null,
            'parking' => $data['parking'] ?? null,
            'overlooking' => $data['overlooking'] ?? null,
            'flat_view' => $data['flat_view'] ?? null,
            'facing' => $data['facing'] ?? null,
            'floor_number' => $data['floor_number'] ?? null,
            'super_area' => $data['super_area'] ?? null,
            'project_area' => $data['project_area'] ?? null,
            'configuration' => $data['configuration'] ?? $data['bedrooms'] ?? null,
            'transaction_type' => $data['transaction_type'] ?? null,
            'total_unit' => $data['total_units'] ?? null,
            'total_tower' => $data['total_towers'] ?? null,
            'car_parking' => $data['car_parking'] ?? null,
            'price_breakup' => $data['price_breakup'] ?? null,
            'booking_amount' => $data['booking_amount'] ?? null,
            'unit_no' => $data['unit_number'] ?? null,
            'landmarks' => $data['landmarks'] ?? null,
            'flooring' => $data['flooring'] ?? null,
            'type_of_ownership' => $data['type_of_ownership'] ?? null,
            'additional_rooms' => $data['additional_rooms'] ?? null,
            'water_availability' => $data['water_availability'] ?? null,
            'status_of_electricity' => $data['status_of_electricity'] ?? null,
            'proj' => $data['project_name'] ?? null,
            'projid' => $data['project_id'] ?? 0,
            'video_link' => $data['video_link'] ?? null,
            'reserve_Parking' => ! empty($data['reserved_parking']) ? 1 : 0,
            'visitor_Parking' => ! empty($data['visitor_parking']) ? 1 : 0,
            'garden' => ! empty($data['garden']) ? 1 : 0,
            'swimming' => ! empty($data['swimming']) ? 1 : 0,
            'powerbackup' => ! empty($data['power_backup']) ? 1 : 0,
            'lift' => ! empty($data['lift']) ? 1 : 0,
            'club' => ! empty($data['club']) ? 1 : 0,
            'security' => ! empty($data['security']) ? 1 : 0,
            'gym' => ! empty($data['gym']) ? 1 : 0,
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
        foreach (array_slice(array_values(array_filter($gallery, 'is_string')), 7) as $filename) {
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

    private function categoryByDisplayName(string $displayName): ?object
    {
        $needle = match (strtolower(trim($displayName))) {
            'apartment' => 'Apartment',
            'villa' => 'Villa',
            'independent house' => 'Independent',
            'plot/land' => 'Plot',
            default => trim($displayName),
        };

        return $needle === '' ? null : DB::table('property_cat')->where('name', 'like', '%'.$needle.'%')->orderBy('id')->first();
    }

    private function localityByDisplayName(string $displayName, string $cityId): ?object
    {
        if ($displayName === '' || $cityId === '') {
            return null;
        }

        return DB::table('localities')
            ->where('lcity', $cityId)
            ->whereRaw('? LIKE CONCAT("%", lname, "%")', [$displayName])
            ->orderByRaw('CHAR_LENGTH(lname) DESC')
            ->first();
    }

    /** @param array<string, mixed> $data @return array<int, int> */
    private function amenityIds(array $data): array
    {
        if (! empty($data['amenity_ids'])) {
            return array_map('intval', $data['amenity_ids']);
        }

        $aliases = [
            'Covered Parking' => ['Reserved Car Parking'],
            'Swimming Pool' => ['Swimming Pool'],
            'Clubhouse & Gym' => ['Club House', 'Gym'],
            '24/7 Security' => ['Security'],
            'Power Backup' => ['Power Backup'],
            'Lift & Elevator' => ['Elevators'],
            'High Speed WiFi' => ['Wi-Fi'],
            'CCTV Surveillance' => ['Security'],
        ];
        $ids = [];
        foreach ($data['amenities'] ?? [] as $name) {
            foreach ($aliases[$name] ?? [$name] as $needle) {
                $id = DB::table('amenities')->where('name', 'like', '%'.$needle.'%')->value('id');
                if ($id !== null) {
                    $ids[] = (int) $id;
                }
            }
        }

        return array_values(array_unique($ids));
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
