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
        Schema::create('order_details', function (Blueprint $table) {
            $table->integer('order_detail_id')->primary()->autoIncrement();
            $table->integer('order_id');
            $table->integer('product_id');
            $table->enum('duration', ['eight_hour', 'twenty_four_hour']);
            $table->integer('day_rent');
            $table->date('due_on');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('restrict');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('restrict');
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
