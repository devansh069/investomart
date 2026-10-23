<?php

namespace App\Services\Integrations\Otp;

use App\Contracts\Messaging\OtpSender;
use Illuminate\Support\Facades\Log;

class LogOtpSender implements OtpSender
{
    public function send(string $countryCode, string $mobileNumber, string $otp): void
    {
        Log::info('InvestorMart development OTP generated.', [
            'phone' => $countryCode.$mobileNumber,
            'otp' => $otp,
        ]);
    }
}
