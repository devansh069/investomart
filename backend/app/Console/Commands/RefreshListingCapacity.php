<?php

namespace App\Console\Commands;

use App\Models\Account;
use App\Services\Listings\ListingCapacityService;
use Illuminate\Console\Command;

class RefreshListingCapacity extends Command
{
    protected $signature = 'investormart:refresh-listing-capacity';

    protected $description = 'Expire provider plans and move excess approved listings to or from plan hold.';

    public function handle(ListingCapacityService $capacity): int
    {
        $processed = 0;

        Account::query()
            ->where(function ($query): void {
                $query->whereHas('listings')
                    ->orWhereHas('subscriptions');
            })
            ->orderBy('id')
            ->chunkById(100, function ($providers) use ($capacity, &$processed): void {
                foreach ($providers as $provider) {
                    $capacity->rebalance($provider);
                    $processed++;
                }
            });

        $this->info("Refreshed listing capacity for {$processed} provider account(s).");

        return self::SUCCESS;
    }
}
