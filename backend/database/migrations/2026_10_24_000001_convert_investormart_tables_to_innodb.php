<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const TABLES = [
        'app_personal_access_tokens', 'im_accounts', 'im_otp_challenges', 'im_listing_plans', 'im_plan_orders',
        'im_provider_subscriptions', 'im_listings', 'im_listing_media', 'im_listing_favorites', 'im_inquiries', 'im_admin_audit_logs',
    ];

    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        foreach (self::TABLES as $table) {
            DB::statement("ALTER TABLE `{$table}` ENGINE = InnoDB");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // Application tables deliberately remain transaction-safe on rollback.
    }
};
