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
        try {
            $validated = $request->validate([
                'classroom_id' => 'required|exists:classrooms,id',
                'content' => 'required|string',
            ]);

            // Map 'content' from frontend to 'description' in DB
            $postData = [
                'classroom_id' => $validated['classroom_id'],
                'description' => $validated['content'],
                'user_id' => Auth::id() ?? 1,
                'type' => 'announcement' // default type
            ];

            $post = Post::create($postData);
            $post->load('user');

            return response()->json($post, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
