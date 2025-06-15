<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;
class DeleteExpiredPendingOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:delete-expired-pending';
    protected $description = 'Delete pending orders older than 24 hours';

    /**
     * The console command description.
     *
     * @var string
     */


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expired = Carbon::now()->subHours(24);

        $orders = Order::where('status', 'pending')
            ->where('order_date', '<', $expired)
            ->get();

        foreach ($orders as $order) {
            // Delete related order details
            $order->orderDetail()->delete();
            $order->delete();
        }

        $this->info('Expired pending orders deleted successfully.');
    }
}
