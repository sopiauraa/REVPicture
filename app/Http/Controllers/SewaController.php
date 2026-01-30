<?php

namespace App\Http\Controllers;

use App\Models\Sewa;
use App\Models\Order;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Customer;
use App\Models\OrderDetail;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SewaController extends Controller
{
    public function index()
    {
        $orders = Order::with(['orderDetail.product', 'customer'])
        ->where('status', 'terkonfirmasi')
        ->get()
        ->map(function ($order) {
            $customer = $order->customer;

            return [
                'order_id' => $order->order_id,
                'customer_name' => $customer->customer_name ?? '-',
                'phone_number' => $customer->phone_number ?? '-',
                'status' => $order->status ?? 'terkonfirmasi',
                'details' => $order->orderDetail->map(function ($detail) {
                    return [
                        'product_name' => $detail->product->product_name ?? '-',
                        'day_rent' => $detail->day_rent ?? '-',
                        'due_on' => $detail->due_on ?? '-',
                        'duration' => $detail->duration ?? '-',
                    ];
                }),
            ];
        });

        return Inertia::render('staff/staff_data_sewa', [
            'orders' => $orders,
        ]);
    }
    public function adminindex()
{
    $orders = Order::with(['orderDetail.product', 'customer'])
        ->where('status', 'terkonfirmasi')
        ->get()
        ->map(function ($order) {
            $customer = $order->customer;

            return [
                'order_id' => $order->order_id,
                'customer_name' => $customer->customer_name ?? '-',
                'phone_number' => $customer->phone_number ?? '-',
                'status' => $order->status ?? 'terkonfirmasi',
                'details' => $order->orderDetail->map(function ($detail) {
                    return [
                        'product_name' => $detail->product->product_name ?? '-',
                        'day_rent' => $detail->day_rent ?? '-',
                        'due_on' => $detail->due_on ?? '-',
                        'duration' => $detail->duration ?? '-',
                    ];
                }),
            ];
        });

    return Inertia::render('admin/datapenyewaan', [
        'orders' => $orders,
    ]);
}





    public function update(Request $request, $order_id)
    {
        \Log::info('adminupdate called', ['order_id' => $order_id, 'status_dp' => $request->status_dp, 'status' => $request->status]);

    // Ambil order beserta relasi orderDetail dan product
    $order = Order::with('orderDetail.product')->findOrFail($order_id);

    // 1. Kurangi stok saat pembayaran sudah dilakukan
    if (strtolower($request->status_dp) === 'sudah_dibayar') {
        $order->status_dp = 'sudah_dibayar';
        $order->status = 'terkonfirmasi';

        $productCounts = [];

        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;
            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productCounts[$productId]['count'] = ($productCounts[$productId]['count'] ?? 0) + $detail->quantity;
            $productCounts[$productId]['name'] = $product->product_name ?? "Produk ID: $productId";
        }

        // Validasi stok tersedia
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            if (!$stock || $stock->stock_available < $data['count']) {
                return redirect()->back()->with('error', "Stok tidak cukup untuk produk {$data['name']}.");
            }
        }

        // Kurangi stok
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            $stock->stock_available -= $data['count'];
            $stock->save();
            \Log::info("Stok dikurangi untuk produk ID {$productId} sebanyak {$data['count']}. Sisa stok: {$stock->stock_available}");
        }

        $order->save();
        return redirect()->back()->with('success', 'Status pembayaran diperbarui dan stok dikurangi.');
    }

    // 2. Tambah stok kembali saat barang dikembalikan
    if (strtolower($request->status) === 'selesai') {
        $order->status = 'selesai';

        $productCounts = [];

        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;
            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productCounts[$productId]['count'] = ($productCounts[$productId]['count'] ?? 0) + $detail->quantity;
            $productCounts[$productId]['name'] = $product->product_name ?? "Produk ID: $productId";
        }

        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            if (!$stock) {
                return redirect()->back()->with('error', "Stok tidak ditemukan untuk produk {$data['name']}.");
            }

            $stock->stock_available += $data['count']; // Tambah kembali
            $stock->save();
            \Log::info("Stok dikembalikan untuk produk ID {$productId} sebanyak {$data['count']}. Total stok sekarang: {$stock->stock_available}");
        }

        $order->save();
        return redirect()->back()->with('success', 'Barang dikembalikan dan stok berhasil diperbarui.');
    }

    return redirect()->back()->with('info', 'Tidak ada perubahan status.');
    }

    // public function adminupdate(Request $request, $order_id)
    // {
    //     $order = Order::findOrFail($order_id);

    //     if ($request->has('status')) {
    //         $order->status = $request->status;
    //         $order->save();
    //     }

    //     return redirect()->back();
    // }

    public function adminupdate(Request $request, $order_id)
{
    \Log::info('adminupdate called', ['order_id' => $order_id, 'status_dp' => $request->status_dp, 'status' => $request->status]);

    // Ambil order beserta relasi orderDetail dan product
    $order = Order::with('orderDetail.product')->findOrFail($order_id);

    // 1. Kurangi stok saat pembayaran sudah dilakukan
    if (strtolower($request->status_dp) === 'sudah_dibayar') {
        $order->status_dp = 'sudah_dibayar';
        $order->status = 'terkonfirmasi';

        $productCounts = [];

        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;
            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productCounts[$productId]['count'] = ($productCounts[$productId]['count'] ?? 0) + $detail->quantity;
            $productCounts[$productId]['name'] = $product->product_name ?? "Produk ID: $productId";
        }

        // Validasi stok tersedia
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            if (!$stock || $stock->stock_available < $data['count']) {
                return redirect()->back()->with('error', "Stok tidak cukup untuk produk {$data['name']}.");
            }
        }

        // Kurangi stok
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            $stock->stock_available -= $data['count'];
            $stock->save();
            \Log::info("Stok dikurangi untuk produk ID {$productId} sebanyak {$data['count']}. Sisa stok: {$stock->stock_available}");
        }

        $order->save();
        return redirect()->back()->with('success', 'Status pembayaran diperbarui dan stok dikurangi.');
    }

    // 2. Tambah stok kembali saat barang dikembalikan
    if (strtolower($request->status) === 'selesai') {
        $order->status = 'selesai';

        $productCounts = [];

        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;
            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productCounts[$productId]['count'] = ($productCounts[$productId]['count'] ?? 0) + $detail->quantity;
            $productCounts[$productId]['name'] = $product->product_name ?? "Produk ID: $productId";
        }

        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            if (!$stock) {
                return redirect()->back()->with('error', "Stok tidak ditemukan untuk produk {$data['name']}.");
            }

            $stock->stock_available += $data['count']; // Tambah kembali
            $stock->save();
            \Log::info("Stok dikembalikan untuk produk ID {$productId} sebanyak {$data['count']}. Total stok sekarang: {$stock->stock_available}");
        }

        $order->save();
        return redirect()->back()->with('success', 'Barang dikembalikan dan stok berhasil diperbarui.');
    }

    return redirect()->back()->with('info', 'Tidak ada perubahan status.');
}



    public function admindestroy($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        // Hapus order detail juga jika ada
        $order->orderDetail()?->delete();

        $order->delete();

        return redirect()->back();
    }

}
