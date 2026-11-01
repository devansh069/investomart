<?php

namespace App\Services\Accounts;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class AccountProvisioner
{
    public function findOrCreate(string $countryCode, string $phone): Account
    {
        $account = Account::query()->where('phone', $phone)->first();
        $legacy = $this->legacyAccount($phone);
        $localTestRole = $this->localTestRole($phone);

        if ($account !== null) {
            if ($localTestRole !== null && ! $account->isAdmin() && $account->role !== $localTestRole) {
                $account->update(['role' => $localTestRole, 'provider_type' => $localTestRole === 'client' ? null : $localTestRole]);
            }
            if (in_array($phone, config('investormart.admin_mobile_numbers', []), true) && ! $account->isAdmin()) {
                $account->update(['role' => 'admin', 'provider_type' => null]);
            }

            // The legacy administration system remains the source of truth for
            // whether an account is disabled. Do not let a mobile login write
            // an inactive legacy user back to active.
            if (! $this->legacyIsActive($legacy) && $account->is_active) {
                $account->update(['is_active' => false]);
            }

            return $this->syncLegacyAccount($account, $legacy);
        }

        $isNewMobileAccount = $legacy === null;

        if ($legacy === null) {
            $legacyId = $this->insertLegacyAccount([
                'mobile_number' => $phone,
                'country_code' => $countryCode,
                'user_type' => 'buyer',
                'status' => 1,
                'isdelete' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $legacy = $this->legacyAccountById($legacyId);
        }

        $role = $localTestRole ?? $this->mobileRole($legacy?->user_type);
        $isAdmin = in_array($phone, config('investormart.admin_mobile_numbers', []), true);

        $account = Account::query()->create([
            'legacy_user_id' => $legacy?->id,
            'country_code' => $legacy?->country_code ?: $countryCode,
            'phone' => $phone,
            'name' => $legacy?->name,
            'email' => $legacy?->email,
            'company_name' => $legacy?->company_name,
            'role' => $isAdmin ? 'admin' : $role,
            'provider_type' => $isAdmin || $role === 'client' ? null : $role,
            'is_active' => $this->legacyIsActive($legacy),
            'profile' => $legacy === null ? null : [
                'address' => $legacy->Address,
                'city' => $legacy->City,
            ],
            'phone_verified_at' => now(),
        ]);

        $account = $this->syncLegacyAccount($account, $legacy);
        $account->setAttribute('requires_role_selection', $isNewMobileAccount && ! $isAdmin && $localTestRole === null);

        return $account;
    }

    public function syncLegacyAccount(Account $account, ?object $legacy = null): Account
    {
        $legacy ??= $account->legacy_user_id === null
            ? $this->legacyAccount($account->phone)
            : $this->legacyAccountById((int) $account->legacy_user_id);

        $profile = $account->profile ?? [];
        $payload = [
            'mobile_number' => $account->phone,
            'country_code' => $account->country_code,
            'name' => $account->name,
            'email' => $account->email,
            'company_name' => $account->company_name,
            'Address' => $profile['address'] ?? null,
            'City' => $profile['city'] ?? null,
            'user_type' => $this->legacyRole($account, $legacy),
            'status' => $account->is_active ? 1 : 0,
            'updated_at' => now(),
        ];

        if ($legacy === null) {
            $payload['isdelete'] = 0;
            $payload['created_at'] = now();
            $legacyId = $this->insertLegacyAccount($payload);
        } else {
            DB::table('app_users')->where('id', $legacy->id)->update($payload);
            $legacyId = (int) $legacy->id;
        }

        if ((int) $account->legacy_user_id !== $legacyId) {
            $account->update(['legacy_user_id' => $legacyId]);
        }

        return $account->fresh();
    }

    private function legacyAccount(string $phone): ?object
    {
        return DB::table('app_users')
            ->where('mobile_number', $phone)
            ->where('isdelete', 0)
            ->orderBy('id')
            ->first();
    }

    /** @param array<string, mixed> $payload */
    private function insertLegacyAccount(array $payload): int
    {
        $idColumn = DB::selectOne("SHOW COLUMNS FROM `app_users` WHERE Field = 'id'");
        $isAutoIncrement = str_contains(strtolower((string) ($idColumn->Extra ?? '')), 'auto_increment');

        if (! $isAutoIncrement) {
            // The supplied local dump does not mark app_users.id as auto-increment,
            // although the live schema is expected to. This fallback lets local
            // development work without altering any legacy table definition.
            $payload['id'] = ((int) DB::table('app_users')->max('id')) + 1;
            DB::table('app_users')->insert($payload);

            return $payload['id'];
        }

        return (int) DB::table('app_users')->insertGetId($payload);
    }

    private function legacyAccountById(int $id): ?object
    {
        return DB::table('app_users')->where('id', $id)->where('isdelete', 0)->first();
    }

    private function mobileRole(?string $legacyRole): string
    {
        return match (strtolower((string) $legacyRole)) {
            'builder' => 'builder',
            'owner', 'seller' => 'owner',
            'broker', 'agent' => 'broker',
            default => 'client',
        };
    }

    private function legacyIsActive(?object $legacy): bool
    {
        return $legacy === null || ! isset($legacy->status) || (int) $legacy->status === 1;
    }

    private function localTestRole(string $phone): ?string
    {
        if (! app()->environment('local')) {
            return null;
        }

        foreach (explode(',', (string) config('investormart.otp.local_test_accounts')) as $entry) {
            [$configuredPhone, $role] = array_pad(explode(':', trim($entry), 2), 2, '');
            $configuredPhone = preg_replace('/\D+/', '', $configuredPhone) ?? '';
            $role = strtolower(trim($role));

            if ($configuredPhone === $phone && in_array($role, ['client', 'builder', 'owner', 'broker'], true)) {
                return $role;
            }
        }

        return null;
    }

    private function legacyRole(Account $account, ?object $legacy): string
    {
        if ($account->isAdmin()) {
            return $legacy?->user_type ?: 'buyer';
        }

        return match ($account->role) {
            'builder' => 'builder',
            'owner' => 'seller',
            'broker' => 'broker',
            default => 'buyer',
        };
    }
}
