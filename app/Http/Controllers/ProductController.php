<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('stock');

        if ($request->filled('search_name')) {
            $query->where('product_name', 'like', '%' . $request->search_name . '%');
        }

        if ($request->filled('search_type')) {
            $query->where('product_type', 'like', '%' . $request->search_type . '%');
        }

        if ($request->filled('search_brand')) {
            $query->where('brand', 'like', '%' . $request->search_brand . '%');
        }

        $products = $query->get();

        return Inertia::render('Staff/staff_data_barang', [
            'products' => $products,
            'filters' => $request->only(['search_name', 'search_type', 'search_brand']),
        ]);
    }

    public function showLanding()
    {

        $cameraProducts = Product::where('product_type', 'camera')->get()->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_description' => $item->price,
                'product_image' => $item->product_image,
                'brand' => $item->brand,
                'eight_hour_rent_price' => $item->eight_hour_rent_price,
                'twenty_four_hour_rent_price' => $item->twenty_four_hour_rent_price,
            ];
        });

        $lensProducts = Product::where('product_type', 'lens')->get()->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_description' => $item->price,
                'product_image' => $item->product_image,
                'brand' => $item->brand,
                'eight_hour_rent_price' => $item->eight_hour_rent_price,
                'twenty_four_hour_rent_price' => $item->twenty_four_hour_rent_price,
            ];
        });

        return Inertia::render('Landing', [
            'cameraProducts' => $cameraProducts,
            'lensProducts' => $lensProducts,
        ]);


    }

    /**
     * Show the form for creating a new resource.
     */
        public function admin(Request $request)
        {
            $query = Product::with('stock');

            if ($request->filled('search_name')) {
                $query->where('product_name', 'like', '%' . $request->search_name . '%');
            }

            if ($request->filled('search_type')) {
                $query->where('product_type', 'like', '%' . $request->search_type . '%');
            }

            if ($request->filled('search_brand')) {
                $query->where('brand', 'like', '%' . $request->search_brand . '%');
            }

            $products = $query->get();

            return Inertia::render('admin/databarang', [
                'products' => $products,
                'filters' => $request->only(['search_name', 'search_type', 'search_brand']),
            ]);
        }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'namaBarang' => 'required|string|max:255',
            'jenis' => 'required|in:camera,lens',
            'brand' => 'required|string|max:255', // kalau mau brand baru
            'stock' => 'required|integer|min:0',
            'harga8jam' => 'required|numeric',
            'harga24jam' => 'required|numeric',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

       $imagePath = null;
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            $jenis = $request->jenis_produk; // misal 'camera' atau 'lens'
            
            $filename = time() . '_' . $file->getClientOriginalName();

            // Path tujuan di folder public/products/{jenis_produk}
            $path = public_path("products/{$jenis}");

            // Pastikan folder ada, kalau belum buat foldernya
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Pindahkan file ke folder tersebut
            $file->move($path, $filename);

            // Simpan path relatifnya ke DB, contoh:
            $imagePath = "products/{$jenis}/{$filename}";
        }


        $product = Product::create([
            'product_name' => $validated['namaBarang'],
            'product_type' => $validated['jenis'],
            'brand' => $validated['brand'],
            'product_description' => '-', // bisa dikembangkan nanti
            'product_image' => $imagePath, // simpan path gambar
            'eight_hour_rent_price' => $validated['harga8jam'],
            'twenty_four_hour_rent_price' => $validated['harga24jam'],
        ]);

        Stock::create([
            'product_id' => $product->product_id,
            'stock_available' => $validated['stock'],
            'stock_on_rent' => 0,
        ]);

        return response()->json([
            'message' => 'Produk berhasil disimpan',
            'product' => $product,
        ]);
    }



    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
