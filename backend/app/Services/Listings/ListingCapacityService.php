<?php

namespace App\Services\Listings;

use App\Models\Account;
use App\Models\Listing;
use App\Models\ProviderSubscription;
use Illuminate\Support\Facades\DB;

class ListingCapacityService
{
    public function capacityFor(Account $provider): int
    {
        $now = now(config('investormart.plan_timezone'));

        return (int) config('investormart.base_listing_slots')
            + (int) ProviderSubscription::query()
                ->where('provider_account_id', $provider->id)
                ->where('status', 'active')
                ->where('starts_at', '<=', $now)
                ->where('expires_at', '>', $now)
                ->sum('additional_slots');
    }

    public function rebalance(Account $provider): void
    {
        DB::transaction(function () use ($provider): void {
            $now = now(config('investormart.plan_timezone'));

            ProviderSubscription::query()
                ->where('provider_account_id', $provider->id)
                ->where('status', 'active')
                ->where('expires_at', '<=', $now)
                ->update(['status' => 'expired', 'updated_at' => now()]);

            $capacity = $this->capacityFor($provider);
            $eligibleIds = Listing::query()
                ->where('provider_account_id', $provider->id)
                ->where('approval_status', 'approved')
                ->where('provider_status', 'active')
                ->orderBy('slot_priority')
                ->orderBy('approved_at')
                ->orderBy('id')
                ->lockForUpdate()
                ->pluck('id')
                ->take($capacity)
                ->all();

            Listing::query()
                ->where('provider_account_id', $provider->id)
                ->where('approval_status', 'approved')
                ->where('provider_status', 'active')
                ->update(['capacity_status' => 'plan_hold', 'updated_at' => now()]);

            if ($eligibleIds !== []) {
                Listing::query()->whereIn('id', $eligibleIds)->update([
                    'capacity_status' => 'eligible',
                    'updated_at' => now(),
                ]);
            }
        });
    }
}
