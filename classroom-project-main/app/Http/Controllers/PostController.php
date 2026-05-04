<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Classroom;
use App\Models\PostAttachment;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewPostMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // ================= STORE =================
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $post = Post::create([
            'description' => $request->description,
            'classroom_id' => $request->classroom_id,
            'user_id' => auth()->id(),
            'type' => 'post'
        ]);

        // ================= MULTIPLE FILES =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('posts', 'public');

                PostAttachment::create([
                    'post_id' => $post->id,
                    'file_path' => $path
                ]);
            }
        }

        // ================= EMAIL NOTIFICATIONS =================
        $classroom = Classroom::with('students')
            ->findOrFail($request->classroom_id);

        $recipients = $classroom->students
            ->where('id', '!=', auth()->id());

        foreach ($recipients as $student) {
            Mail::to($student->email)->queue(
                new NewPostMail($post, $classroom)
            );
        }

        return back()->with('success', 'Post created successfully!');
    }

    // ================= DELETE =================
    public function destroy($id)
    {
        $post = Post::with(['classroom', 'attachments'])->findOrFail($id);

        $isOwner = $post->user_id === auth()->id();
        $isTeacher = $post->classroom->teacher_id === auth()->id();

        if (!$isOwner && !$isTeacher) {
            abort(403);
        }

        // delete attachments files
        foreach ($post->attachments as $file) {
            Storage::disk('public')->delete($file->file_path);
        }

        // delete attachments DB
        $post->attachments()->delete();

        // delete comments
        $post->comments()->delete();

        // delete post
        $post->delete();

        return back()->with('success', 'Post deleted successfully');
    }

    // ================= EDIT =================
    public function edit($id)
    {
        $post = Post::with(['classroom', 'attachments'])->findOrFail($id);

        $isOwner = $post->user_id === auth()->id();
        $isTeacher = $post->classroom->teacher_id === auth()->id();

        if (!$isOwner && !$isTeacher) {
            abort(403);
        }

        return view('posts.edit', compact('post'));
    }

    // ================= UPDATE =================
    public function update(Request $request, $id)
    {
        $post = Post::with(['classroom', 'attachments'])->findOrFail($id);

        $isOwner = $post->user_id === auth()->id();
        $isTeacher = $post->classroom->teacher_id === auth()->id();

        if (!$isOwner && !$isTeacher) {
            abort(403);
        }

        $request->validate([
            'description' => 'required|string',
            'files.*' => 'nullable|file|max:10240',
        ]);

        // update description
        $post->description = $request->description;
        $post->save();

        // ================= ADD NEW FILES =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('posts', 'public');

                PostAttachment::create([
                    'post_id' => $post->id,
                    'file_path' => $path
                ]);
            }
        }

        return redirect()
            ->route('classrooms.show', $post->classroom_id)
            ->with('success', 'Post updated successfully');
    }
}