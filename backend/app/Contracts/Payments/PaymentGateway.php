<?php

namespace App\Contracts\Payments;

interface PaymentGateway
{
    /**
     * @return array<string, mixed>
     */
    public function createOrder(string $receipt, int $amountInPaise, string $currency): array;

    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool;

    public function verifyWebhookSignature(string $payload, string $signature): bool;
}
