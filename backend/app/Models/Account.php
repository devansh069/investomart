<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Account extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'im_accounts';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'profile' => 'array',
            'phone_verified_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'provider_account_id');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ProviderSubscription::class, 'provider_account_id');
    }

    public function isProvider(): bool
    {
        return in_array($this->role, ['builder', 'owner', 'broker'], true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
