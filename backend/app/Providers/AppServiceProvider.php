<?php

namespace App\Providers;

use App\Contracts\Messaging\OtpSender;
use App\Contracts\Payments\PaymentGateway;
use App\Contracts\Storage\MediaStorage;
use App\Models\Sanctum\PersonalAccessToken;
use App\Services\Integrations\Otp\GupshupEnterpriseOtpSender;
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
            return match (config('services.otp.driver')) {
                'http' => app(HttpOtpSender::class),
                'smsgupshup' => app(GupshupEnterpriseOtpSender::class),
                default => app(LogOtpSender::class),
            };
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

        RateLimiter::for('otp.request', static function (Request $request): array {
            $phone = preg_replace('/\D+/', '', (string) $request->input('phone')) ?: 'missing';

            return [
                // The database rules enforce the per-number resend cooldown and
                // hourly cap. These limits also stop a single IP from using many
                // different numbers to exhaust the SMS account.
                Limit::perMinute(3)->by('otp-request-ip:'.$request->ip()),
                Limit::perHour(20)->by('otp-request-ip:'.$request->ip()),
                Limit::perMinute(3)->by('otp-request-phone:'.$phone),
            ];
        });

        RateLimiter::for('otp.verify', static function (Request $request): array {
            $phone = preg_replace('/\D+/', '', (string) $request->input('phone')) ?: 'missing';

            return [
                Limit::perMinute(10)->by('otp-verify-ip:'.$request->ip()),
                Limit::perMinute(5)->by('otp-verify-phone:'.$phone.'|'.$request->ip()),
            ];
        });
    }
}
