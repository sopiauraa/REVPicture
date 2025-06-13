<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
    // Get camera products with their stock information
    $cameraProducts = Product::where('product_type', 'camera')
        ->with('stock') // Eager load the stock relationship
        ->get()
        ->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_description' => $item->price,
                'product_image' => $item->product_image,
                'brand' => $item->brand,
                'eight_hour_rent_price' => $item->eight_hour_rent_price,
                'twenty_four_hour_rent_price' => $item->twenty_four_hour_rent_price,
                'stock_available' => $item->stock ? $item->stock->stock_available : 0,
            ];
        });

    // Get lens products with their stock information
    $lensProducts = Product::where('product_type', 'lens')
        ->with('stock') // Eager load the stock relationship
        ->get()
        ->map(function ($item) {
            return [
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'product_description' => $item->price,
                'product_image' => $item->product_image,
                'brand' => $item->brand,
                'eight_hour_rent_price' => $item->eight_hour_rent_price,
                'twenty_four_hour_rent_price' => $item->twenty_four_hour_rent_price,
                'stock_available' => $item->stock ? $item->stock->stock_available : 0,
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
    // Update validation rules sesuai dengan field yang dikirim frontend
            $validated = $request->validate([
                'product_name' => 'required|string|max:255',
                'product_type' => 'required|in:Camera,Lens',
                'brand' => 'required|string|max:255',
                'stock_available' => 'required|integer|min:0',
                'eight_hour_rent_price' => 'required|numeric|min:0',
                'twenty_four_hour_rent_price' => 'required|numeric|min:0',
                'product_description' => 'nullable|string|max:1000',
                'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', 
            ]);

    $imagePath = null;
    if ($request->hasFile('product_image')) {
        $file = $request->file('product_image');
        $jenis = strtolower($validated['product_type']); // camera atau lens
        
        $filename = time() . '_' . $file->getClientOriginalName();

        // Path tujuan di folder public/products/{jenis}
        $path = public_path("products/{$jenis}");

        // Pastikan folder ada, kalau belum buat foldernya
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        // Pindahkan file ke folder tersebut
        $file->move($path, $filename);

        // Simpan path relatifnya ke DB
        $imagePath = "products/{$jenis}/{$filename}";
    }
    $product = Product::create([
        'product_name' => $validated['product_name'],                   
        'product_type' => $validated['product_type'], 
        'brand' => $validated['brand'],
        'product_description' => $validated['product_description'] ?? '-',
        'product_image' => $imagePath,
        'eight_hour_rent_price' => $validated['eight_hour_rent_price'], 
        'twenty_four_hour_rent_price' => $validated['twenty_four_hour_rent_price'],
    ]);

    // Update field mapping untuk Stock
    Stock::create([
        'product_id' => $product->product_id,
        'stock_available' => $validated['stock_available'],              // ✅ Fixed
        'stock_on_rent' => 0,
    ]);

    return response()->json([
        'message' => 'Produk berhasil disimpan',
        'product' => $product,
    ], 201); // Tambahkan status code 201 untuk created
}



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Cari berdasarkan product_id bukan id
        $product = Product::where('product_id', $id)->firstOrFail();
        
        return Inertia::render('productdetail', [
            'product' => $product
        ]);
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
    public function update(Request $request, $product_id)
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
            'eight_hour_rent_price' => 'required|integer|min:1', 
            'twenty_four_hour_rent_price' => 'required|integer|min:1',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            $product = Product::findOrFail($product_id);
            
            // Update harga rental
            $product->update([
                'eight_hour_rent_price' => $validated['eight_hour_rent_price'],
                'twenty_four_hour_rent_price' => $validated['twenty_four_hour_rent_price']
            ]);

            // Update stock - FIX relasi
            $existingStock = DB::table('stocks')->where('product_id', $product->product_id)->first();
            
            if ($existingStock) {
                DB::table('stocks')
                    ->where('product_id', $product->product_id)
                    ->update(['stock_available' => $validated['stock']]);
            } else {
                DB::table('stocks')->insert([
                    'product_id' => $product->product_id,
                    'stock_available' => $validated['stock'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            // Handle upload gambar
            if ($request->hasFile('product_image')) {
                $image = $request->file('product_image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                
                // Pastikan folder ada
                $uploadPath = public_path('storage/products');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                // Upload file baru
                $image->move($uploadPath, $imageName);
                
                // Hapus gambar lama
                if ($product->product_image && file_exists(public_path('storage/products/' . $product->product_image))) {
                    unlink(public_path('storage/products/' . $product->product_image));
                }
                
                // Update database
                $product->update(['product_image' => $imageName]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product berhasil diupdate',
                'product' => $product->load('stock')
            ]);

        } catch (\Exception $e) {
            Log::error('Product update error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal update product: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($product_id)
    {
        try {
            $product = Product::findOrFail($product_id);
            
            // Delete image file if exists
            if ($product->product_image) {
                $imagePath = public_path($product->product_image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            
            // Delete related stock first if exists
            if ($product->stock) {
                $product->stock->delete();
            }
            
            // Delete product
            $product->delete();
            
            return response()->json([
                'message' => 'Product deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Product delete error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
