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
            $table->enum('brand', ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Lumix']);
            $table->integer('eight_hour_rent_price');
            $table->integer('twenty_four_hour_rent_price');
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
