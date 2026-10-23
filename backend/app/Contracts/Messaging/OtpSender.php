<?php

namespace App\Contracts\Messaging;

interface OtpSender
{
    public function send(string $countryCode, string $mobileNumber, string $otp): void;
}
