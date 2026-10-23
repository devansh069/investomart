<?php

namespace App\Http\Controllers\Api\V1\Payments;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\ListingPlan;
use App\Models\PlanOrder;
use App\Services\Listings\ListingCapacityService;
use App\Services\Payments\PlanPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlanController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(['base_slots' => (int) config('investormart.base_listing_slots'), 'plans' => ListingPlan::query()->where('is_active', true)->orderBy('additional_slots')->get()->map(fn (ListingPlan $plan) => $this->plan($plan))->values()]);
    }

    public function createOrder(Request $request, string $code, PlanPaymentService $payments): JsonResponse
    {
        $plan = ListingPlan::query()->where('code', $code)->where('is_active', true)->first();
        if ($plan === null) {
            return $this->failure('The selected plan is unavailable.', 'PLAN_NOT_FOUND', 404);
        }

        try {
            $result = $payments->createOrder($request->user(), $plan);
        } catch (\RuntimeException $exception) {
            report($exception);

            return $this->failure('Unable to start the Razorpay payment.', 'PAYMENT_UNAVAILABLE', 503);
        }

        return $this->success(['order' => [
            'id' => $result['order']->id, 'gateway_order_id' => $result['gateway_order']['id'], 'amount' => $result['order']->amount_paise,
            'currency' => $result['order']->currency, 'key_id' => config('services.razorpay.key_id'), 'plan' => $this->plan($plan),
        ]], null, 201);
    }

    public function verify(Request $request, string $id, PlanPaymentService $payments, ListingCapacityService $capacity): JsonResponse
    {
        $validated = $request->validate(['razorpay_payment_id' => ['required', 'string', 'max:100'], 'razorpay_signature' => ['required', 'string', 'max:255']]);
        $order = PlanOrder::query()->find($id);
        if ($order === null) {
            return $this->failure('Payment order not found.', 'ORDER_NOT_FOUND', 404);
        }

        try {
            $subscription = $payments->verify($request->user(), $order, $validated['razorpay_payment_id'], $validated['razorpay_signature']);
        } catch (\RuntimeException $exception) {
            return $this->failure($exception->getMessage(), 'PAYMENT_VERIFICATION_FAILED', 422);
        }

        return $this->success(['subscription' => ['id' => $subscription->id, 'additional_slots' => $subscription->additional_slots, 'expires_at' => $subscription->expires_at->toIso8601String()], 'listing_capacity' => $capacity->capacityFor($request->user())], 'Plan activated.');
    }

    /** @return array<string, mixed> */
    private function plan(ListingPlan $plan): array
    {
        return ['code' => $plan->code, 'name' => $plan->name, 'price_paise' => $plan->price_paise, 'price' => $plan->price_paise / 100, 'additional_slots' => $plan->additional_slots, 'total_slots' => (int) config('investormart.base_listing_slots') + $plan->additional_slots, 'duration_days' => $plan->duration_days];
    }
}
