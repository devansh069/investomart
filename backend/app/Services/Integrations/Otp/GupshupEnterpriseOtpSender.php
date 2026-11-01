<?php

namespace App\Services\Integrations\Otp;

use App\Contracts\Messaging\OtpSender;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GupshupEnterpriseOtpSender implements OtpSender
{
    public function send(string $countryCode, string $mobileNumber, string $otp): void
    {
        $endpoint = config('services.otp.endpoint');
        $userId = config('services.otp.userid');
        $password = config('services.otp.password');
        $template = config('services.otp.message_template');

        if (blank($endpoint) || blank($userId) || blank($password) || blank($template)) {
            throw new RuntimeException('The Gupshup Enterprise SMS provider is not configured.');
        }

        $recipient = preg_replace('/\D+/', '', $countryCode.$mobileNumber) ?? '';
        $message = str_replace('{OTP}', $otp, $template);
        $payload = [
            'method' => config('services.otp.method'),
            'send_to' => $recipient,
            'msg' => $message,
            'msg_type' => config('services.otp.message_type'),
            'userid' => $userId,
            'auth_scheme' => config('services.otp.auth_scheme'),
            'password' => $password,
            'v' => config('services.otp.api_version'),
        ];
        if (filled(config('services.otp.sender_prefix'))) {
            $payload['mask'] = config('services.otp.sender_prefix');
        }
        if (filled(config('services.otp.dlt_entity_id'))) {
            $payload['principalEntityId'] = config('services.otp.dlt_entity_id');
        }
        if (filled(config('services.otp.dlt_template_id'))) {
            $payload['dltTemplateId'] = config('services.otp.dlt_template_id');
        }

        $http = Http::accept('*/*')
            ->connectTimeout(5)
            ->timeout(10)
            ->retry(2, 250);
        $caBundle = config('services.otp.ca_bundle');
        if (filled($caBundle)) {
            $http = $http->withOptions(['verify' => is_file($caBundle) ? $caBundle : base_path($caBundle)]);
        }
        // InvestorMart's established CodeIgniter sender uses Gupshup's
        // URL-encoded GET format. Keep this aligned with that live path.
        $response = $http->get($endpoint, $payload);

        if (! $response->successful() || preg_match('/^\s*success\s*\|/i', $response->body()) !== 1) {
            throw new RuntimeException('The Gupshup Enterprise SMS provider rejected the delivery request.');
        }

        $responseParts = array_map('trim', explode('|', $response->body()));
        Log::info('Gupshup OTP delivery accepted.', [
            'recipient_suffix' => substr($recipient, -4),
            'gateway_message_id' => $responseParts[2] ?? null,
        ]);
    }
}
