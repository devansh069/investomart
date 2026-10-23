<?php

namespace App\Services\Accounts;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class AccountProvisioner
{
    public function findOrCreate(string $countryCode, string $phone): Account
    {
        $account = Account::query()->where('phone', $phone)->first();

        if ($account !== null) {
            return $account;
        }

        $legacy = DB::table('app_users')
            ->where('mobile_number', $phone)
            ->where('isdelete', 0)
            ->orderBy('id')
            ->first();

        $legacyRole = $legacy?->user_type;
        $role = in_array($legacyRole, ['builder', 'owner', 'broker'], true) ? $legacyRole : 'client';
        $isAdmin = in_array($phone, config('investormart.admin_mobile_numbers', []), true);

        return Account::query()->create([
            'legacy_user_id' => $legacy?->id,
            'country_code' => $legacy?->country_code ?: $countryCode,
            'phone' => $phone,
            'name' => $legacy?->name,
            'email' => $legacy?->email,
            'company_name' => $legacy?->company_name,
            'role' => $isAdmin ? 'admin' : $role,
            'provider_type' => $isAdmin || $role === 'client' ? null : $role,
            'profile' => $legacy === null ? null : [
                'address' => $legacy->Address,
                'city' => $legacy->City,
            ],
            'phone_verified_at' => now(),
        ]);
    }
}
