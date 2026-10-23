# InvestorMart

InvestorMart is organized as a small product workspace with a mobile client and a standalone PHP API.

```text
investomart/
├── frontend/   Expo SDK 57 React Native application
├── backend/    Laravel 13 stateless API
├── docs/       Product, integration, and API decisions
└── .github/    Continuous integration
```

## Requirements

- Node.js 22.13 or newer for Expo SDK 57
- npm 11 or newer
- PHP 8.3 or newer
- Composer 2.8 or newer
- MySQL compatible with the InvestorMart production database

## Frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
npm.cmd ci
npm.cmd run typecheck
npm.cmd start
```

## Backend

```powershell
cd backend
Copy-Item .env.example .env
composer install
php artisan key:generate
php artisan test
php artisan serve
```

The local backend defaults to SQLite so its health check and tests run without production credentials. Before connecting to the shared InvestorMart database, configure the MySQL settings and review every additive migration against a fresh copy of the supplied dump.

## API boundary

All public mobile and admin endpoints live below `/api/v1`. The initial health endpoint is:

```text
GET /api/v1/health
```

Production secrets belong in the backend deployment environment. Only variables prefixed with `EXPO_PUBLIC_` may be exposed to the mobile bundle, and those values must be treated as public.

See [client integration requirements](docs/CLIENT_INTEGRATION_REQUIREMENTS.md) and [backend architecture](backend/docs/ARCHITECTURE.md).
