<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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

// admin
Route::get('/admin/Dashboard', function () { return Inertia::render('admin/Dashboard'); });
Route::get('/admin/DataBarang', function () { return Inertia::render('admin/DataBarang'); });
Route::get('/admin/BookingMasuk', function () { return Inertia::render('/admin/BookingMasuk'); });



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
