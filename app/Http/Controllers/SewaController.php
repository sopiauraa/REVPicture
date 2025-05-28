<?php

namespace App\Http\Controllers;

use App\Models\Sewa;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SewaController extends Controller
{
    public function index()
    {
        $sewa = Sewa::where('status', 'disewakan')->get();
        return Inertia::render('staff/staff_data_sewa', ['rentals' => $sewa]);

    }

    public function indexadmin()
    {
        $sewa = Sewa::where('status', 'disewakan')->get();
        return Inertia::render('admin/datapenyewaan', ['rentals' => $sewa]);

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
