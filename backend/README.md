# InvestorMart API

Standalone Laravel 13 API for the InvestorMart mobile applications and the existing administration interface.

## Runtime

- PHP 8.3+
- Laravel 13
- MySQL in staging/production
- Laravel Sanctum for mobile access tokens
- S3-compatible media storage
- Razorpay Orders for the current one-time paid-plan flow

## Local setup

```powershell
Copy-Item .env.example .env
composer install
php artisan key:generate
php artisan test
php artisan serve
```

The generated local `.env` may continue using SQLite for framework tests. Configure MySQL only after importing a local copy of the legacy dump and reviewing the additive migrations.

## Quality checks

```powershell
composer quality
```

## API conventions

- Base path: `/api/v1`
- JSON request and response bodies
- Sanctum bearer tokens for authenticated mobile/admin endpoints
- Thin controllers, Form Request validation, API Resources, and business services
- External providers accessed through contracts so OTP, storage, and payment vendors can be changed without controller rewrites
- All new database objects use an `app_` prefix to reduce collision risk with the legacy schema

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for module boundaries and deployment assumptions.
