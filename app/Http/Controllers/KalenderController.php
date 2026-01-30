<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KalenderController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Kalender');
    }

    public function staffIndex()
    {
        // untuk staff
        return Inertia::render('staff/Kalender');
    }
}
