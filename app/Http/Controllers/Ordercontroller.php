<?php

namespace App\Http\Controllers;

use App\Models\order;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ordercontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
                $orders = order::where('status_dp', 'belum_dibayar')->get();
        return Inertia::render('staff/staff_data_booking_masuk', ['order' => $orders]);
    }

    public function indexadmin()
    {
                $orders = order::where('status_dp', 'belum_dibayar')->get();
        return Inertia::render('admin/bookingmasuk', ['order' => $orders]);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, order $order)
    {
        if ($request->status_dp === 'sudah_dibayar') {
            $order->status_dp = 'sudah_dibayar';
            $order->save();
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
