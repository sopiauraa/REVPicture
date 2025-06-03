<?php
use Illuminate\Support\Facades\Route;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use App\Http\Controllers\Ordercontroller;
use App\Http\Controllers\SewaController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\KalenderController;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;



Route::get('/', [ProductController::class, 'showLanding'])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

Route::get('/login', [AuthenticatedSessionController::class, 'index']);
Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
Route::get('/brand', function() {return Inertia::render('brand');});
Route::get('/kamera', function() {return Inertia::render('kamera');});
Route::get('/lensa', function() {return Inertia::render('lensa');});
Route::get('/paket', function() {return Inertia::render('paket');});
Route::get('/syarat', function() {return Inertia::render('syarat');});


// admin
Route::get('/admin/dashboard', function () {
    return Inertia::render('admin/dashboard');
})->name('admin.dashboard');
Route::get('/dashboard-stats', [DashboardController::class, 'stats']);




//Route::get('/admin/databarang', function () { return Inertia::render('admin/databarang'); });
// Route::get('/admin/BookingMasuk', function () {
//     return Inertia::render('admin/BookingMasuk'); });

Route::prefix('admin')->group(function () {
    Route::post('/products/store', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/databarang', [ProductController::class, 'admin'])->name('admin.databarang');
});

Route::get('/admin/datacustomer', function () {
    $customers = Customer::select('customer_id', 'customer_name', 'phone_number', 'address', 'social_media')->get();
    return Inertia::render('admin/datacustomer', [
        'customers' => $customers,
    ]);
});

Route::get('/admin/bookingmasuk', [OrderController::class, 'indexadmin']);
Route::patch('/admin/bookingmasuk/{order}', [OrderController::class, 'update']);
Route::get('/admin/datapenyewaan', [SewaController::class, 'indexadmin']);
Route::patch('/admin/datapenyewaan/{rental}', [SewaController::class, 'update']);

Route::get('/admin/history', [OrderController::class, 'historyadmin']);
Route::get('/admin/datastaff', function () {
    $staffUsers = User::where('role', 'staff')->select('user_id', 'name', 'email')->get();
    return Inertia::render('admin/datastaff', [
        'users' => $staffUsers,
    ]);
});
Route::get('/admin/kalender', [KalenderController::class, 'index'])->name('kalender.index');
// landing
Route::get('/landing', function () { return Inertia::render('landing'); })->name('landing');



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
Route::get('/staff/kalender', [KalenderController::class, 'staffIndex'])->name('kalender.staffIndex');
Route::get('staff/data_sewa', [SewaController::class, 'index']);
Route::patch('/staff/data_sewa/{rental}', [SewaController::class, 'update']);
Route::get('/data_barang', function () { return Inertia::render('StaffDataBarang');});
//Display Product (Landing)
Route::get('/shop', [ProductController::class, 'index']);

Route::get('/staff/history', [OrderController::class, 'history']);
// user
Route::get('detailproduk', function () { return Inertia::render('detailproduk');});
Route::get('/keranjang', function () { return Inertia::render('keranjang');});
Route::get('/formdatadiri', function () { return Inertia::render('formdatadiri');});
Route::get('/formdatadiri', function () {
    return Inertia::render('FormDataDiri', [
        'selectedItems' => request()->input('selectedItems', []),
        'totalHarga' => request()->input('totalHarga', 0),
    ]);
});

Route::get('detailproduk', function () {
    return Inertia::render('detailproduk');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';