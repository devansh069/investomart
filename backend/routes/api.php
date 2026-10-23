<?php

use App\Http\Controllers\Api\V1\Admin\AdminController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Inquiries\InquiryController;
use App\Http\Controllers\Api\V1\Listings\FavoriteController;
use App\Http\Controllers\Api\V1\Listings\PublicListingController;
use App\Http\Controllers\Api\V1\Payments\PlanController;
use App\Http\Controllers\Api\V1\Payments\RazorpayWebhookController;
use App\Http\Controllers\Api\V1\Provider\ListingMediaController;
use App\Http\Controllers\Api\V1\Provider\ProviderListingController;
use App\Http\Controllers\Api\V1\System\HealthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');
    Route::post('/webhooks/razorpay', RazorpayWebhookController::class);

    Route::prefix('auth')->group(function (): void {
        Route::post('/otp/request', [AuthController::class, 'requestOtp'])->middleware('throttle:otp');
        Route::post('/otp/verify', [AuthController::class, 'verifyOtp'])->middleware('throttle:otp');
    });

    Route::get('/listings', [PublicListingController::class, 'index']);
    Route::get('/listings/{source}/{id}', [PublicListingController::class, 'show'])->whereIn('source', ['native', 'legacy_property']);
    Route::get('/plans', [PlanController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::patch('/me', [AuthController::class, 'updateMe']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::put('/favorites/{source}/{id}', [FavoriteController::class, 'toggle'])->whereIn('source', ['native', 'legacy_property']);
        Route::post('/inquiries', [InquiryController::class, 'store']);

        Route::middleware('account.role:builder,owner,broker')->prefix('provider')->group(function (): void {
            Route::get('/dashboard', [ProviderListingController::class, 'dashboard']);
            Route::get('/listings', [ProviderListingController::class, 'index']);
            Route::post('/listings', [ProviderListingController::class, 'store']);
            Route::patch('/listings/{id}', [ProviderListingController::class, 'update']);
            Route::patch('/listings/{id}/status', [ProviderListingController::class, 'updateStatus']);
            Route::post('/listings/{id}/media/upload-url', [ListingMediaController::class, 'uploadUrl']);
            Route::post('/listings/{id}/media', [ListingMediaController::class, 'attach']);
            Route::get('/inquiries', [InquiryController::class, 'providerIndex']);
            Route::patch('/inquiries/{id}/status', [InquiryController::class, 'updateStatus']);
            Route::post('/plans/{code}/orders', [PlanController::class, 'createOrder']);
            Route::post('/plan-orders/{id}/verify', [PlanController::class, 'verify']);
        });

        Route::middleware('account.role:admin')->prefix('admin')->group(function (): void {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/listings', [AdminController::class, 'listings']);
            Route::patch('/listings/{id}/review', [AdminController::class, 'reviewListing']);
            Route::get('/inquiries', [AdminController::class, 'inquiries']);
            Route::patch('/inquiries/{id}', [AdminController::class, 'updateInquiry']);
        });
    });
});
