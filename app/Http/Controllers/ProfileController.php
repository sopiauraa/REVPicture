<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the profile page
     */
    public function index()
    {
        return Inertia::render('Admin/Profile', [
            'user' => Auth::user()
        ]);
    }

    /**
     * Update user profile data
     */
    public function updateProfile(Request $request)
    {
        try {
            // Debug log
            \Log::info('Profile update request:', $request->all());
            \Log::info('Auth user:', ['user' => Auth::user()]);

            // Cek apakah user sudah login
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak terautentikasi'
                ], 401);
            }

            $user_id = Auth::id();
            
            // Validasi input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:2|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user_id . ',user_id',
            ], [
                'name.required' => 'Nama tidak boleh kosong',
                'name.min' => 'Nama minimal 2 karakter',
                'name.max' => 'Nama maksimal 255 karakter',
                'email.required' => 'Email tidak boleh kosong',
                'email.email' => 'Format email tidak valid',
                'email.unique' => 'Email sudah digunakan oleh user lain',
                'email.max' => 'Email maksimal 255 karakter',
            ]);


            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Ambil user yang sedang login
            $user = User::find($user_id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User tidak ditemukan'
                ], 404);
            }

            // Update data profil
            $user->update([
                'name' => trim($request->name),
                'email' => trim($request->email),
            ]);

            // Refresh user data
            $user->refresh();

            // Return response sukses dengan data user terbaru
            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui!',
                'data' => [
                    'user' => [
                        'id' => $user->user_id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'updated_at' => $user->updated_at->toISOString()
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Profile update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui profil',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}