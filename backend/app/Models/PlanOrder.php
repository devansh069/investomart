<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanOrder extends Model
{
    use HasUuids;

    protected $table = 'im_plan_orders';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['gateway_payload' => 'array', 'paid_at' => 'datetime'];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'provider_account_id');
    }
}
