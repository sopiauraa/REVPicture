<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}
