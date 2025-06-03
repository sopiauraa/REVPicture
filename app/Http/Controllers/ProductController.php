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
            'product_name' => 'required|string|max:255',
            'product_type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'product_description' => 'required|string',
            'stock_available' => 'required|numeric',
            'eight_hour_rent_price' => 'required|numeric',
            'twenty_four_hour_rent_price' => 'required|numeric',
            'product_image' => 'nullable|image|max:2048',
        ]);

        // Simpan gambar ke public/products/{product_type}
        $imagePath = null;
        if ($request->hasFile('product_image')) {
            $folder = strtolower($validated['product_type']); // ex: "camera"
            $file = $request->file('product_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path("products/$folder"), $filename);
            $imagePath = "products/$folder/$filename";
        }

        $product = Product::create([
            ...$validated,
            'product_image' => $imagePath,
        ]);

        // Simpan stok dengan stock_on_rent = 0
        Stock::create([
            'product_id' => $product->product_id,
            'stock_available' => $request->stock_available,
            'stock_on_rent' => 0,
        ]);


        return redirect()->route('staff.staff_data_barang')->with('success', 'Produk berhasil disimpan');
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
