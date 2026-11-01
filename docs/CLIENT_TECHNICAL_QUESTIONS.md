# InvestorMart — Technical questions for the client

These questions are only for the client’s technical/deployment team. Product decisions such as catalogue scope, plan rules, filter choices, and approval policy are intentionally excluded.

Do not request real passwords, API keys, tokens, cookies, or AWS secret keys by chat/email. Their engineer should enter them directly into the staging/production server environment.

## A. Existing application and API compatibility

1. Can you provide the existing website and admin-panel PHP source code with all production secrets removed?
2. Which framework and exact version does the existing PHP website use (for example, CodeIgniter)?
3. What PHP version and required PHP extensions are installed in staging and production?
4. Can you provide `composer.json`, `composer.lock`, the current route list, and an environment-variable template with secret values removed?
5. Does the existing website already expose APIs? If yes, provide their base URL, authentication method, API documentation, request/response examples, and error-code conventions.
6. Please provide the existing code or technical contract for property creation/editing, property approval, OTP, image upload, inquiry creation, payment handling, and any scheduled jobs.
7. Does the existing admin panel call APIs or read/write MySQL tables directly?
8. If it calls APIs, what authentication, CORS, CSRF, and session/token convention does it require?
9. If it reads/writes the database directly, which tables/columns are safe for the mobile API to read and write?
10. Are there database triggers, stored procedures, scheduled database events, observers, queues, or cron jobs that the SQL dump does not include?
11. When website, admin panel, and mobile API edit the same record, what is the expected conflict/update rule and source of truth?

## B. Database and migration

12. Is the provided database dump the latest staging/production-compatible schema and data snapshot?
13. What MySQL version, character set, collation, SQL mode, and timezone are used in staging and production?
14. Is MySQL hosted on AWS RDS, EC2, shared hosting, or another provider?
15. Is the database accessible only from a private VPC/network? Which application host/service can connect to it?
16. Does the database connection require TLS/SSL and a CA certificate?
17. Are there read replicas, connection limits, existing indexes, or query-performance constraints we must respect?
18. Who will back up the production database before migration, run the migration, verify it, and perform rollback if necessary?
19. What is the approved staging and production migration window?
20. Are there newer tables not in the dump for plans, payments, shortlists, notifications, or audit logs that we must integrate rather than duplicate?

## C. Backend hosting, domain, and operations

21. Where will the new PHP/Laravel API run: EC2, ECS/Fargate, Elastic Beanstalk, Lightsail, shared hosting, Kubernetes, or another platform?
22. What operating system, web server (Nginx/Apache), PHP-FPM/process manager, document root, and deployment method are used?
23. Will Composer, Artisan/CLI commands, cron, and long-running queue workers be available on the deployment environment?
24. What are the staging and production API domains? Who owns DNS and TLS certificate setup?
25. What HTTPS/TLS requirements, firewall/security-group rules, WAF/rate-limit rules, and allowed CORS origins are required?
26. Where will environment variables/secrets be stored: AWS Secrets Manager, Parameter Store, deployment configuration, or server `.env` file?
27. Who owns deployment, rollback, log access, error monitoring, uptime monitoring, and alerts?
28. What log locations and error-reporting access will be available while staging integration is tested?
29. What health-check endpoint and load-balancer path should be configured?
30. Will the backend run more than one instance? If yes, which shared cache/session/queue service is available (Redis, ElastiCache, SQS, database queue)?
31. What cron/scheduler mechanism will execute the plan-expiry/capacity-refresh command every minute?
32. What queue driver and worker supervisor will process webhooks, emails, and future notifications?
33. What PHP upload, memory, timeout, and request-size limits apply?

## D. AWS S3 / media storage

34. Confirm the S3 bucket name and AWS region for staging and production.
35. Is there a separate staging bucket or a dedicated staging prefix in the production bucket?
36. What exact object-key/folder structure is used for property images, projects, brochures, floor plans, provider documents, and logos?
37. Do database fields store a filename, relative object key, complete S3 URL, or CloudFront URL? Please provide examples from existing records.
38. Are media objects public, private, CloudFront-served, or accessed through temporary signed URLs?
39. Is CloudFront/CDN currently used? If yes, provide the public distribution domain and cache invalidation requirements.
40. Will the backend receive a restricted IAM role, or will the deployment team configure restricted AWS credentials in server secrets?
41. Which S3 permissions are allowed for the API: `GetObject`, `PutObject`, `DeleteObject`, multipart upload, and only which prefixes?
42. What file formats, maximum file size, maximum image count, dimension limits, and compression rules apply?
43. Are videos, brochures, floor-plan PDFs, or provider/KYC documents uploaded in the first release?
44. Is media-virus scanning, image moderation, lifecycle deletion, backup, or retention required?

## E. OTP / SMS service

45. Which SMS/OTP vendor is used behind `https://www.investormart.co.in/sms/sendotpmessage`?
46. Can you provide the legacy controller/service source or its full server-to-server API contract?
47. Is its `token` static, environment-specific, dynamically generated, or replaced by another authorization method?
48. Is the `ci_session` cookie actually required for a server-to-server OTP request? If yes, how is it safely renewed?
49. What request JSON, response JSON, HTTP status codes, timeouts, retry rules, and rate limits does the endpoint use?
50. What sender ID, DLT entity ID, DLT template ID, approved OTP message template, and delivery-status webhook/callback apply?
51. Are test credentials or approved test mobile numbers available for staging?
52. What OTP expiry, resend cooldown, maximum resend count, and maximum verification attempts should be configured?

## F. Razorpay

53. Is the Razorpay merchant account KYC-complete and enabled for both test and live mode?
54. Which payment methods are enabled: UPI, cards, net banking, wallets, and international payments if applicable?
55. Is automatic capture enabled? If not, who captures authorised payments and how is that reconciled?
56. Who will configure test/live Razorpay keys and a unique webhook secret directly in each backend environment?
57. Who will register the staging and production webhook URLs in Razorpay, and which events must be enabled?
58. Can you provide test-mode access or a test account/contact for payment verification?
59. Who handles payment reconciliation, refunds, disputes, chargebacks, settlements, and key rotation?
60. Does the existing website already create Razorpay Orders or process Razorpay webhooks? If yes, provide that implementation so duplicate order/webhook processing is avoided.

## G. Email, notifications, maps, and optional providers

61. Is transactional email required at launch? If yes, which provider is used (SES, SMTP, Mailgun, etc.) and who configures server-side credentials?
62. Which emails are required: welcome, approval/rejection, inquiry, invoice/receipt, plan expiry, or support?
63. Are push notifications required at launch? If yes, who owns Firebase/FCM, iOS APNs, and Expo/EAS configuration?
64. Are Google Maps, geocoding, address autocomplete, pin selection, GPS location, or radius search required? If yes, who owns the Google Cloud project and restricted API keys?
65. Is Meta WhatsApp Business API needed for automated messages? If yes, provide business-account ownership, phone number ID, access-token management, approved templates, and webhook configuration. This is not needed for direct `wa.me` links.

## H. Mobile build and release setup

66. Confirm the final Android package name and iOS bundle identifier.
67. Who owns the Expo/EAS organization and who can create Android/iOS builds?
68. Who owns Google Play Console, Apple Developer, and App Store Connect, and who will submit releases?
69. Will payment testing require a custom Expo development build? Provide the required developer-account access and test device/account arrangement.
70. Provide staging API URL, production API URL, allowed mobile CORS/app origins, and test client/provider/admin accounts.
71. Provide final privacy-policy, terms, support, and account-deletion URLs required for store release.

## Required technical handoff before staging testing

- Existing source/API contracts without secrets.
- Latest compatible DB dump plus database/platform facts.
- Staging API domain and deployment owner.
- S3 staging bucket/prefix plus media format/key rules.
- OTP test integration details.
- Razorpay test/webhook owner and test configuration.
- Staging test client, provider, and admin accounts.
- Log/error contact during staging testing.
