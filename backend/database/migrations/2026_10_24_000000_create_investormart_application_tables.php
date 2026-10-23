<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('im_accounts', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->id();
            $table->unsignedBigInteger('legacy_user_id')->nullable()->unique();
            $table->string('country_code', 8)->default('+91');
            $table->string('phone', 20)->unique();
            $table->string('name', 120)->nullable();
            $table->string('email', 160)->nullable()->index();
            $table->string('role', 20)->default('client')->index();
            $table->string('provider_type', 20)->nullable()->index();
            $table->string('company_name', 160)->nullable();
            $table->string('avatar_url', 2048)->nullable();
            $table->json('profile')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('im_otp_challenges', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->uuid('id')->primary();
            $table->string('country_code', 8)->default('+91');
            $table->string('phone', 20)->index();
            $table->string('code_hash');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('sent_at');
            $table->timestamp('expires_at')->index();
            $table->timestamp('verified_at')->nullable();
            $table->string('request_fingerprint', 128)->nullable()->index();
            $table->timestamps();
        });

        Schema::create('im_listing_plans', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->string('code', 40)->primary();
            $table->string('name', 100);
            $table->unsignedInteger('price_paise');
            $table->unsignedSmallInteger('additional_slots');
            $table->unsignedSmallInteger('duration_days')->default(30);
            $table->boolean('is_active')->default(true)->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('im_plan_orders', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->uuid('id')->primary();
            $table->foreignId('provider_account_id')->constrained('im_accounts')->cascadeOnDelete();
            $table->string('plan_code', 40);
            $table->unsignedInteger('amount_paise');
            $table->string('currency', 3)->default('INR');
            $table->string('receipt', 64)->unique();
            $table->string('gateway', 30)->default('razorpay');
            $table->string('gateway_order_id', 100)->nullable()->unique();
            $table->string('gateway_payment_id', 100)->nullable()->unique();
            $table->string('status', 20)->default('created')->index();
            $table->json('gateway_payload')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            $table->index(['provider_account_id', 'status']);
        });

        Schema::create('im_provider_subscriptions', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->uuid('id')->primary();
            $table->foreignId('provider_account_id')->constrained('im_accounts')->cascadeOnDelete();
            $table->uuid('plan_order_id')->nullable()->unique();
            $table->string('plan_code', 40);
            $table->unsignedSmallInteger('additional_slots');
            $table->string('status', 20)->default('active')->index();
            $table->timestamp('starts_at')->index();
            $table->timestamp('expires_at')->index();
            $table->timestamps();
            $table->index(['provider_account_id', 'status', 'expires_at'], 'im_sub_provider_active_idx');
        });

        Schema::create('im_listings', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->uuid('id')->primary();
            $table->foreignId('provider_account_id')->constrained('im_accounts')->cascadeOnDelete();
            $table->string('reference', 32)->unique();
            $table->string('title', 180);
            $table->string('property_type', 50)->index();
            $table->string('listing_type', 20)->index();
            $table->decimal('price', 14, 2);
            $table->string('price_period', 20)->nullable();
            $table->string('bedrooms', 20)->nullable()->index();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->decimal('area', 12, 2)->nullable()->index();
            $table->string('area_unit', 20)->nullable();
            $table->string('furnishing', 40)->nullable()->index();
            $table->decimal('deposit', 14, 2)->nullable();
            $table->string('city', 120)->index();
            $table->string('location', 180)->index();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->longText('description')->nullable();
            $table->json('amenities')->nullable();
            $table->json('details')->nullable();
            $table->string('contact_name', 120)->nullable();
            $table->string('contact_phone', 20)->nullable();
            $table->string('primary_image_url', 2048)->nullable();
            $table->string('approval_status', 20)->default('pending')->index();
            $table->string('provider_status', 20)->default('active')->index();
            $table->string('capacity_status', 20)->default('eligible')->index();
            $table->unsignedInteger('slot_priority')->default(0)->index();
            $table->text('review_note')->nullable();
            $table->timestamp('submitted_at')->nullable()->index();
            $table->timestamp('approved_at')->nullable()->index();
            $table->unsignedBigInteger('approved_by_account_id')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['provider_account_id', 'approval_status', 'provider_status'], 'im_listing_provider_state_idx');
            $table->index(['approval_status', 'provider_status', 'capacity_status'], 'im_listing_public_state_idx');
        });

        Schema::create('im_listing_media', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->id();
            $table->uuid('listing_id');
            $table->string('disk', 50)->default('s3');
            $table->string('object_key', 1024)->nullable();
            $table->string('url', 2048)->nullable();
            $table->string('media_type', 20)->default('image');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->foreign('listing_id')->references('id')->on('im_listings')->cascadeOnDelete();
            $table->index(['listing_id', 'sort_order']);
        });

        Schema::create('im_listing_favorites', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('account_id')->constrained('im_accounts')->cascadeOnDelete();
            $table->string('listing_source', 30);
            $table->string('listing_id', 64);
            $table->timestamps();
            $table->unique(['account_id', 'listing_source', 'listing_id'], 'im_favorites_unique_listing');
        });

        Schema::create('im_inquiries', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->uuid('id')->primary();
            $table->string('listing_source', 30);
            $table->string('listing_id', 64);
            $table->foreignId('provider_account_id')->nullable()->constrained('im_accounts')->nullOnDelete();
            $table->foreignId('client_account_id')->nullable()->constrained('im_accounts')->nullOnDelete();
            $table->string('channel', 20)->default('form')->index();
            $table->string('status', 20)->default('new')->index();
            $table->string('client_name', 120)->nullable();
            $table->string('client_phone', 20)->nullable();
            $table->string('client_email', 160)->nullable();
            $table->text('message')->nullable();
            $table->string('move_in_date', 64)->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->timestamps();
            $table->index(['provider_account_id', 'status', 'created_at']);
            $table->index(['listing_source', 'listing_id']);
        });

        Schema::create('im_admin_audit_logs', function (Blueprint $table): void {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('actor_account_id')->nullable()->constrained('im_accounts')->nullOnDelete();
            $table->string('action', 100)->index();
            $table->string('subject_type', 100);
            $table->string('subject_id', 100);
            $table->json('metadata')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
            $table->index(['subject_type', 'subject_id']);
        });

        DB::table('im_listing_plans')->insert([
            ['code' => 'premium_20', 'name' => 'Premium 20', 'price_paise' => 50000, 'additional_slots' => 20, 'duration_days' => 30, 'is_active' => true, 'metadata' => json_encode(['display_price' => 500]), 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'premium_50', 'name' => 'Premium 50', 'price_paise' => 100000, 'additional_slots' => 50, 'duration_days' => 30, 'is_active' => true, 'metadata' => json_encode(['display_price' => 1000]), 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'premium_100', 'name' => 'Premium 100', 'price_paise' => 200000, 'additional_slots' => 100, 'duration_days' => 30, 'is_active' => true, 'metadata' => json_encode(['display_price' => 2000]), 'created_at' => now(), 'updated_at' => now()],
            ['code' => 'premium_200', 'name' => 'Premium 200', 'price_paise' => 350000, 'additional_slots' => 200, 'duration_days' => 30, 'is_active' => true, 'metadata' => json_encode(['display_price' => 3500]), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('im_admin_audit_logs');
        Schema::dropIfExists('im_inquiries');
        Schema::dropIfExists('im_listing_favorites');
        Schema::dropIfExists('im_listing_media');
        Schema::dropIfExists('im_listings');
        Schema::dropIfExists('im_provider_subscriptions');
        Schema::dropIfExists('im_plan_orders');
        Schema::dropIfExists('im_listing_plans');
        Schema::dropIfExists('im_otp_challenges');
        Schema::dropIfExists('im_accounts');
    }
};
