# InvestorMart client meeting checklist

Use this checklist in the client meeting. Record an owner and target date beside every answer. Do not request production secrets over WhatsApp, email, chat, or source code. Their deployment engineer should enter secrets directly into AWS/staging/production environment variables.

## Confirmed scope — do not reopen unless the client changes it

- There are two mobile experiences: **client** and **property provider**. Provider subtype is **builder**, **owner**, or **broker**; all three have the same permissions and interface.
- Guests can browse, search, filter, and view records. Sign-in is required for shortlist, Call, WhatsApp, and inquiry actions.
- There is no in-app chat in the first release.
- Call opens the device dialer. WhatsApp opens a direct client-to-provider WhatsApp conversation. Meta WhatsApp Business API is not needed for this direct-message flow.
- Each provider has 10 free live-listing slots.
- Premium 20/50/100/200 are one-time, one-month plans. They add 20/50/100/200 slots to the 10 free slots.
- When a plan expires, listings outside the available capacity move to plan hold. They remain visible in the provider workspace but not in the client catalogue. A later purchase restores eligible plan-held records automatically.
- The delivery contains the mobile app, PHP API, additive database migrations, admin API endpoints, documentation, and deployment instructions. InvestorMart’s engineer deploys it and configures infrastructure and secrets.

## 1. Catalogue and existing website behaviour

1. **What should appear in the mobile catalogue: Projects, individual Properties, or both?**
   - A Project is a whole development/community from the legacy `project` table.
   - A Property is one sale/rent listing from the `property` table.
   - If both are required, should they have separate tabs and detail pages, as the current website does?

2. **Which legacy records are safe to show?**
   - All records, only active records, only approved records, only featured records, or a client-supplied shortlist of records?

3. **Please explain every current database/property status.**
   - For each value, state whether it is public, provider-visible, editable, searchable, and eligible to be made live.
   - Include pending, approved, rejected, active, paused, archived, sold/rented, expired, disabled, and any numeric/legacy statuses.

4. **What exact information must a provider enter when creating or editing a listing?**
   - Please review the current mobile create-listing form field-by-field.
   - Mark every field as required/optional and state validation rules, permitted values, and whether it applies to sale, rent, commercial, residential, plot, or project records.

5. **What are the public filter and sorting rules?**
   - Confirm city, locality, purpose (buy/rent), property type, BHK, bathrooms, price, area, furnishing, amenities, possession, verified/featured, and developer filters.
   - Specify default sort order and whether featured/boosted listings rank first.

6. **Which contact number wins for each listing?**
   - Recommended order: verified listing-specific number, provider account number, project contact number, then InvestorMart central number.
   - Confirm separate rules for legacy projects and individual properties.

7. **What happens when a property is sold, rented, unavailable, or expired?**
   - Who changes it, what public label appears, does it remain searchable, and can the provider reactivate it?

## 2. Provider, approval, capacity, and premium-plan decisions

8. **Does a provider account need admin/KYC approval before it can submit a listing?**
   - If yes, what documents are required (PAN, GST, RERA, business registration, identity proof), who approves them, and what can an unapproved provider do?

9. **Confirm the listing approval workflow.**
   - On submission, is the listing `pending` until an admin approves it?
   - Can the admin request changes, reject with a reason, or approve later after a rejection?
   - Does an edit to an already approved/live property require approval again?

10. **Confirm which records consume a listing slot.**
    - Recommended rule: only admin-approved, provider-active, publicly live listings consume capacity.
    - Draft, pending, rejected, paused, archived, sold/rented, expired, and plan-held records do not consume capacity.

11. **How does the provider choose their live 10/30/60/110/210 listings?**
    - Can they turn a live listing off and activate a held listing immediately?
    - If all slots are full, should the backend require a swap, or should it automatically hold the oldest listing?

12. **Confirm plan timing.**
    - Does “one month” mean 30 days or the same date/time in the next calendar month?
    - Confirm `Asia/Kolkata` as the plan timezone.
    - If a provider buys another plan early, does it extend the current expiry, start immediately, replace the current plan, or stack capacity?

13. **Confirm plan expiry and restoration order.**
    - Which 10 listings stay live after expiry: earliest live, newest live, manually pinned listings, or a provider-selected set?
    - When a paid plan is bought later, should all eligible plan-held records restore in their previous live order until capacity is full?

14. **Confirm plans, amounts, tax, and entitlement.**
    - Verify plan names, price, bonus slots, total capacity, validity, GST-inclusive/exclusive pricing, legal merchant name, GSTIN, invoice creator, refunds, and chargeback treatment.
    - Confirm what happens to extra listings if a payment is refunded or disputed.

## 3. Lead, Call, WhatsApp, shortlist, and notification rules

15. **What creates an inquiry?**
    - Should Call tap, WhatsApp tap, and enquiry-form submit each create a lead visible to provider and admin?
    - Should a new record be created for every tap, or should repeated actions by the same client on the same listing be merged into one inquiry with events?

16. **What information should an inquiry contain and who can see it?**
    - Client name, phone, email, message, listing/project, source (mobile/web), channel (Call/WhatsApp/form), timestamps, and status.
    - Confirm whether providers see client phone/email immediately.

17. **Which inquiry statuses are required?**
    - Confirm `new`, `contacted`, `site_visit`, `interested`, `accepted`, `closed` or provide the exact allowed list.
    - State which statuses a provider can update and which are admin-only.

18. **Should clients see an inquiry history?**
    - If yes, define statuses/messages shown to clients and whether they can withdraw an inquiry.

19. **Is direct WhatsApp enough for launch?**
    - Confirm no automatic messages, receipts, or reminders are to be sent from an InvestorMart business number.
    - If automated messages are wanted later, list every message type. That later scope requires Meta WhatsApp Business API, a verified business number, approved templates, and webhook configuration.

20. **Are notifications required in version one?**
    - Property approved/rejected, new inquiry, inquiry status update, plan expiry, payment success/failure, listing expiry.
    - If yes, identify email, push notification, WhatsApp, or SMS for each event.

21. **Confirm shortlist behaviour.**
    - One shortlist per authenticated client, can a client remove it, are project records shortlistable as well as properties, and should the admin/provider see shortlist counts?

## 4. OTP, login, registration, and account rules

22. **What exact SMS/OTP provider is currently used?**
    - The supplied `/sms/sendotpmessage` request proves there is an SMS endpoint, but it does not identify the actual gateway.
    - Provide the vendor name, the endpoint/controller source or API documentation, and a test configuration.

23. **How does the existing OTP endpoint authenticate?**
    - Is the supplied `token` static, environment-specific, or generated?
    - Is the `ci_session` cookie actually required for server-to-server calls?
    - What request/response JSON, error codes, rate limits, sender ID, DLT entity ID, DLT template ID, and delivery callbacks does it use?

24. **Confirm OTP security rules.**
    - OTP length, expiry, resend cooldown, maximum resend count, maximum verification attempts, account lockout behaviour, and test mobile numbers.
    - Confirm whether the same login endpoint automatically registers an account when the mobile number is new.

25. **Confirm account and profile rules.**
    - Required client fields: name, email, city, and consent fields.
    - Required provider fields and whether provider type can later change.
    - Can one phone number have both a client and provider profile, or switch role?
    - Is mobile account deletion required, and what data must be retained after deletion?

26. **Who are the initial admin users?**
    - Provide a list of mobile numbers for admin API access in staging and production through a secure deployment channel.
    - Confirm whether there are admin roles such as super-admin, reviewer, support, finance, or read-only.

## 5. Razorpay and mobile-store payment decision

27. **Confirm the Razorpay merchant account is ready.**
    - Merchant legal entity/KYC status, test and live mode availability, enabled methods (UPI, cards, net banking, wallets), automatic capture, settlement contact, refund/dispute owner.

28. **Who configures Razorpay per environment?**
    - Their deployment engineer must set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and a separate `RAZORPAY_WEBHOOK_SECRET` in the backend environment.
    - Ask who will create the staging and production webhook URLs and select required events, at minimum payment success/failure and refund events.

29. **Confirm the payment record and reconciliation process.**
    - Backend must create an Order, verify the payment signature server-side, accept validated webhooks, and activate capacity only once.
    - Who reconciles a payment that is captured in Razorpay but the webhook/API response was delayed?

30. **Decide the iOS and Android release payment path before store submission.**
    - The premium plan unlocks digital capacity inside the app, so the client must confirm the store-compliant payment approach.
    - Ask their Apple/Google account owner which billing method is approved for this use case and who will provide access/test accounts. Do not assume a technically working Razorpay checkout alone is approved for both stores.

31. **Confirm invoice and tax experience.**
    - Does the app display a receipt only, email an invoice, link to an invoice from the website, or generate a GST invoice? Who owns the invoice numbering and storage?

## 6. AWS, database, storage, and deployment questions

32. **What is the backend hosting target?**
    - EC2, ECS, Elastic Beanstalk, Lightsail, shared hosting, or another service.
    - Ask for PHP version, Composer availability, required extensions, Apache/Nginx setup, document root, process manager, and server operating system.

33. **What database will staging and production use?**
    - RDS MySQL or another host, MySQL version, network/VPC access, SSL requirement, backup owner, maintenance window, and migration owner.
    - Confirm that the supplied SQL dump is the latest production-compatible schema, and provide a fresh dump before final integration.

34. **Can we receive the existing PHP/admin source without production secrets?**
    - Request framework and PHP versions, Composer files, existing routes, property write/approval logic, OTP code, S3 upload code, inquiry code, current cron jobs, queue workers, and legacy media URL construction.
    - This is needed because a database dump cannot describe website logic or external integrations.

35. **How will website, mobile API, and admin writes stay consistent?**
    - If the website and mobile can edit the same property/user/inquiry, identify the source of truth, columns the legacy website requires, conflict behaviour, and whether status changes need to trigger existing website logic.

36. **Confirm S3 media storage details.**
    - Bucket name, AWS region, environment-specific bucket/prefix, folder/key convention, public/private access, CloudFront/CDN URL, database storage format (filename, key, or full URL), and examples of existing objects.

37. **Confirm media upload rules.**
    - Image count per property, allowed formats, max file size, image dimensions, compression/resizing ownership, video support, brochure/floor-plan/document formats, malware scanning if required, and deletion/retention rules.

38. **How will the API obtain S3 access?**
    - Preferred: a restricted AWS IAM role attached to the backend runtime.
    - If credentials are unavoidable, their engineer must add restricted credentials to server secrets only. Never put AWS secrets in the mobile app.

39. **What environments and domains are required?**
    - Staging and production API URLs, DNS owner, HTTPS/TLS owner, CORS origins, firewall/security groups, rate limiting/WAF, logs/monitoring, error alert owner, and health-check URL.

40. **How will scheduled work run?**
    - Confirm cron/scheduler every minute for plan expiry/capacity refresh, queue driver/workers for notifications and webhooks, worker restart procedure, and monitoring owner.

41. **What is the release process?**
    - Who deploys staging, runs migrations, validates a rollback, deploys production, takes backups, and shares server logs if integration fails?

## 7. Admin API and existing admin-panel integration

42. **What exact admin functions does the existing web panel need from the API?**
    - List/review/approve/reject/archive properties; review reason; filter/search/pagination; provider status; client accounts; inquiry list/status; plan/payment list; refunds; audit history; exports.

43. **What filters, fields, and actions are mandatory for every admin screen?**
    - Ask their admin-panel developer to provide mockups, endpoint expectations, or a screen-by-screen list before integration.

44. **What admin audit trail is required?**
    - Who approved/rejected/changed a listing, previous and new values, timestamps, review notes, export requirements, and retention period.

45. **Does the existing admin panel call APIs or read the database directly?**
    - If it calls APIs, provide current API authentication and CORS conventions.
    - If it reads the database directly, confirm the app-specific tables it is allowed to read/write and whether it needs database views or a mapping document.

## 8. Mobile release, legal, and optional integrations

46. **Who owns the mobile accounts and release process?**
    - Google Play Console, Apple Developer/App Store Connect, Expo/EAS organization, Android package name, iOS bundle ID, and the person who submits releases.

47. **Provide final store and legal assets.**
    - App name, logo/icon, splash assets, screenshots, app-store copy, privacy-policy URL, terms URL, account-deletion URL, support email/phone, company address, and data-use disclosures.

48. **Are email messages required?**
    - If yes, identify SMTP/SES provider, sender address/name, message types, test configuration, and owner of templates. Server credentials stay in server secrets.

49. **Are push notifications required?**
    - If yes, provide Firebase/FCM project ownership, iOS APNs setup/Apple access, Expo/EAS owner, notification message copy, opt-in rules, and environments.

50. **Are maps/location features required?**
    - Map display, address autocomplete, GPS location, geocoding, radius search, pin location during listing, and Google Maps account/API key owner.

## Minimum outcome required after the meeting

Before final staging integration, obtain:

1. The project-versus-property catalogue decision and list of public records.
2. Written property status and approval rules.
3. The latest database dump and existing PHP/admin source or equivalent technical contracts.
4. OTP vendor/endpoint contract and staging test route.
5. S3 bucket/region/key format and staging media route.
6. Razorpay staging configuration owner, webhook owner, and mobile-store billing decision.
7. Contact-number, inquiry, WhatsApp, shortlist, and notification rules.
8. Staging infrastructure owner, HTTPS API domain, test client/provider/admin accounts, and deployment date.
9. Admin panel endpoint/field/action requirements.
10. App-store owners, legal URLs, and release assets.

## Handoff note to the client

InvestorMart’s engineer can configure all real database, AWS, OTP, email, Razorpay, and webhook secrets directly in the deployment environment. The development repository contains `.env.example` placeholders only. They should share non-secret architecture details, source code without secrets, endpoint contracts, and test/staging access so the API and mobile app can be verified before production deployment.
