<?php

namespace App\Models;

use App\Models\sewa;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'order_id'; // kalau bukan "id"
    protected $fillable = ['customer_id', 'order_date', 'status_dp', 'status', 'total_price'];
    public function rentals()
    {
        return $this->hasMany(sewa::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
    public function orderDetail()
    {
        return $this->hasOne(OrderDetail::class, 'order_id');
    }


}

