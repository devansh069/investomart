<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProviderSubscription extends Model
{
    use HasUuids;

    protected $table = 'im_provider_subscriptions';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'expires_at' => 'datetime'];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'provider_account_id');
    }
}
