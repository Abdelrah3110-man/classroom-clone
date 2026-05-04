<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostApiController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'content' => 'required|string',
        ]);

        $validated['user_id'] = Auth::id() ?? 1;

        $post = Post::create($validated);
        $post->load('user');

        return response()->json($post, 21);
    }

    public function destroy($id)
    {
        $post = Post::find($id);
        if ($post) {
            $post->delete();
            return response()->json(['message' => 'Deleted']);
        }
        return response()->json(['error' => 'Not found'], 404);
    }
}
