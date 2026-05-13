<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubmissionApiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'assignment_id' => 'required|exists:assignments,id',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $userId = $request->input('user_id') ?? Auth::id();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            
            $submission = Submission::updateOrCreate(
                ['assignment_id' => $request->assignment_id, 'user_id' => $userId],
                [
                    'file' => $path,
                    'note' => $request->note ?? ''
                ]
            );

            return response()->json($submission, 201);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
