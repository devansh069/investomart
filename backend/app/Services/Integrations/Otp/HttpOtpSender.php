<?php

namespace App\Services\Integrations\Otp;

use App\Contracts\Messaging\OtpSender;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class HttpOtpSender implements OtpSender
{
    public function send(string $countryCode, string $mobileNumber, string $otp): void
    {
        $endpoint = config('services.otp.endpoint');
        $token = config('services.otp.token');

        if (blank($endpoint) || blank($token)) {
            throw new RuntimeException('The OTP provider is not configured.');
        }

        $http = Http::acceptJson()
            ->connectTimeout(5)
            ->timeout(10)
            ->retry(2, 250);
        $caBundle = config('services.otp.ca_bundle');
        if (filled($caBundle)) {
            $http = $http->withOptions(['verify' => is_file($caBundle) ? $caBundle : base_path($caBundle)]);
        }
        $response = $http->post($endpoint, [
            'token' => $token,
            'otp' => $otp,
            'mobileno' => $mobileNumber,
        ]);

        if (! $response->successful() || (int) $response->json('status') !== 1) {
            throw new RuntimeException('The OTP provider rejected the delivery request.');
        }
    }
}
