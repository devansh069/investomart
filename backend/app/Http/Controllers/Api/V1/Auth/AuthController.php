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
        $otp = (string) random_int(100000, 999999);
        $expiry = now()->addSeconds((int) config('investormart.otp.expiry_seconds'));

        $challenge = OtpChallenge::query()->create([
            'id' => (string) Str::uuid(), 'country_code' => $phone['country_code'], 'phone' => $phone['phone'],
            'code_hash' => Hash::make($otp), 'sent_at' => now(), 'expires_at' => $expiry,
            'request_fingerprint' => hash('sha256', $request->ip().'|'.$request->userAgent()),
        ]);

        try {
            $sender->send($phone['country_code'], $phone['phone'], $otp);
        } catch (\Throwable $exception) {
            $challenge->delete();
            report($exception);

            return $this->failure('We could not send an OTP right now. Please try again.', 'OTP_DELIVERY_FAILED', 503);
        }

        return $this->success([
            'challenge_id' => $challenge->id,
            'expires_at' => $expiry->toIso8601String(),
            'resend_after_seconds' => (int) config('investormart.otp.resend_seconds'),
        ], 'OTP sent successfully.', 202);
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

        $account->forceFill(['phone_verified_at' => now()])->save();
        $token = $account->createToken('mobile-app', ['*'], now()->addDays(30))->plainTextToken;

        return $this->success(['access_token' => $token, 'token_type' => 'Bearer', 'account' => $this->account($account)]);
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(['account' => $this->account($request->user())]);
    }

    public function updateMe(Request $request): JsonResponse
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

        return $this->success(['account' => $this->account($account->fresh())], 'Profile updated.');
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
        ];
    }
}
