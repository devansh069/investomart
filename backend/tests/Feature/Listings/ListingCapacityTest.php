<?php

namespace Tests\Feature\Listings;

use App\Models\Account;
use App\Models\Listing;
use App\Models\ProviderSubscription;
use App\Services\Listings\ListingCapacityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ListingCapacityTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_capacity_holds_excess_listings_and_paid_capacity_reactivates_them(): void
    {
        $provider = Account::query()->create([
            'phone' => '9876543210',
            'role' => 'builder',
            'provider_type' => 'builder',
        ]);

        foreach (range(1, 11) as $number) {
            Listing::query()->create([
                'id' => (string) Str::uuid(),
                'provider_account_id' => $provider->id,
                'reference' => 'TEST-'.$number,
                'title' => "Test property {$number}",
                'property_type' => 'Apartment',
                'listing_type' => 'Rent',
                'price' => 25000,
                'city' => 'Noida',
                'location' => 'Sector 62',
                'approval_status' => 'approved',
                'provider_status' => 'active',
                'capacity_status' => 'eligible',
                'slot_priority' => $number,
                'approved_at' => now()->subMinutes(12 - $number),
            ]);
        }

        $capacity = app(ListingCapacityService::class);
        $capacity->rebalance($provider);

        $this->assertSame(10, Listing::query()->where('provider_account_id', $provider->id)->where('capacity_status', 'eligible')->count());
        $this->assertSame(1, Listing::query()->where('provider_account_id', $provider->id)->where('capacity_status', 'plan_hold')->count());

        ProviderSubscription::query()->create([
            'id' => (string) Str::uuid(),
            'provider_account_id' => $provider->id,
            'plan_code' => 'premium_20',
            'additional_slots' => 20,
            'status' => 'active',
            'starts_at' => now()->subMinute(),
            'expires_at' => now()->addDays(30),
        ]);
        $capacity->rebalance($provider);

        $this->assertSame(30, $capacity->capacityFor($provider));
        $this->assertSame(11, Listing::query()->where('provider_account_id', $provider->id)->where('capacity_status', 'eligible')->count());
    }
}
