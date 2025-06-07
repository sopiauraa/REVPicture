<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'customer_id'; 
    protected $fillable = ['user_id', 'customer_name', 'phone_number', 'address', 'social_media'];
    
}
