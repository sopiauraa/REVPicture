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
        Schema::create('products', function (Blueprint $table) {
            $table->integer('product_id')->primary()->autoIncrement();
            $table->enum('product_type', ['camera', 'lens']);
            $table->string('product_name');
            $table->text('product_description');
            $table->text('product_image');
            $table->string('brand');
            $table->integer('8_hour_rent_price');
            $table->integer('24_hour_rent_price');
            $table->timestamp('last_updated')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
