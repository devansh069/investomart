<?php

namespace App\Services\Integrations\Payments;

use App\Contracts\Payments\PaymentGateway;
use Razorpay\Api\Api;
use RuntimeException;

class RazorpayPaymentGateway implements PaymentGateway
{
    private function client(): Api
    {
        $keyId = config('services.razorpay.key_id');
        $keySecret = config('services.razorpay.key_secret');

        if (blank($keyId) || blank($keySecret)) {
            throw new RuntimeException('Razorpay is not configured.');
        }

        return new Api($keyId, $keySecret);
    }

    public function createOrder(string $receipt, int $amountInPaise, string $currency): array
    {
        return $this->client()->order->create([
            'receipt' => $receipt,
            'amount' => $amountInPaise,
            'currency' => $currency,
            'payment_capture' => config('services.razorpay.capture_mode') === 'automatic' ? 1 : 0,
        ])->toArray();
    }

    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool
    {
        try {
            $this->client()->utility->verifyPaymentSignature([
                'razorpay_order_id' => $orderId,
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => $signature,
            ]);

            return true;
        } catch (\Throwable) {
            return false;
        }
    }

    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $secret = config('services.razorpay.webhook_secret');

        if (blank($secret)) {
            return false;
        }

        return hash_equals(hash_hmac('sha256', $payload, $secret), $signature);
    }
}
