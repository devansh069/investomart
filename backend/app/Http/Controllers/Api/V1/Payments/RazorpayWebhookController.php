<?php

namespace App\Http\Controllers\Api\V1\Payments;

use App\Contracts\Payments\PaymentGateway;
use App\Http\Controllers\Api\V1\ApiController;
use App\Services\Payments\PlanPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RazorpayWebhookController extends ApiController
{
    public function __invoke(Request $request, PaymentGateway $gateway, PlanPaymentService $payments): JsonResponse
    {
        $payload = $request->getContent();
        $signature = (string) $request->header('X-Razorpay-Signature', '');
        if (blank($signature) || ! $gateway->verifyWebhookSignature($payload, $signature)) {
            return $this->failure('Invalid webhook signature.', 'INVALID_WEBHOOK_SIGNATURE', 400);
        }

        $event = (string) $request->input('event');
        if ($event !== 'payment.captured') {
            return $this->success(['received' => true]);
        }

        $payment = $request->input('payload.payment.entity');
        $gatewayOrderId = is_array($payment) ? ($payment['order_id'] ?? null) : null;
        $paymentId = is_array($payment) ? ($payment['id'] ?? null) : null;
        if (! is_string($gatewayOrderId) || ! is_string($paymentId)) {
            return $this->failure('Invalid payment payload.', 'INVALID_WEBHOOK_PAYLOAD', 422);
        }

        try {
            $subscription = $payments->activateCapturedGatewayOrder($gatewayOrderId, $paymentId);
        } catch (\Throwable $exception) {
            report($exception);

            return $this->failure('Could not activate the provider plan.', 'PLAN_ACTIVATION_FAILED', 422);
        }

        return $this->success(['received' => true, 'activated' => $subscription !== null]);
    }
}
