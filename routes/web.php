<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ProductController::class, 'showLanding'])->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//Register
Route::post('/register', [RegisteredUserController::class, 'store']);

//Login
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::get('/login', [AuthenticatedSessionController::class, 'index']);

// landing
Route::get('/landing', function () { return Inertia::render('landing');});

Route::get('/data_barang', function () { return Inertia::render('StaffDataBarang');});
//Display Product (Landing)
Route::get('/shop', [ProductController::class, 'index']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
