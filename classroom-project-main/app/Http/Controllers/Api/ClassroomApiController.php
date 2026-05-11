<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassroomApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->input('user_id') ?? Auth::id() ?? 1;

        // Fetch classrooms where user is teacher OR user is a student
        $classrooms = Classroom::with([
            'teacher',
            'students',
            'assignments.submissions'
        ])
        ->where('teacher_id', $userId)
        ->orWhereHas('students', function($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->latest()
        ->get();
        
        return response()->json($classrooms);
    }

    /**
     * Store a newly created classroom.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'section' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
        ]);

        $userId = $request->input('user_id') ?? Auth::id() ?? 1;

        $validated['teacher_id'] = $userId;
        $validated['code'] = strtoupper(substr(md5(time()), 0, 7));

        $classroom = Classroom::create($validated);
        
        // Load relationships so frontend has consistent data
        $classroom->load('teacher', 'students', 'assignments.submissions');

        return response()->json($classroom, 201);
    }

    /**
     * Display the specified classroom with all its components.
     */
    public function show($id)
    {
        $classroom = Classroom::with([
            'teacher', 
            'posts.user', 
            'posts.comments.user',
            'assignments', 
            'materials'
        ])->findOrFail($id);
        
        // Add a primary color dynamically if not present
        $colors = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a142f4', '#24c1e0'];
        $classroom->banner_color = $colors[$classroom->id % count($colors)];

        return response()->json($classroom);
    }

    /**
     * Join a classroom by code.
     */
    public function joinByCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $classroom = Classroom::where('code', $request->code)->first();

        if (!$classroom) {
            return response()->json(['message' => 'Invalid class code'], 404);
        }

        $userId = $request->input('user_id') ?? Auth::id() ?? 1;

        // Attach student
        if (!$classroom->students()->where('user_id', $userId)->exists()) {
            $classroom->students()->attach($userId);
        }

        // Load relationships so frontend has consistent data
        $classroom->load('teacher', 'students', 'assignments.submissions');

        return response()->json([
            'message' => 'Joined successfully',
            'classroom' => $classroom
        ]);
    }

    /**
     * Update the specified classroom.
     */
    public function update(Request $request, $id)
    {
        $classroom = Classroom::findOrFail($id);

        // Check if user is the teacher
        if ($classroom->teacher_id !== (Auth::id() ?? 1)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'section' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'room' => 'nullable|string|max:255',
        ]);

        $classroom->update($validated);

        return response()->json(['message' => 'Classroom updated successfully', 'classroom' => $classroom]);
    }

    /**
     * Remove the specified classroom.
     */
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);

        if ($classroom->teacher_id !== (Auth::id() ?? 1)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $classroom->delete();

        return response()->json(['message' => 'Classroom deleted successfully']);
    }
}
