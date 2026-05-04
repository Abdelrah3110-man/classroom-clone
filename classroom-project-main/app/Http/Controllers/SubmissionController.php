<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Submission;
use App\Models\Assignment;
use Carbon\Carbon;

class SubmissionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'file' => 'required|file|max:10240',
        ]);

        // get assignment
        $assignment = Assignment::findOrFail($request->assignment_id);

        // 🚨 DEADLINE CHECK
        if ($assignment->due_date && Carbon::now()->gt($assignment->due_date)) {
            return back()->with('error', '⛔ Deadline has expired. You cannot submit this assignment.');
        }

        // upload file
        $path = $request->file('file')->store('submissions', 'public');

        // save submission
        Submission::create([
            'assignment_id' => $assignment->id,
            'user_id' => auth()->id(),
            'file' => $path,
        ]);

        return back()->with('success', '✅ Assignment submitted successfully!');
    }
}