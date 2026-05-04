<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function store(Request $request)
{
    $data = $request->validate([
        'description' => 'required',
        'post_id' => 'required|exists:posts,id'
    ]);
        
    $data['user_id'] = auth()->id();

    Comment::create($data);

    return back();
}

public function edit($id)
{
    $comment = Comment::with('post.classroom')->findOrFail($id);

    $isOwner = $comment->user_id === auth()->id();
    $isTeacher = $comment->post->classroom->teacher_id === auth()->id();

    if (!$isOwner && !$isTeacher) {
        abort(403);
    }

    return view('comments.edit', compact('comment'));
}


public function update(Request $request, $id)
{
    $comment = Comment::with('post.classroom')->findOrFail($id);

    $isOwner = $comment->user_id === auth()->id();
    $isTeacher = $comment->post->classroom->teacher_id === auth()->id();

    if (!$isOwner && !$isTeacher) {
        abort(403);
    }

    $request->validate([
        'description' => 'required|string',
    ]);

    $comment->update([
        'description' => $request->description,
    ]);

    return redirect()->back()->with('success', 'Comment updated successfully');
}

public function destroy($id)
{
    $comment = Comment::with('post.classroom')->findOrFail($id);

    $isOwner = $comment->user_id === auth()->id();
    $isTeacher = $comment->post->classroom->teacher_id === auth()->id();

    // ❌ not allowed
    if (!$isOwner && !$isTeacher) {
        abort(403);
    }

    $comment->delete();

    return back()->with('success', 'Comment deleted successfully');
}


}
