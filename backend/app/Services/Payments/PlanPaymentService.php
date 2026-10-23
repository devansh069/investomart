<?php

namespace App\Services\Payments;

use App\Contracts\Payments\PaymentGateway;
use App\Models\Account;
use App\Models\ListingPlan;
use App\Models\PlanOrder;
use App\Models\ProviderSubscription;
use App\Services\Listings\ListingCapacityService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class PlanPaymentService
{
    public function __construct(private readonly PaymentGateway $gateway, private readonly ListingCapacityService $capacity) {}

    /** @return array{order: PlanOrder, gateway_order: array<string, mixed>} */
    public function createOrder(Account $provider, ListingPlan $plan): array
    {
        $order = PlanOrder::query()->create([
            'id' => (string) Str::uuid(), 'provider_account_id' => $provider->id, 'plan_code' => $plan->code,
            'amount_paise' => $plan->price_paise, 'currency' => config('services.razorpay.currency'),
            'receipt' => 'im_'.Str::lower(Str::random(20)), 'gateway' => 'razorpay', 'status' => 'created',
        ]);

        try {
            $gatewayOrder = $this->gateway->createOrder($order->receipt, $order->amount_paise, $order->currency);
            $order->update(['gateway_order_id' => $gatewayOrder['id'], 'gateway_payload' => $gatewayOrder]);
        } catch (\Throwable $exception) {
            $order->update(['status' => 'failed']);
            throw new RuntimeException('Could not create the payment order.', previous: $exception);
        }

        return ['order' => $order->fresh(), 'gateway_order' => $gatewayOrder];
    }

    public function verify(Account $provider, PlanOrder $order, string $paymentId, string $signature): ProviderSubscription
    {
        if ($order->provider_account_id !== $provider->id || blank($order->gateway_order_id)) {
            throw new RuntimeException('This payment order cannot be verified.');
        }
        if (! $this->gateway->verifyPaymentSignature($order->gateway_order_id, $paymentId, $signature)) {
            throw new RuntimeException('The Razorpay payment signature is invalid.');
        }

        return $this->activate($order->id, $paymentId, $provider->id);
    }

    public function activateCapturedGatewayOrder(string $gatewayOrderId, string $paymentId): ?ProviderSubscription
    {
        $order = PlanOrder::query()->where('gateway_order_id', $gatewayOrderId)->first();

        return $order === null ? null : $this->activate($order->id, $paymentId);
    }

    private function activate(string $orderId, string $paymentId, ?int $expectedProviderId = null): ProviderSubscription
    {
        return DB::transaction(function () use ($orderId, $paymentId, $expectedProviderId): ProviderSubscription {
            $order = PlanOrder::query()->lockForUpdate()->findOrFail($orderId);
            if ($expectedProviderId !== null && $order->provider_account_id !== $expectedProviderId) {
                throw new RuntimeException('This payment order cannot be verified.');
            }
            if ($order->status === 'paid') {
                $subscription = ProviderSubscription::query()->where('plan_order_id', $order->id)->first();
                if ($subscription !== null) {
                    return $subscription;
                }
            }
            if ($order->status !== 'created') {
                throw new RuntimeException('This payment order cannot be activated.');
            }

            $plan = ListingPlan::query()->findOrFail($order->plan_code);
            $order->update(['status' => 'paid', 'gateway_payment_id' => $paymentId, 'paid_at' => now()]);
            $subscription = ProviderSubscription::query()->create([
                'id' => (string) Str::uuid(), 'provider_account_id' => $provider->id, 'plan_order_id' => $order->id,
                'plan_code' => $plan->code, 'additional_slots' => $plan->additional_slots, 'status' => 'active',
                'starts_at' => now(config('investormart.plan_timezone')),
                'expires_at' => now(config('investormart.plan_timezone'))->addDays($plan->duration_days),
            ]);
            /** @var Account $provider */
            $provider = Account::query()->findOrFail($order->provider_account_id);
            $this->capacity->rebalance($provider);

            return $subscription;
        });
    }
}
