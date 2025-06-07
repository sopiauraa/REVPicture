<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\order;
use App\Models\Product;
use App\Models\Customer;
use App\Models\sewa;
use App\Models\OrderDetail;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ordercontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $orders = Order::with(['orderDetail.product', 'customer'])
            ->where('status_dp', 'belum_dibayar')
            ->get()
            ->map(function ($order) {
                $orderDetail = $order->orderDetail;
                $product = $orderDetail?->product;
                $customer = $order->customer;

                $duration = $orderDetail->duration ?? '-';
                $price = match ($duration) {
                    'eight_hour' => $product->eight_hour_rent_price ?? 0,
                    'twenty_four_hour' => $product->twenty_four_hour_rent_price ?? 0,
                    default => 0,
                };

                return [
                    'order_id' => $order->order_id,
                    'customer_name' => $customer->customer_name ?? '-',
                    'phone_number' => $customer->phone_number ?? '-',
                    'item_name' => $product->product_name ?? '-',
                    'order_date' => $order->order_date,
                    'duration' => $duration,
                    'price' => $price,
                    'contact_wa' => $customer->phone_number ?? '-',
                    'status_dp' => $order->status_dp,
                ];
            });

        return Inertia::render('staff/staff_data_booking_masuk', [
            'orders' => $orders,
        ]);
    }



    public function adminindex()
    {
        $orders = Order::with(['orderDetail.product', 'customer'])
            ->where('status_dp', 'belum_dibayar')
            ->get()
            ->map(function ($order) {
                $orderDetail = $order->orderDetail;
                $product = $orderDetail?->product;
                $customer = $order->customer;

                $duration = $orderDetail->duration ?? '-';
                $price = match ($duration) {
                    'eight_hour' => $product->eight_hour_rent_price ?? 0,
                    'twenty_four_hour' => $product->twenty_four_hour_rent_price ?? 0,
                    default => 0,
                };

                return [
                    'order_id' => $order->order_id,
                    'customer_name' => $customer->customer_name ?? '-',
                    'phone_number' => $customer->phone_number ?? '-',
                    'item_name' => $product->product_name ?? '-',
                    'order_date' => $order->order_date,
                    'duration' => $duration,
                    'price' => $price,
                    'contact_wa' => $customer->phone_number ?? '-',
                    'status_dp' => $order->status_dp,
                ];
            });

        return Inertia::render('admin/bookingmasuk', [
            'orders' => $orders,
        ]);
    }

    public function historyadmin()
    {
        $history = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.customer_id')
            ->join('order_details', 'orders.order_id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.product_id')
            ->where('orders.status', 'selesai')
            ->select(
                'orders.order_id',
                'customers.customer_name',
                'customers.phone_number',
                'orders.order_date',
                'order_details.day_rent',
                'order_details.due_on',
                'products.product_name',
                // Logika harga berdasarkan durasi day_rent
                DB::raw("
                CASE
                    WHEN order_details.day_rent <= 0.33 THEN products.eight_hour_rent_price
                    WHEN order_details.day_rent <= 1 THEN products.twenty_four_hour_rent_price
                    ELSE products.twenty_four_hour_rent_price * order_details.day_rent
                END AS price
                ")
            )
            ->get();

        return Inertia::render('admin/history', [
            'history' => $history,
        ]);
    }
    public function history()
    {
        $history = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.customer_id')
            ->join('order_details', 'orders.order_id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.product_id')
            ->where('orders.status', 'selesai')
            ->select(
                'orders.order_id',
                'customers.customer_name',
                'customers.phone_number',
                'orders.order_date',
                'order_details.day_rent',
                'order_details.due_on',
                'products.product_name',
                // Logika harga berdasarkan durasi day_rent
                DB::raw("
                CASE
                    WHEN order_details.day_rent <= 0.33 THEN products.eight_hour_rent_price
                    WHEN order_details.day_rent <= 1 THEN products.twenty_four_hour_rent_price
                    ELSE products.twenty_four_hour_rent_price * order_details.day_rent
                END AS price
                ")
            )
            ->get();

        return Inertia::render('staff/history', [
            'history' => $history,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'social_media' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,product_id',
            'items.*.duration' => 'required|in:eight_hour,twenty_four_hour',
            'items.*.day_rent' => 'required|integer|min:1',
            'total' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $customer = Customer::create([
                'user_id' => auth()->user()->user_id,
                'customer_name' => $request->name,
                'phone_number' => $request->phone,
                'address' => $request->address,
                'social_media' => $request->social_media,
            ]);

            $order = Order::create([
                'customer_id' => $customer->customer_id,
                'order_date' => now(),
                'total_price' => $request->total,
                'status' => 'diproses',
                'status_dp' => 'belum_dibayar',
            ]);

            foreach ($request->items as $item) {
                OrderDetail::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['product_id'],
                    'duration' => $item['duration'],
                    'day_rent' => $item['day_rent'],
                    'due_on' => now()->addDays($item['day_rent']),
                ]);
            }

            DB::commit();
            return redirect('/success')->with('message', 'Order berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan pesanan: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        if ($request->status_dp === 'sudah_dibayar') {
            $order->status_dp = 'sudah_dibayar';
            $order->save();
        }

        return response()->noContent();
    }

    public function destroy($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        // Hapus order detail juga jika ada
        $order->orderDetail()?->delete();

        $order->delete();

        return response()->noContent();
    }

    public function adminupdate(Request $request, $order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        if ($request->status_dp === 'sudah_dibayar') {
            $order->status_dp = 'sudah_dibayar';
            $order->save();
        }

        return response()->noContent();
    }

    public function admindestroy($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        // Hapus order detail juga jika ada
        $order->orderDetail()?->delete();

        $order->delete();

        return response()->noContent();
    }
}