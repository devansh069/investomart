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

        $response = Http::acceptJson()
            ->timeout(10)
            ->retry(2, 250)
            ->post($endpoint, [
                'token' => $token,
                'otp' => $otp,
                'mobileno' => $mobileNumber,
                'sender_id' => config('services.otp.sender_id'),
                'dlt_entity_id' => config('services.otp.dlt_entity_id'),
                'dlt_template_id' => config('services.otp.dlt_template_id'),
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('The OTP provider rejected the delivery request.');
        }
    }
}
