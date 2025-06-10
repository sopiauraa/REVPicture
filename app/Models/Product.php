<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    public $timestamps = false;
    
    protected $primaryKey = 'product_id';

    protected $fillable = [
        'product_type',
        'product_name',
        'product_description',
        'product_image',
        'brand',
        'eight_hour_rent_price',
        'twenty_four_hour_rent_price',

    ];

    public function stock()
    {
        return $this->hasOne(Stock::class, 'product_id');
    }
}

