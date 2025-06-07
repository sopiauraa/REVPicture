<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users with pagination and search
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role') && !empty($request->role)) {
                $query->where('role', $request->role);
            }

            // Sort by
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users'
            ], 500);
        }
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'required|in:customer,staff,admin'
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role']
            ]);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'password' => 'nullable|string|min:8|confirmed',
                'role' => 'required|in:customer,staff,admin'
            ]);

            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role']
            ];

            // Only update password if provided
            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'User updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user role specifically
     */
    public function updateRole(Request $request, $userId)
    {
        try {
            $validated = $request->validate([
                'role' => 'required|in:customer,staff,admin'
            ]);

            // Cari user berdasarkan primary key yang benar
            $user = User::where('user_id', $userId)->firstOrFail();

            // Prevent user from changing their own role to avoid lockout
            if ($user->user_id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot change your own role'
                ], 403);
            }

            $user->update(['role' => $validated['role']]);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'User role updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating user role: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user role'
            ], 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy($userId)
    {
        try {
            // Cari user berdasarkan primary key yang benar
            $user = User::where('user_id', $userId)->firstOrFail();

            // Prevent user from deleting themselves
            if ($user->user_id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user'
            ], 500);
        }
    }
}