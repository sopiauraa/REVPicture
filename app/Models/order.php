<?php

namespace App\Models;

use App\Models\sewa;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'order_id'; // kalau bukan "id"
    protected $fillable = ['customer_id', 'order_date', 'status_dp'];

    public function rentals()
    {
        return $this->hasMany(sewa::class);
    }
}

