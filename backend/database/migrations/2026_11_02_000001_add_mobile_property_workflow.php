<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('property')) {
            Schema::table('property', function (Blueprint $table): void {
                if (! Schema::hasColumn('property', 'mobile_status')) {
                    $table->enum('mobile_status', ['pending', 'approved', 'rejected', 'paused', 'archived'])->nullable()->index();
                }
                if (! Schema::hasColumn('property', 'rejection_reason')) {
                    $table->text('rejection_reason')->nullable();
                }
                if (! Schema::hasColumn('property', 'submitted_at')) {
                    $table->dateTime('submitted_at')->nullable();
                }
                if (! Schema::hasColumn('property', 'approved_at')) {
                    $table->dateTime('approved_at')->nullable();
                }
                if (! Schema::hasColumn('property', 'approved_by')) {
                    // No database foreign key: legacy property is MyISAM in the
                    // supplied dump and cannot enforce cross-table constraints.
                    $table->unsignedInteger('approved_by')->nullable();
                }
                if (! Schema::hasColumn('property', 'source')) {
                    $table->enum('source', ['website', 'mobile'])->default('website')->index();
                }
            });
        }

        if (! Schema::hasTable('property_status_history')) {
            Schema::create('property_status_history', function (Blueprint $table): void {
                $table->increments('id');
                $table->unsignedInteger('property_id')->index();
                $table->string('from_status', 50)->nullable();
                $table->string('to_status', 50);
                $table->text('reason')->nullable();
                $table->unsignedInteger('acted_by_admin_id')->nullable();
                $table->dateTime('acted_at')->useCurrent()->index();
                $table->enum('source', ['mobile_app', 'admin_api', 'web_admin'])->default('admin_api');
            });
        }

        if (Schema::hasTable('tbl_users') && ! Schema::hasColumn('tbl_users', 'property_approve')) {
            Schema::table('tbl_users', function (Blueprint $table): void {
                $table->boolean('property_approve')->default(false);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('property_status_history');

        if (Schema::hasTable('property')) {
            Schema::table('property', function (Blueprint $table): void {
                foreach (['mobile_status', 'rejection_reason', 'submitted_at', 'approved_at', 'approved_by', 'source'] as $column) {
                    if (Schema::hasColumn('property', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('tbl_users') && Schema::hasColumn('tbl_users', 'property_approve')) {
            Schema::table('tbl_users', fn (Blueprint $table) => $table->dropColumn('property_approve'));
        }
    }
};
