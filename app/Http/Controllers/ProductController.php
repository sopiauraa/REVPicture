<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        //
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
