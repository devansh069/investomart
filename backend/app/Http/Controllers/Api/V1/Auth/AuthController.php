<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Contracts\Messaging\OtpSender;
use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Account;
use App\Models\OtpChallenge;
use App\Services\Accounts\AccountProvisioner;
use App\Services\Support\PhoneNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends ApiController
{
    public function requestOtp(Request $request, OtpSender $sender): JsonResponse
    {
        $validated = $request->validate(['phone' => ['required', 'string', 'max:30'], 'country_code' => ['nullable', 'string', 'max:8']]);
        $phone = PhoneNumber::normalize($validated['phone'], $validated['country_code'] ?? '+91');
        $localTestOtp = $this->localTestOtp($phone['phone']);

        if ($localTestOtp === null) {
            $latestChallenge = OtpChallenge::query()
                ->where('country_code', $phone['country_code'])
                ->where('phone', $phone['phone'])
                ->latest('sent_at')
                ->first();
            if ($latestChallenge !== null && $latestChallenge->sent_at->gt(now()->subSeconds((int) config('investormart.otp.resend_seconds')))) {
                return $this->failure('Please wait before requesting another OTP.', 'OTP_RESEND_COOLDOWN', 429);
            }
            $maximumSends = 1 + (int) config('investormart.otp.max_resends_per_hour');
            $sendsInLastHour = OtpChallenge::query()
                ->where('country_code', $phone['country_code'])
                ->where('phone', $phone['phone'])
                ->where('sent_at', '>=', now()->subHour())
                ->count();
            if ($sendsInLastHour >= $maximumSends) {
                return $this->failure('OTP request limit reached. Please try again later.', 'OTP_RESEND_LIMIT_REACHED', 429);
            }
        }
        $isStagingTestPhone = app()->environment('staging')
            && filled(config('services.otp.staging_test_phone'))
            && hash_equals((string) config('services.otp.staging_test_phone'), $phone['phone'])
            && filled(config('services.otp.staging_test_code'));
        $otp = $localTestOtp ?? ($isStagingTestPhone
            ? (string) config('services.otp.staging_test_code')
            : (string) random_int(100000, 999999));
        $expiry = now()->addSeconds((int) config('investormart.otp.expiry_seconds'));

        // A resend replaces the older code. Leaving two live challenges would
        // allow an earlier SMS to authenticate the account after a newer code
        // has been issued.
        OtpChallenge::query()
            ->where('country_code', $phone['country_code'])
            ->where('phone', $phone['phone'])
            ->whereNull('verified_at')
            ->where('expires_at', '>', now())
            ->update(['expires_at' => now()]);

        $challenge = OtpChallenge::query()->create([
            'id' => (string) Str::uuid(), 'country_code' => $phone['country_code'], 'phone' => $phone['phone'],
            'code_hash' => Hash::make($otp), 'sent_at' => now(), 'expires_at' => $expiry,
            'request_fingerprint' => hash('sha256', $request->ip().'|'.$request->userAgent()),
        ]);

        try {
            if ($localTestOtp === null && ! $isStagingTestPhone) {
                $sender->send($phone['country_code'], $phone['phone'], $otp);
            }
        } catch (\Throwable $exception) {
            $challenge->delete();
            report($exception);

            return $this->failure('We could not send an OTP right now. Please try again.', 'OTP_DELIVERY_FAILED', 503);
        }

        $response = [
            'challenge_id' => $challenge->id,
            'expires_at' => $expiry->toIso8601String(),
            'resend_after_seconds' => (int) config('investormart.otp.resend_seconds'),
        ];
        // The OTP is exposed only for the local development log driver. Live
        // SMS configurations never receive it in an API response.
        if (app()->environment('local') && config('services.otp.driver') === 'log') {
            $response['development_otp'] = $otp;
        }

        return $this->success($response, 'OTP sent successfully.', 202);
    }

    public function verifyOtp(Request $request, AccountProvisioner $provisioner): JsonResponse
    {
        $validated = $request->validate([
            'challenge_id' => ['required', 'uuid'],
            'phone' => ['required', 'string', 'max:30'],
            'otp' => ['required', 'digits:6'],
        ]);
        $phone = PhoneNumber::normalize($validated['phone']);
        $challenge = OtpChallenge::query()->whereKey($validated['challenge_id'])->where('phone', $phone['phone'])->first();

        if ($challenge === null || $challenge->verified_at !== null || $challenge->expires_at->isPast()) {
            return $this->failure('This OTP has expired. Request a new one.', 'OTP_EXPIRED', 422);
        }
        if ($challenge->attempts >= (int) config('investormart.otp.max_attempts')) {
            return $this->failure('Too many incorrect attempts. Request a new OTP.', 'OTP_ATTEMPTS_EXCEEDED', 429);
        }

        $challenge->increment('attempts');
        if (! Hash::check($validated['otp'], $challenge->code_hash)) {
            return $this->failure('The OTP is incorrect.', 'OTP_INVALID', 422);
        }

        $challenge->update(['verified_at' => now()]);
        $account = $provisioner->findOrCreate($phone['country_code'], $phone['phone']);
        if (! $account->is_active) {
            return $this->failure('This account is disabled.', 'ACCOUNT_DISABLED', 403);
        }

        // AccountProvisioner uses this transient response-only attribute to
        // tell the app whether first-time role setup is needed. Remove it
        // before Eloquent persists the verification timestamp.
        $requiresRoleSelection = (bool) ($account->getAttribute('requires_role_selection') ?? false);
        unset($account->requires_role_selection);
        $account->forceFill(['phone_verified_at' => now()])->save();
        $account->setAttribute('requires_role_selection', $requiresRoleSelection);
        $token = $account->createToken('mobile-app', ['*'], now()->addDays(30))->plainTextToken;

        return $this->success(['access_token' => $token, 'token_type' => 'Bearer', 'account' => $this->account($account)]);
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(['account' => $this->account($request->user())]);
    }

    public function updateMe(Request $request, AccountProvisioner $provisioner): JsonResponse
    {
        /** @var Account $account */
        $account = $request->user();
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:120'], 'email' => ['nullable', 'email:rfc', 'max:160'],
            'company_name' => ['nullable', 'string', 'max:160'], 'avatar_url' => ['nullable', 'url', 'max:2048'],
            'role' => ['nullable', Rule::in(['client', 'builder', 'owner', 'broker'])],
            'profile' => ['nullable', 'array'],
        ]);

        if ($account->isAdmin()) {
            unset($validated['role']);
        }
        if (isset($validated['role'])) {
            $validated['provider_type'] = $validated['role'] === 'client' ? null : $validated['role'];
        }
        $account->fill($validated)->save();
        $account = $provisioner->syncLegacyAccount($account);

        return $this->success(['account' => $this->account($account)], 'Profile updated.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->success([], 'You have been signed out.');
    }

    /** @return array<string, mixed> */
    private function account(Account $account): array
    {
        return [
            'id' => (string) $account->id, 'phone' => $account->country_code.$account->phone,
            'country_code' => $account->country_code, 'name' => $account->name, 'email' => $account->email,
            'role' => $account->role, 'provider_type' => $account->provider_type,
            'company_name' => $account->company_name, 'avatar_url' => $account->avatar_url,
            'profile' => $account->profile ?? [], 'is_admin' => $account->isAdmin(),
            // This transient flag is set only when a mobile number did not
            // already exist in the legacy user table. It lets the mobile app
            // ask for the initial account type once, without asking on login.
            'requires_role_selection' => (bool) ($account->getAttribute('requires_role_selection') ?? false),
        ];
    }

    private function localTestOtp(string $phone): ?string
    {
        if (! app()->environment('local')) {
            return null;
        }

        foreach (explode(',', (string) config('investormart.otp.local_test_accounts')) as $entry) {
            [$configuredPhone] = array_pad(explode(':', trim($entry), 2), 1, '');
            $configuredPhone = preg_replace('/\D+/', '', $configuredPhone) ?? '';

            if ($configuredPhone !== '' && hash_equals($configuredPhone, $phone)) {
                $code = (string) config('investormart.otp.local_test_code');

                return preg_match('/^\d{6}$/', $code) ? $code : null;
            }
        }

        return null;
    }
}
