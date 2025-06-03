<?php

namespace App\Http\Controllers;

use App\Models\Sewa;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SewaController extends Controller
{
    public function index()
    {
       $sewa = Sewa::with('order')->whereHas('order', function ($q) {
            $q->where('status', 'disewakan');
        })->get();

        // Map data biar cocok sama props React
        $mapped = $sewa->map(function ($s) {
            return [
                'rental_id' => $s->order_detail_id,
                'customer_name' => $s->order->customer_name ?? '-',
                'item_name' => $s->product->name ?? '-', // kalau ada relasi product
                'pickup_date' => $s->order->pickup_date ?? '-',
                'return_date' => $s->order->return_date ?? '-',
                'duration' => $s->day_rent . ' hari',
                'contact_wa' => $s->order->wa ?? '-',
                'status_return' => $s->order->status === 'pending' ? 'terkonfirmasi' : 'selesai',
            ];
        });

        return Inertia::render('staff/staff_data_sewa', ['rentals' => $sewa]);
    }
    public function indexadmin()
    {
        $sewa = Sewa::with('order')->whereHas('order', function ($q) {
            $q->where('status', 'disewakan');
        })->get();

        // Map data biar cocok sama props React
        $mapped = $sewa->map(function ($s) {
            return [
                'rental_id' => $s->order_detail_id,
                'customer_name' => $s->order->customer_name ?? '-',
                'item_name' => $s->product->name ?? '-', // kalau ada relasi product
                'pickup_date' => $s->order->pickup_date ?? '-',
                'return_date' => $s->order->return_date ?? '-',
                'duration' => $s->day_rent . ' hari',
                'contact_wa' => $s->order->wa ?? '-',
                'status_return' => $s->order->status === 'pending' ? 'terkonfirmasi' : 'selesai',
            ];
        });

        return Inertia::render('admin/datapenyewaan', ['rentals' => $mapped]);
    }


    public function update(Request $request, Sewa $rental)
    {
        if ($request->status === 'dikembalikan') {
            $rental->status = 'dikembalikan';
            $rental->save();
        }

        return redirect()->back();
    }

}
