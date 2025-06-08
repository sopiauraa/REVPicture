<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        // Ambil data jumlah penyewaan per brand dengan join ke products (kolom product_id yang dipakai)
        $brandData = DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.product_id')
            ->select('products.brand', DB::raw('COUNT(*) as count'))
            ->groupBy('products.brand')
            ->get();

        $brands = ['Sonny', 'Fujifilm', 'Canon', 'Nikon', 'Oji Osmo Pocket 3', 'Lumix'];
        $brandCounts = array_fill_keys($brands, 0);

        foreach ($brandData as $data) {
            if (in_array($data->brand, $brands)) {
                $brandCounts[$data->brand] = $data->count;
            }
        }

        $brandsData = [
            'labels' => $brands,
            'data' => array_values($brandCounts),
        ];

        // Ambil data jumlah penyewaan per bulan berdasarkan order_details.created_at
        $monthlyData = DB::table('order_details')
            ->select(DB::raw('MONTH(created_at) as bulan'), DB::raw('COUNT(*) as jumlah'))
            ->whereNotNull('created_at')
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->get();

        // Inisialisasi array bulan dengan 0 dulu
        $monthlyCounts = array_fill(1, 12, 0);
        foreach ($monthlyData as $data) {
            $monthlyCounts[$data->bulan] = $data->jumlah;
        }

        $monthly = [
            'labels' => ['January', 'February', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            'data' => array_values($monthlyCounts),
        ];

        return response()->json([
            'monthly' => $monthly,
            'brands' => $brandsData,
        ]);
    }

public function getDashboardStats()
    {
        // 1. Jumlah Barang (dari tabel products)
        $totalProducts = DB::table('products')->count();

        // 2. Barang Sedang Disewa (dari tabel orders yang statusnya 'terkonfirmasi' dan belum selesai)
        $activerental = DB::table('orders')
            ->join('order_details', 'orders.order_id', '=', 'order_details.order_id')
            ->where('orders.status', 'terkonfirmasi')
            ->where('order_details.due_on', '>=', Carbon::now()->toDateString())
            ->sum('order_details.quantity');

        // 3. Penyewa Aktif (customer yang memiliki order aktif)
        $activeCustomers = DB::table('orders')
            ->join('order_details', 'orders.order_id', '=', 'order_details.order_id')
            ->where('orders.status', 'terkonfirmasi')
            ->where('order_details.due_on', '>=', Carbon::now()->toDateString())
            ->distinct('orders.customer_id')
            ->count('orders.customer_id');

        // Data untuk chart bulanan (contoh data penyewaan per bulan)
        $monthlyData = $this->getMonthlyRentalData();

        // Data untuk chart brand (contoh data berdasarkan brand)
        $brandData = $this->getBrandData();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'active_rentals' => $activerental,
                'active_customers' => $activeCustomers
            ],
            'monthly' => $monthlyData,
            'brands' => $brandData
        ]);
    }

    private function getMonthlyRentalData()
    {
        $monthlyRentals = DB::table('orders')
            ->select(
                DB::raw('MONTH(order_date) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('order_date', Carbon::now()->year)
            ->groupBy(DB::raw('MONTH(order_date)'))
            ->orderBy('month')
            ->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $data = array_fill(0, 12, 0);

        foreach ($monthlyRentals as $rental) {
            $data[$rental->month - 1] = $rental->total;
        }

        return [
            'labels' => $months,
            'data' => $data
        ];
    }

    private function getBrandData()
    {
        // Asumsi ada kolom 'brand' di tabel products
        $brandData = DB::table('products')
            ->join('order_details', 'products.product_id', '=', 'order_details.product_id')
            ->join('orders', 'order_details.order_id', '=', 'orders.order_id')
            ->select('products.brand', DB::raw('COUNT(*) as total'))
            ->groupBy('products.brand')
            ->orderBy('total', 'desc')
            ->limit(6)
            ->get();

        $labels = $brandData->pluck('brand')->toArray();
        $data = $brandData->pluck('total')->toArray();

        // Jika tidak ada kolom brand, gunakan data contoh
        if (empty($labels)) {
            $labels = ['Canon', 'Sony', 'Nikon', 'Fujifilm', 'Panasonic'];
            $data = [35, 28, 20, 12, 8];
        }

        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    public function getRecentBookings()
    {
        $recentBookings = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.customer_id')
            ->select(
                'orders.order_id',
                'customers.customer_name',
                'orders.order_date',
                'orders.status',
                DB::raw('(SELECT COUNT(*) FROM order_details WHERE order_details.order_id = orders.order_id) as total_items'),
                DB::raw('(SELECT GROUP_CONCAT(products.product_name SEPARATOR ", ") FROM order_details JOIN products ON order_details.product_id = products.product_id WHERE order_details.order_id = orders.order_id LIMIT 3) as product_names'),
                DB::raw('(SELECT order_details.duration FROM order_details WHERE order_details.order_id = orders.order_id LIMIT 1) as duration')
            )
            ->where('orders.status', 'pending')
            ->orderBy('orders.order_date', 'desc')
            ->limit(10)
            ->get();

        return response()->json($recentBookings);
    }
}
