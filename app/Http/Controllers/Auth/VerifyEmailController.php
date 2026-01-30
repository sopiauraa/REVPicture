<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->redirectByRole($user);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->redirectByRole($user);
    }

    protected function redirectByRole($user)
    {
        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false) . '?verified=1');
        } elseif ($user->role === 'customer') {
            return redirect()->intended(route('home.after_login', absolute: false) . '?verified=1');
        } elseif ($user->role === 'staff') {
            return redirect()->intended(route('staff.staff_data_barang', absolute: false) . '?verified=1');
        } else {
            return redirect('/?verified=1');
        }
    }
}
