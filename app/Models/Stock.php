<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    public $timestamps = false;

    protected $primaryKey = 'stock_id';
    
    protected $fillable = ['product_id', 'stock_available'];

    public function product()
{
    return $this->belongsTo(Product::class, 'product_id');
}

}
