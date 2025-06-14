<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\order;
use App\Models\Stock;
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
            $customer = $order->customer;

            $items = $order->orderDetail->map(function ($detail) {
    $product = $detail->product;
    $duration = $detail->duration ?? '-';
    $quantity = $detail->quantity ?? 1; // default 1 jika null
    $price = match ($duration) {
        'eight_hour' => $product?->eight_hour_rent_price ?? 0,
        'twenty_four_hour' => $product?->twenty_four_hour_rent_price ?? 0,
        default => 0,
    };

    return [
        'item_name' => $product?->product_name ?? '-',
        'duration' => $duration,
        'price' => $price,
        'quantity' => $quantity,
    ];
});

            return [
                'order_id' => $order->order_id,
                'customer_name' => $customer->customer_name ?? '-',
                'order_date' => $order->order_date,
                'contact_wa' => $customer->phone_number ?? '-',
                'status_dp' => $order->status_dp,
                'items' => $items,
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
            $customer = $order->customer;

            $items = $order->orderDetail->map(function ($detail) {
    $product = $detail->product;
    $duration = $detail->duration ?? '-';
    $quantity = $detail->quantity ?? 1; // default 1 jika null
    $price = match ($duration) {
        'eight_hour' => $product?->eight_hour_rent_price ?? 0,
        'twenty_four_hour' => $product?->twenty_four_hour_rent_price ?? 0,
        default => 0,
    };

    return [
        'item_name' => $product?->product_name ?? '-',
        'duration' => $duration,
        'price' => $price,
        'quantity' => $quantity,
    ];
});


            return [
                'order_id' => $order->order_id,
                'customer_name' => $customer->customer_name ?? '-',
                'order_date' => $order->order_date,
                'contact_wa' => $customer->phone_number ?? '-',
                'status_dp' => $order->status_dp,
                'items' => $items,
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
            'orders.total_price as price' // Ambil total harga langsung dari kolom orders.total_price
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
            'orders.total_price as price' // Ambil total harga langsung dari kolom orders.total_price
        )
        ->get();

        return Inertia::render('staff/history', [
            'history' => $history,
        ]);
    }
    public function historycustomer()
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
            'orders.total_price as price' // Ambil total harga langsung dari kolom orders.total_price
        )
        ->get();

        return Inertia::render('historycustomer', [
            'history' => $history,
        ]);
    }

    public function statusorder()
    {
        $status = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.customer_id')
            ->join('order_details', 'orders.order_id', '=', 'order_details.order_id')
            ->join('products', 'order_details.product_id', '=', 'products.product_id')
            ->whereIn('orders.status', ['pending', 'terkonfirmasi'])
            ->select(
                'orders.order_id',
                'customers.customer_name',
                'customers.phone_number',
                'orders.order_date',
                DB::raw('MAX(order_details.day_rent) as day_rent'), // atau MIN/AVG tergantung logika bisnis
                DB::raw('MAX(order_details.due_on) as due_on'),
                DB::raw('GROUP_CONCAT(DISTINCT products.product_name SEPARATOR ", ") as product_name'), // Gabungkan semua produk
                'orders.status',
                'orders.total_price as price'
            )
            ->groupBy(
                'orders.order_id',
                'customers.customer_name', 
                'customers.phone_number',
                'orders.order_date',
                'orders.status',
                'orders.total_price'
            )
            ->get();

        return Inertia::render('statusorder', [
            'status' => $status,
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
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric',
        ]);

        DB::beginTransaction();
        \Log::info('OrderController@store payload', $request->all());
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
                'status' => 'pending',
                'status_dp' => 'belum_dibayar',
            ]);

            foreach ($request->items as $item) {
                OrderDetail::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['product_id'],
                    'duration' => $item['duration'],
                    'day_rent' => $item['day_rent'],
                    'quantity' => $item['quantity'],
                    'due_on' => now()->addDays($item['day_rent']),
                ]);
            }

            DB::commit();
            return redirect('/')->with('message', 'Order berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('OrderController@store error: ' . $e->getMessage());
            return back()->withErrors(provider: ['error' => 'Gagal menyimpan pesanan: ' . $e->getMessage()]);
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
       \Log::info('adminupdate called', ['order_id' => $order_id, 'status_dp' => $request->status_dp]);

    // Ambil order beserta relasi orderDetail dan product
    $order = Order::with('orderDetail.product')->findOrFail($order_id);

    if (strtolower($request->status_dp) === 'sudah_dibayar') {
        $order->status_dp = 'sudah_dibayar';
        $order->status = 'terkonfirmasi';

        $productCounts = [];

        // Hitung total quantity tiap produk dalam orderDetail
        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;

            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productName = $product->product_name ?? "Produk ID: $productId";

            if (!isset($productCounts[$productId])) {
                $productCounts[$productId] = [
                    'count' => 0,
                    'name' => $productName,
                ];
            }

            $productCounts[$productId]['count'] += $detail->quantity;

            \Log::info("Produk: {$productName}, quantity saat ini: {$productCounts[$productId]['count']}");
        }

        // Validasi stok tersedia
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();

            if (!$stock) {
                \Log::error("Stok tidak ditemukan untuk produk {$data['name']}");
                return redirect()->back()->with('error', "Stok tidak ditemukan untuk produk {$data['name']}");
            }

            if ($stock->stock_available < $data['count']) {
                \Log::warning("Stok tidak cukup untuk produk {$data['name']}. Dibutuhkan: {$data['count']}, Tersedia: {$stock->stock_available}");
                return redirect()->back()->with('error', "Stok tidak cukup untuk produk {$data['name']}. Dibutuhkan: {$data['count']}, Tersedia: {$stock->stock_available}");
            }
        }

        // Kurangi stok sesuai jumlah
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            $stock->stock_available -= $data['count'];
            $stock->save();

            \Log::info("Stok dikurangi untuk produk ID {$productId} ({$data['name']}), dikurangi sebanyak {$data['count']}. Sisa stok: {$stock->stock_available}");
        }

        // Simpan perubahan status order
        $order->save();

        \Log::info("Order ID {$order_id} berhasil diperbarui statusnya menjadi sudah_dibayar dan stok dikurangi.");

        return redirect()->back()->with('success', 'Status pembayaran diperbarui dan stok berhasil dikurangi.');
    }

    \Log::info("Status DP tidak berubah, tidak ada aksi yang dilakukan.");

    return redirect()->back()->with('info', 'Tidak ada perubahan status.');
    }

    public function destroy($order_id)
    {
        $order = Order::where('order_id', $order_id)->firstOrFail();

        // Hapus order detail juga jika ada
        $order->orderDetail()?->delete();

        $order->delete();

        return redirect()->back();
    }

    public function adminupdate(Request $request, $order_id)
{
    \Log::info('adminupdate called', ['order_id' => $order_id, 'status_dp' => $request->status_dp]);

    // Ambil order beserta relasi orderDetail dan product
    $order = Order::with('orderDetail.product')->findOrFail($order_id);

    if (strtolower($request->status_dp) === 'sudah_dibayar') {
        $order->status_dp = 'sudah_dibayar';
        $order->status = 'terkonfirmasi';

        $productCounts = [];

        // Hitung total quantity tiap produk dalam orderDetail
        foreach ($order->orderDetail as $detail) {
            $product = $detail->product;

            if (!$product) {
                \Log::error("Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
                return redirect()->back()->with('error', "Produk tidak ditemukan pada detail order ID: {$detail->order_detail_id}");
            }

            $productId = $product->product_id;
            $productName = $product->product_name ?? "Produk ID: $productId";

            if (!isset($productCounts[$productId])) {
                $productCounts[$productId] = [
                    'count' => 0,
                    'name' => $productName,
                ];
            }

            $productCounts[$productId]['count'] += $detail->quantity;

            \Log::info("Produk: {$productName}, quantity saat ini: {$productCounts[$productId]['count']}");
        }

        // Validasi stok tersedia
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();

            if (!$stock) {
                \Log::error("Stok tidak ditemukan untuk produk {$data['name']}");
                return redirect()->back()->with('error', "Stok tidak ditemukan untuk produk {$data['name']}");
            }

            if ($stock->stock_available < $data['count']) {
                \Log::warning("Stok tidak cukup untuk produk {$data['name']}. Dibutuhkan: {$data['count']}, Tersedia: {$stock->stock_available}");
                return redirect()->back()->with('error', "Stok tidak cukup untuk produk {$data['name']}. Dibutuhkan: {$data['count']}, Tersedia: {$stock->stock_available}");
            }
        }

        // Kurangi stok sesuai jumlah
        foreach ($productCounts as $productId => $data) {
            $stock = Stock::where('product_id', $productId)->first();
            $stock->stock_available -= $data['count'];
            $stock->save();

            \Log::info("Stok dikurangi untuk produk ID {$productId} ({$data['name']}), dikurangi sebanyak {$data['count']}. Sisa stok: {$stock->stock_available}");
        }

        // Simpan perubahan status order
        $order->save();

        \Log::info("Order ID {$order_id} berhasil diperbarui statusnya menjadi sudah_dibayar dan stok dikurangi.");

        return redirect()->back()->with('success', 'Status pembayaran diperbarui dan stok berhasil dikurangi.');
    }

    \Log::info("Status DP tidak berubah, tidak ada aksi yang dilakukan.");

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