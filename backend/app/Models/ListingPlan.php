<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingPlan extends Model
{
    protected $table = 'im_listing_plans';

    protected $primaryKey = 'code';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['metadata' => 'array', 'is_active' => 'boolean'];
    }
}
