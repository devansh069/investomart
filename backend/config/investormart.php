<?php

return [
    'base_listing_slots' => (int) env('INVESTORMART_BASE_LISTING_SLOTS', 10),
    'plan_timezone' => env('INVESTORMART_PLAN_TIMEZONE', 'Asia/Kolkata'),
    'legacy_media_base_url' => rtrim((string) env('INVESTORMART_LEGACY_MEDIA_BASE_URL', ''), '/'),
    'media_public_base_url' => rtrim((string) env('INVESTORMART_MEDIA_PUBLIC_BASE_URL', ''), '/'),
    'admin_mobile_numbers' => array_filter(array_map(
        static fn (string $number): string => preg_replace('/\D+/', '', $number) ?? '',
        explode(',', (string) env('INVESTORMART_ADMIN_MOBILE_NUMBERS', '')),
    )),
    'otp' => [
        'expiry_seconds' => (int) env('OTP_EXPIRY_SECONDS', 300),
        'resend_seconds' => (int) env('OTP_RESEND_SECONDS', 60),
        'max_attempts' => (int) env('OTP_MAX_ATTEMPTS', 5),
    ],
];
