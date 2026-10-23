<?php

return [
    'base_listing_slots' => (int) env('INVESTORMART_BASE_LISTING_SLOTS', 10),
    'plan_timezone' => env('INVESTORMART_PLAN_TIMEZONE', 'Asia/Kolkata'),
    'otp' => [
        'expiry_seconds' => (int) env('OTP_EXPIRY_SECONDS', 300),
        'resend_seconds' => (int) env('OTP_RESEND_SECONDS', 60),
        'max_attempts' => (int) env('OTP_MAX_ATTEMPTS', 5),
    ],
];
