# Backend architecture

## Boundary

This service is a stateless Laravel 13 API deployed separately from the legacy PHP website. It connects to the existing InvestorMart MySQL database and exposes versioned mobile and admin endpoints. The legacy website source remains authoritative until its status and write rules are confirmed.

## Application layout

```text
app/
├── Contracts/          Interfaces for OTP, payment, and media providers
├── Enums/              Stable domain values shared across modules
├── Http/
│   ├── Controllers/Api/V1/
│   ├── Requests/Api/V1/
│   └── Resources/Api/V1/
├── Models/             Legacy and app-owned database models
├── Policies/           Authorization rules
├── Providers/          Container bindings and framework bootstrapping
└── Services/           Business workflows and integration adapters
```

Feature code will be added in these modules:

1. Authentication and OTP
2. Public projects/properties catalogue
3. Provider profiles and property workflow
4. Shortlists and inquiries
5. Listing plans and capacity reconciliation
6. Razorpay Orders, verification, and webhooks
7. S3 presigned media uploads
8. Admin review and reporting endpoints

## Property visibility

Public visibility is derived from three independent states:

- Admin approval: draft, pending, approved, rejected
- Provider choice: active, paused, archived
- Plan capacity: eligible, plan_hold

A property is publicly visible only when it is approved, provider-active, and capacity-eligible. This prevents a renewed plan from reactivating a property the provider intentionally paused or archived.

## Deployment assumptions

- PHP 8.3 or newer is available on the AWS runtime.
- The web root points to `backend/public`.
- Secrets are injected through the deployment environment or AWS Secrets Manager/SSM.
- The compute identity receives least-privilege S3 access through an IAM role where possible.
- A scheduler invokes `php artisan schedule:run` every minute when expiry jobs are introduced.
- Queue workers are configured when OTP, media, mail, or webhook workloads are moved to queues.

These assumptions must be reconciled with InvestorMart's employee before staging deployment.
