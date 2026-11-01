# Review of InvestorMart technical response

This review records the implementation consequences of the client’s response. It deliberately excludes credentials, tokens, passwords, cookies, and any other secret values.

## Confirmed and usable now

| Area | Confirmed implementation detail | Backend impact |
|---|---|---|
| Existing website | CodeIgniter 3.1.4 on PHP 8.x | The Laravel API is a separate API and must remain compatible with the shared database and legacy media conventions. |
| Legacy property approval | `property.status = 0` means pending; `property.status = 1` means active/live | Public legacy-property catalogue queries must return only `status = 1` records. |
| Legacy inquiry record | Website uses `enquiry1` for its own leads | Mobile/API inquiry storage and legacy admin visibility need an explicit integration decision; see blocker 1. |
| Legacy admin panel | Procedural PHP that uses direct MySQL queries; it does not call APIs | The legacy admin interface will not automatically display new API records placed in `im_*` tables. |
| Database runtime | Intended production compatibility is MySQL 8+, `utf8mb4_unicode_ci`, `Asia/Kolkata`, non-strict mode | Use `Asia/Kolkata` in the API and test against the actual staging schema before deployment. |
| Current hosting | cPanel/Linux; database is local-only on that host | A Laravel API deployed to AWS EC2/Lightsail cannot access that MySQL instance until Remote MySQL/VPN/tunnel/private networking is configured. |
| S3 | Bucket `investormart`, region `ap-south-1`, direct public S3 delivery | Configure the backend’s media URL from the S3 public base URL and use the stated legacy prefixes for old images. |
| Legacy property images | Images use `property_folder/property_gallary/{filename}` | The legacy-property presenter must prepend this prefix when a legacy field contains only a filename. |
| Upload rules | JPEG, PNG, WebP, and PDFs; 10 MB per file; up to 8 property images; no video/KYC upload in release one | Provider upload validation must be aligned to these limits. |
| OTP gateway | Gupshup is used through InvestorMart’s server-to-server OTP endpoint | Laravel should generate, hash, expire, and verify OTPs; it calls the existing endpoint only to deliver the SMS. |
| OTP policy | Six digits, 10-minute expiry, 30-second resend cooldown, maximum five verification attempts | API configuration and OTP throttling must match these values. |
| Razorpay | No legacy integration exists | The new Laravel Razorpay Order, signature-verification, and webhook implementation has no legacy payment conflict. |
| Email | Gmail/Google Workspace SMTP is the current provider | The existing credentials must be treated as server-only secrets and should be rotated because they were included in the shared response. |
| WhatsApp | Direct `wa.me` click-to-chat at launch | No Meta API setup is required for release one. |

## Blockers that require an explicit client decision

### 1. Legacy-admin visibility versus the new API tables

The existing `/siteadmin` panel reads and writes legacy MySQL tables directly. The mobile API currently stores new accounts, listings, inquiries, plans, payments, shortlists, and audit records in additive `im_*` tables. Therefore, the old admin panel will not automatically see or approve a mobile-created `im_listings` record, and it will not automatically see an `im_inquiries` record.

The client must select one approach before production integration:

1. **Admin API integration:** their admin developer updates the existing admin panel to call the new admin APIs or adds screens for the `im_*` records. This preserves the additive-table architecture.
2. **Legacy-table adapter:** the Laravel API writes provider listings to legacy `property` and leads to legacy `enquiry1`, using the exact CodeIgniter field mapping and status conventions. This makes entries visible to the existing panel, but requires a complete current mapping and careful compatibility testing.
3. **Separate operational workflow:** the new mobile admin APIs are the only way to manage mobile-created records. The legacy panel continues to manage only legacy website records.

No code should assume one of these approaches without their written choice.

### 2. API hosting and database connectivity

The answer describes AWS EC2/Lightsail as a recommendation, not a confirmed deployment choice. The production database is currently localhost-only on a cPanel server.

Before deployment, confirm one exact architecture:

1. Laravel API deployed on the same cPanel host, with MySQL `localhost` access; or
2. Laravel API deployed on AWS, with a secure allowed connection path to MySQL (private network/VPN/tunnel, Remote MySQL allowlisting, or a database migration to RDS); or
3. Website and database migrated to AWS/RDS together.

The deployment engineer must provide the final host, API domain, and safe database connectivity method.

### 3. Staging is not yet provisioned

The supplied API URLs are alternatives rather than working URLs, and the S3 answer provides a recommendation rather than a created staging location. Before integration testing, the client must provide:

- One actual HTTPS staging API URL.
- A deployed Laravel runtime or deployment access for their engineer.
- A staging database or approved database copy.
- A staging S3 bucket or an isolated `staging/` prefix with suitable IAM permissions.
- Staging OTP test setup, Razorpay test configuration, and client/provider/admin test accounts.

### 4. Exact app identifiers are not final

Android and iOS identifiers are given as alternatives. The client must choose one immutable package/bundle ID before creating store builds. The frontend currently uses `com.investormart.app`.

### 5. Store and payment ownership details remain open

The response does not identify the Expo/EAS owner, Google Play Console owner, Apple Developer/App Store Connect owner, or mobile store billing path for paid listing capacity. These are needed before release/payment testing.

## Schema and source-version mismatches to resolve

The response must be verified against a fresh production-compatible database dump before any legacy-table adapter is written.

1. The local SQL dump is labelled MySQL 5.7 and contains legacy MyISAM/`latin1` tables such as `app_users`; the response says MySQL 8+ / `utf8mb4` / InnoDB compatibility.
2. The response lists `enquiry1.is_read` and `enquiry1.lead_status`; the local dump’s `enquiry1` definition does not include these columns.
3. The response names property payload fields such as `propertyfor`, `propertycat`, and `proname`; the local API catalogue currently reads legacy columns with names such as `pro_for`, `pro_cat`, and `pro_name`.

These may be form-field names mapped by CodeIgniter rather than actual SQL column names, or they may indicate a newer schema/source version. Obtain the actual `Front::addproperties()`, `Front::editproperties()`, `Front::contact_us_save`, and `siteadmin/property-status-toggle.php` files with secrets removed, plus a fresh schema-only dump, to resolve the mapping.

## Security actions required from the client

The pasted response contained an active-looking OTP token, SMS gateway credentials, and SMTP password. Do not add those values to Git, documentation, `.env.example`, task tickets, or mobile configuration. The client should rotate them and then have its deployment engineer add replacement values only to the server secret store or restricted `.env` file.

The static OTP described for store testing must exist only in an isolated staging/review environment. It must never be accepted by the production API.

## Next engineering work once blockers are resolved

1. Configure the Gupshup-backed server-to-server OTP sender with the rotated server secret; set 10-minute expiry, 30-second resend cooldown, and five verification attempts.
2. Apply the confirmed legacy active-property filter and S3 legacy property-gallery media prefix.
3. Align provider media validation to eight images, 10 MB each, and the agreed formats.
4. Implement the selected admin/legacy-table integration approach.
5. Configure staging S3, OTP, Razorpay webhooks, and backend environment values.
6. Test legacy catalogue, new provider submission, approval, inquiry visibility, plan hold/restore, payment verification, and mobile login against the actual staging environment.
