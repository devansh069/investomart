<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inquiry extends Model
{
    use HasUuids;

    protected $table = 'im_inquiries';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['metadata' => 'array', 'contacted_at' => 'datetime'];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'provider_account_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'client_account_id');
    }
}
