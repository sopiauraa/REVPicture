<?php

namespace App\Http\Controllers;

use App\Models\Sewa;
use App\Models\Order;
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
            ->where('status', 'terkonfirmasi') // hanya ambil penyewaan aktif
            ->get()
            ->map(function ($order) {
                $orderDetail = $order->orderDetail;
                $product = $orderDetail?->product;
                $customer = $order->customer;

                return [
                    'order_id' => $order->order_id,
                    'customer_name' => $customer->customer_name ?? '-',
                    'product_name' => $product->product_name ?? '-',
                    'day_rent' => $orderDetail->day_rent ?? '-',
                    'due_on' => $orderDetail->due_on ?? '-',
                    'duration' => $orderDetail->duration ?? '-',
                    'phone_number' => $customer->phone_number ?? '-',
                    'status' => $order->status ?? 'terkonfirmasi',
                ];
            });

        return Inertia::render('staff/staff_data_sewa', [
            'orders' => $orders,
        ]);
    }
    public function adminindex()
    {
        $orders = Order::with(['orderDetail.product', 'customer'])
            ->where('status', 'terkonfirmasi') // hanya ambil penyewaan aktif
            ->get()
            ->map(function ($order) {
                $orderDetail = $order->orderDetail;
                $product = $orderDetail?->product;
                $customer = $order->customer;

                return [
                    'order_id' => $order->order_id,
                    'customer_name' => $customer->customer_name ?? '-',
                    'product_name' => $product->product_name ?? '-',
                    'day_rent' => $orderDetail->day_rent ?? '-',
                    'due_on' => $orderDetail->due_on ?? '-',
                    'duration' => $orderDetail->duration ?? '-',
                    'phone_number' => $customer->phone_number ?? '-',
                    'status' => $order->status ?? 'terkonfirmasi',
                ];
            });

        return Inertia::render('admin/datapenyewaan', [
            'orders' => $orders,
        ]);
    }



    public function update(Request $request, $order_id)
    {
        $order = Order::with('orderDetail.product.stock')->findOrFail($order_id);

    if ($request->status === 'selesai') {
        $order->status = 'selesai';

        // Ambil stok dari relasi orderDetail → product → stock
        $stock = $order->orderDetail?->product?->stock;

        if ($stock && $stock->stock_available > 0) {
            $stock->stock_available += 1;
            $stock->save();
        } else {
            return redirect()->back()->with('error', 'Stok produk tidak tersedia.');
        }

        $order->save();
    }

    return redirect()->back()->with('success', 'Status DP diperbarui dan stok dikurangi.');
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
    $order = Order::with('orderDetail.product.stock')->findOrFail($order_id);

    if ($request->status === 'selesai') {
        $order->status = 'selesai';

        // Ambil stok dari relasi orderDetail → product → stock
        $stock = $order->orderDetail?->product?->stock;

        if ($stock && $stock->stock_available > 0) {
            $stock->stock_available += 1;
            $stock->save();
        } else {
            return redirect()->back()->with('error', 'Stok produk tidak tersedia.');
        }

        $order->save();
    }

    return redirect()->back()->with('success', 'Status DP diperbarui dan stok dikurangi.');
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
