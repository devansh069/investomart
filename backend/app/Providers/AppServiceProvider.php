<?php

namespace App\Providers;

use App\Contracts\Messaging\OtpSender;
use App\Contracts\Payments\PaymentGateway;
use App\Contracts\Storage\MediaStorage;
use App\Models\Sanctum\PersonalAccessToken;
use App\Services\Integrations\Otp\HttpOtpSender;
use App\Services\Integrations\Otp\LogOtpSender;
use App\Services\Integrations\Payments\RazorpayPaymentGateway;
use App\Services\Integrations\Storage\S3MediaStorage;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(OtpSender::class, function (): OtpSender {
            return config('services.otp.driver') === 'http'
                ? app(HttpOtpSender::class)
                : app(LogOtpSender::class);
        });

        $this->app->bind(PaymentGateway::class, RazorpayPaymentGateway::class);
        $this->app->bind(MediaStorage::class, S3MediaStorage::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        RateLimiter::for('otp', static function (Request $request): Limit {
            return Limit::perMinute(5)->by(($request->input('phone') ?? '').'|'.$request->ip());
        });
    }
}
