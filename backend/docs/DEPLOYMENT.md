# InvestorMart API deployment

This API is a separate Laravel service. The AWS web server must point its document root to `backend/public`; it must never expose the repository root, `.env`, `storage`, or `vendor` directly.

## Database safety

Run migrations against a current backup or staging copy before production:

```bash
php artisan migrate --force
```

The API reads the legacy tables such as `app_users`, `property`, and lookup tables without altering them. It adds only these application-owned tables:

- `app_personal_access_tokens`
- `im_accounts`, `im_otp_challenges`
- `im_listing_plans`, `im_plan_orders`, `im_provider_subscriptions`
- `im_listings`, `im_listing_media`, `im_listing_favorites`, `im_inquiries`
- `im_admin_audit_logs`
- Laravel's `cache` and `cache_locks` tables, used for the scheduler mutex

The import supplied for local development is compatible with an older MySQL key limit. The migrations explicitly use safe indexed lengths and InnoDB for app-owned tables.

## Required environment values

Set these in AWS Secrets Manager, Systems Manager Parameter Store, or the host's protected environment. Do not put their values in the Expo app.

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.example.com
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

# Use Redis in production when available. Database cache is supported after migration.
CACHE_STORE=redis
QUEUE_CONNECTION=sync

# Existing-provider media and new S3 media presentation.
INVESTORMART_LEGACY_MEDIA_BASE_URL=https://...
INVESTORMART_MEDIA_PUBLIC_BASE_URL=https://...
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=

# OTP provider. Set HTTP values only after the SMS vendor confirms its API contract.
OTP_PROVIDER=http
OTP_ENDPOINT=
OTP_SERVICE_TOKEN=
OTP_SENDER_ID=
OTP_DLT_ENTITY_ID=
OTP_DLT_TEMPLATE_ID=

# One-time provider plan purchases.
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_CURRENCY=INR
RAZORPAY_CAPTURE_MODE=automatic

# Comma-separated 10-digit numbers. These accounts get the temporary mobile admin panel.
INVESTORMART_ADMIN_MOBILE_NUMBERS=

# Restrict browser origins; native applications do not require a CORS origin.
CORS_ALLOWED_ORIGINS=https://admin.example.com
```

`OTP_PROVIDER=log` is only for local development. It writes OTPs to Laravel logs and must not be used in production.

In the Razorpay dashboard, configure `https://api.example.com/api/v1/webhooks/razorpay` for the `payment.captured` event and set the same webhook secret in `RAZORPAY_WEBHOOK_SECRET`. The webhook is signature-verified and makes plan activation resilient if the mobile app closes after payment.

## Scheduled plan expiry

Install one AWS/EventBridge/cron trigger that runs every minute:

```bash
* * * * * cd /var/www/investormart/backend && php artisan schedule:run --no-interaction >> /dev/null 2>&1
```

The scheduled `investormart:refresh-listing-capacity` command expires paid plans, keeps the first eligible approved listings within the provider's current capacity, and moves remaining approved active listings to `plan_hold`. A new paid plan lets held listings return to the public catalogue automatically.

## Operational checks

```bash
php artisan migrate:status
php artisan schedule:list
php artisan investormart:refresh-listing-capacity
php artisan test
curl https://api.example.com/api/v1/health
```

The deployment team should also configure HTTPS, log rotation/CloudWatch, database backups, an S3 IAM policy scoped to the configured bucket and `listings/*`, and alerts for failed cron executions.
