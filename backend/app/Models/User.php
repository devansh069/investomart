<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'mobile_number',
    'country_code',
    'user_type',
    'name',
    'email',
    'company_name',
    'Address',
    'City',
])]
#[Hidden(['delete_by', 'delete_at', 'add_by', 'update_by'])]
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'app_users';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'integer',
            'isdelete' => 'integer',
            'delete_at' => 'datetime',
        ];
    }
}
