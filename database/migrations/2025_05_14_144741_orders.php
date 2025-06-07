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
        Schema::create('orders', function (Blueprint $table) {
            $table->integer('order_id')->primary()->autoIncrement();
            $table->integer('customer_id');
            $table->date('order_date');
            $table->enum('status_dp', ['belum_dibayar', 'sudah_dibayar'])->default('belum_dibayar');
            $table->enum('status', ['pending', 'terkonfirmasi', 'selesai'])->default('pending');
            $table->integer('total_price')->default(0);
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('restrict');
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
