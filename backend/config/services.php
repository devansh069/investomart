<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'otp' => [
        'driver' => env('OTP_PROVIDER', 'log'),
        'endpoint' => env('OTP_ENDPOINT'),
        'token' => env('OTP_SERVICE_TOKEN'),
        'userid' => env('OTP_SERVICE_USERID'),
        'password' => env('OTP_SERVICE_PASSWORD'),
        'auth_scheme' => env('OTP_AUTH_SCHEME', 'plain'),
        'method' => env('OTP_METHOD', 'SendMessage'),
        'message_type' => env('OTP_MSG_TYPE', 'text'),
        'api_version' => env('OTP_API_VERSION', '1.1'),
        'sender_prefix' => env('OTP_SENDER_PREFIX'),
        'message_template' => env('OTP_MESSAGE_TEMPLATE'),
        'ca_bundle' => env('OTP_CA_BUNDLE'),
        'sender_id' => env('OTP_SENDER_ID'),
        'dlt_entity_id' => env('OTP_DLT_ENTITY_ID'),
        'dlt_template_id' => env('OTP_DLT_TEMPLATE_ID'),
        'staging_test_phone' => env('OTP_STAGING_TEST_PHONE'),
        'staging_test_code' => env('OTP_STAGING_TEST_CODE'),
    ],

    'admin' => [
        'api_key' => env('ADMIN_API_KEY'),
    ],

    'razorpay' => [
        'key_id' => env('RAZORPAY_KEY_ID'),
        'key_secret' => env('RAZORPAY_KEY_SECRET'),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
        'currency' => env('RAZORPAY_CURRENCY', 'INR'),
        'capture_mode' => env('RAZORPAY_CAPTURE_MODE', 'automatic'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
