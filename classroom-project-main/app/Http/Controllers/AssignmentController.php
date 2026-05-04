<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Classroom;
use App\Models\Assignment;
use App\Models\Post;
use App\Models\AssignmentAttachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewPostMail;

class AssignmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CREATE FORM
    |--------------------------------------------------------------------------
    */
    public function create($id)
    {
        $classroom = Classroom::with('subjects')->findOrFail($id);

        if ($classroom->teacher_id !== auth()->id()) {
            abort(403);
        }

        return view('assignments.create', compact('classroom'));
    }

    /*
    |--------------------------------------------------------------------------
    | STORE ASSIGNMENT
    |--------------------------------------------------------------------------
    */
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

        $classroom = Classroom::findOrFail($request->classroom_id);

        if ($classroom->teacher_id !== auth()->id()) {
            abort(403);
        }

        // ================= CREATE ASSIGNMENT =================
        $assignment = Assignment::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'due_date'     => $request->due_date,
            'classroom_id' => $classroom->id,
            'subject_id'   => $request->subject_id,
            'user_id'      => auth()->id(),
        ]);

        // ================= ATTACHMENTS =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('assignments', 'public');

                AssignmentAttachment::create([
                    'assignment_id' => $assignment->id,
                    'file_path'     => $path
                ]);
            }
        }

        // ================= STREAM POST =================
        $post = Post::create([
            'description'   => $assignment->title,
            'classroom_id'  => $classroom->id,
            'user_id'       => auth()->id(),
            'type'          => 'assignment',
            'assignment_id' => $assignment->id
        ]);

        // ================= EMAIL STUDENTS =================
        $classroom = Classroom::with('students')->findOrFail($classroom->id);

        foreach ($classroom->students as $student) {

            if ($student->id !== auth()->id()) {

                Mail::to($student->email)->queue(
                    new NewPostMail($post, $classroom)
                );
            }
        }

        return redirect()
            ->route('classrooms.classwork', $classroom->id)
            ->with('success', 'Assignment created successfully!');
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        $assignment = Assignment::with([
            'submissions.user',
            'attachments',
            'classroom',
            'subject'
        ])->findOrFail($id);

        return view('assignments.show', [
            'assignment' => $assignment,
            'classroom'  => $assignment->classroom
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */
    public function edit($id)
    {
        $assignment = Assignment::with([
            'classroom.subjects',
            'attachments'
        ])->findOrFail($id);

        if ($assignment->classroom->teacher_id !== auth()->id()) {
            abort(403);
        }

        return view('assignments.edit', compact('assignment'));
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $assignment = Assignment::with('attachments', 'classroom')->findOrFail($id);

        if ($assignment->classroom->teacher_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'due_date'     => 'nullable|date',
            'subject_id'   => 'nullable|exists:subjects,id',
            'files.*'      => 'nullable|file|max:10240',
        ]);

        // ================= UPDATE =================
        $assignment->update([
            'title'       => $request->title,
            'description' => $request->description,
            'due_date'    => $request->due_date,
            'subject_id'  => $request->subject_id,
        ]);

        // ================= NEW FILES =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('assignments', 'public');

                AssignmentAttachment::create([
                    'assignment_id' => $assignment->id,
                    'file_path'     => $path
                ]);
            }
        }

        return redirect()
            ->route('assignments.show', $assignment->id)
            ->with('success', 'Assignment updated successfully!');
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        $assignment = Assignment::with(['attachments', 'submissions', 'classroom'])->findOrFail($id);

        if ($assignment->classroom->teacher_id !== auth()->id()) {
            abort(403);
        }

        // delete attachments
        foreach ($assignment->attachments as $file) {
            Storage::disk('public')->delete($file->file_path);
        }
        $assignment->attachments()->delete();

        // delete submissions
        foreach ($assignment->submissions as $submission) {
            if ($submission->file) {
                Storage::disk('public')->delete($submission->file);
            }
        }
        $assignment->submissions()->delete();

        // delete posts
        Post::where('assignment_id', $assignment->id)->delete();

        $classroomId = $assignment->classroom_id;

        $assignment->delete();

        return redirect()
            ->route('classrooms.classwork', $classroomId)
            ->with('success', 'Assignment deleted successfully');
    }
}