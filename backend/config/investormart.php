<?php

return [
    'base_listing_slots' => (int) env('INVESTORMART_BASE_LISTING_SLOTS', 10),
    'plan_timezone' => env('INVESTORMART_PLAN_TIMEZONE', 'Asia/Kolkata'),
    'legacy_media_base_url' => rtrim((string) env('INVESTORMART_LEGACY_MEDIA_BASE_URL', ''), '/'),
    'legacy_property_media_prefix' => trim((string) env('INVESTORMART_LEGACY_PROPERTY_MEDIA_PREFIX', 'property_folder/property_gallary'), '/'),
    'media_public_base_url' => rtrim((string) env('INVESTORMART_MEDIA_PUBLIC_BASE_URL', ''), '/'),
    'mobile_property_upload_prefix' => trim((string) env('INVESTORMART_MOBILE_PROPERTY_UPLOAD_PREFIX', 'properties/mobile'), '/'),
    'admin_mobile_numbers' => array_filter(array_map(
        static fn (string $number): string => preg_replace('/\D+/', '', $number) ?? '',
        explode(',', (string) env('INVESTORMART_ADMIN_MOBILE_NUMBERS', '')),
    )),
    'otp' => [
        'expiry_seconds' => (int) env('OTP_EXPIRY_SECONDS', 600),
        'resend_seconds' => (int) env('OTP_RESEND_SECONDS', 30),
        'max_resends_per_hour' => (int) env('OTP_MAX_RESENDS_PER_HOUR', 3),
        'max_attempts' => (int) env('OTP_MAX_ATTEMPTS', 5),
        // These values are honored only when APP_ENV=local. Each entry is
        // "10-digit-phone:role" and exists solely for local app testing.
        'local_test_accounts' => env('OTP_LOCAL_TEST_ACCOUNTS', ''),
        'local_test_code' => env('OTP_LOCAL_TEST_CODE', ''),
    ],
];
