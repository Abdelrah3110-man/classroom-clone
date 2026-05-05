<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentAttachment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentApiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'due_date'     => 'nullable|date',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'nullable|exists:subjects,id',
            'files.*'      => 'nullable|file|max:10240',
        ]);

        $classroom = \App\Models\Classroom::findOrFail($request->classroom_id);
        $userId = Auth::id() ?? $classroom->teacher_id;

        $assignment = Assignment::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'due_date'     => $request->due_date,
            'classroom_id' => $request->classroom_id,
            'subject_id'   => $request->subject_id,
            'user_id'      => $userId,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assignments', 'public');
                AssignmentAttachment::create([
                    'assignment_id' => $assignment->id,
                    'file_path'     => $path
                ]);
            }
        }

        // Stream Post
        Post::create([
            'description'   => $assignment->title,
            'classroom_id'  => $request->classroom_id,
            'user_id'       => $userId,
            'type'          => 'assignment',
            'assignment_id' => $assignment->id
        ]);

        return response()->json($assignment->load('attachments'), 201);
    }

    public function show($id)
    {
        $assignment = Assignment::with(['attachments', 'submissions.user', 'classroom', 'subject'])->findOrFail($id);
        return response()->json($assignment);
    }

    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'nullable|date',
            'subject_id'  => 'nullable|exists:subjects,id',
        ]);

        $assignment->update($request->only(['title', 'description', 'due_date', 'subject_id']));

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assignments', 'public');
                AssignmentAttachment::create([
                    'assignment_id' => $assignment->id,
                    'file_path'     => $path
                ]);
            }
        }

        return response()->json($assignment->load('attachments'));
    }

    public function destroy($id)
    {
        $assignment = Assignment::with(['attachments', 'submissions'])->findOrFail($id);
        
        foreach ($assignment->attachments as $file) {
            Storage::disk('public')->delete($file->file_path);
        }
        $assignment->attachments()->delete();

        foreach ($assignment->submissions as $sub) {
            if ($sub->file) Storage::disk('public')->delete($sub->file);
        }
        $assignment->submissions()->delete();

        Post::where('assignment_id', $assignment->id)->delete();
        $assignment->delete();

        return response()->json(['message' => 'Assignment deleted']);
    }
}
