<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sewa extends Model
{
    protected $table = 'order_details';
    protected $primaryKey = 'order_detail_id'; // <--- WAJIB
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = ['order_id', 'product_id', 'day_rent', 'due_on', 'status'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
