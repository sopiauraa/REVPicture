<?php
use Illuminate\Support\Facades\Route;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Stock;
use App\Http\Controllers\Ordercontroller;
use App\Http\Controllers\SewaController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Inertia\Inertia;
    

Route::get('/', [ProductController::class, 'showLanding'])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });


Route::get('/login', [AuthenticatedSessionController::class, 'index']);


// admin
Route::get('/admin/dashboard', function () { return Inertia::render('admin/dashboard'); });
//Route::get('/admin/databarang', function () { return Inertia::render('admin/databarang'); });
Route::get('/admin/BookingMasuk', function () { return Inertia::render('admin/BookingMasuk'); });

Route::prefix('admin')->group(function () {
    Route::post('/products/store', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/databarang', [ProductController::class, 'admin'])->name('admin.databarang');
});

Route::get('/landing', function () {
    return Inertia::render('landing'); });

Route::prefix('staff')->group(function () {
    Route::post('/products/store', [ProductController::class, 'store'])->name('staff.products.store');
    Route::get('/data_barang', [ProductController::class, 'index'])->name('staff.staff_data_barang');
});
Route::get('/staff/data_customer', function () {
    $customers = Customer::select('customer_id', 'customer_name', 'phone_number', 'address', 'social_media')->get();
    return Inertia::render('staff/staff_data_customer', [
        'customers' => $customers,
    ]);
});
Route::get('/staff/data_booking', [OrderController::class, 'index']);
Route::patch('/staff/data_booking/{order}', [OrderController::class, 'update']);

Route::get('staff/data_sewa', [SewaController::class, 'index']);
Route::patch('/staff/data_sewa/{rental}', [SewaController::class, 'update']);


Route::get('/data_barang', function () { return Inertia::render('StaffDataBarang');});
//Display Product (Landing)
Route::get('/shop', [ProductController::class, 'index']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';