<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('app_personal_access_tokens', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            // The existing MySQL server enforces a 1000-byte index limit. A
            // 100-character UTF-8 type discriminator keeps this composite
            // Sanctum index safely under that legacy limit.
            $table->string('tokenable_type', 100);
            $table->unsignedBigInteger('tokenable_id');
            $table->index(['tokenable_type', 'tokenable_id']);
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_personal_access_tokens');
    }
};
