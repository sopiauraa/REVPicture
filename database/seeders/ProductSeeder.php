<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run()
    {
        DB::table('products')->insert([
            [
                'product_type' => 'camera',
                'product_name' => 'Canon EOS R5',
                'product_description' => 'High-resolution full-frame mirrorless camera with 8K video capability.',
                'product_image' => 'products/camera/CanonEOSR5.png',
                'brand' => 'Canon',
                'eight_hour_rent_price' => 300000,
                'twenty_four_hour_rent_price' => 500000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'camera',
                'product_name' => 'Sony Alpha a7 III',
                'product_description' => 'Versatile full-frame mirrorless camera with excellent low-light performance.',
                'product_image' => 'products/camera/SonyAlphaA7III.png',
                'brand' => 'Sony',
                'eight_hour_rent_price' => 250000,
                'twenty_four_hour_rent_price' => 400000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'camera',
                'product_name' => 'Nikon Z6 II',
                'product_description' => 'Hybrid mirrorless camera with dual processors and improved autofocus.',
                'product_image' => 'products/camera/NikonZ6II.png',
                'brand' => 'Nikon',
                'eight_hour_rent_price' => 240000,
                'twenty_four_hour_rent_price' => 380000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'camera',
                'product_name' => 'Fujifilm X-T4',
                'product_description' => 'APS-C mirrorless camera with in-body stabilization and great color science.',
                'product_image' => 'products/camera/FujifilmX-T4.png',
                'brand' => 'Fujifilm',
                'eight_hour_rent_price' => 200000,
                'twenty_four_hour_rent_price' => 320000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'camera',
                'product_name' => 'Panasonic Lumix GH6',
                'product_description' => 'Micro Four Thirds camera designed for advanced video production.',
                'product_image' => 'products/camera/PanasonicLumixGH6.png',
                'brand' => 'Canon',
                'eight_hour_rent_price' => 220000,
                'twenty_four_hour_rent_price' => 360000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'lens',
                'product_name' => 'Canon RF 24-70mm f/2.8L IS USM',
                'product_description' => 'Professional zoom lens for Canon RF mount with image stabilization.',
                'product_image' => 'products/lens/CanonRF24-70mmf2.8LISUSM.png',
                'brand' => 'Canon',
                'eight_hour_rent_price' => 150000,
                'twenty_four_hour_rent_price' => 220000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'lens',
                'product_name' => 'Sony FE 70-200mm f/2.8 GM OSS',
                'product_description' => 'High-performance telephoto zoom lens for Sony E-mount.',
                'product_image' => 'products/lens/Sony-70-200mm.png',
                'brand' => 'Sony',
                'eight_hour_rent_price' => 160000,
                'twenty_four_hour_rent_price' => 250000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'lens',
                'product_name' => 'Nikon Z 85mm f/1.8 S',
                'product_description' => 'Prime portrait lens for Nikon Z mount with superb sharpness.',
                'product_image' => 'products/lens/NIKKOR-Z-85mm-f1.8-S.png',
                'brand' => 'Nikon',
                'eight_hour_rent_price' => 100000,
                'twenty_four_hour_rent_price' => 160000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'lens',
                'product_name' => 'Fujinon XF 16-55mm f/2.8 R LM WR',
                'product_description' => 'Fast standard zoom lens for Fujifilm X-mount.',
                'product_image' => 'products/lens/FujinonXF16-55mm.png',
                'brand' => 'Fujifilm',
                'eight_hour_rent_price' => 120000,
                'twenty_four_hour_rent_price' => 180000,
                'last_updated' => now(),
            ],
            [
                'product_type' => 'lens',
                'product_name' => 'Panasonic Leica DG 12-60mm f/2.8-4',
                'product_description' => 'Versatile zoom lens with Leica optics for Micro Four Thirds cameras.',
                'product_image' => 'products/lens/PanasonicLeicaDG12-60mm.png',
                'brand' => 'Nikon',
                'eight_hour_rent_price' => 110000,
                'twenty_four_hour_rent_price' => 170000,
                'last_updated' => now(),
            ],
        ]);
    }
}