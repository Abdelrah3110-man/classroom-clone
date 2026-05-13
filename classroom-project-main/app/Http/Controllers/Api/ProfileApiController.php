<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileApiController extends Controller
{
    public function update(Request $request)
    {
        try {
            $userId = $request->input('user_id') ?? Auth::id();
            $user = Auth::user() ?? \App\Models\User::find($userId);
            
            if (!$user) {
                \Log::info("Profile update failed: User not found.", [
                    'auth_id' => Auth::id(),
                    'request_user_id' => $request->user_id,
                    'all_input' => $request->all()
                ]);
                return response()->json(['message' => 'User not found or unauthenticated'], 401);
            }

            $request->validate([
                'name'  => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            ]);

            $user->update($request->only('name', 'email'));
            
            \Log::info("Profile updated successfully for user ID: " . $user->id);

            return response()->json([
                'user' => $user,
                'message' => 'Profile updated'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error("Critical error in profile update: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Internal Server Error: ' . $e->getMessage()], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password incorrect'], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json(['message' => 'Password updated']);
    }

    public function destroy(Request $request)
    {
        try {
            $userId = $request->input('user_id') ?? Auth::id();
            $user = \App\Models\User::find($userId);

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            $user->delete();

            return response()->json(['message' => 'Account deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete account: ' . $e->getMessage()], 500);
        }
    }
}
