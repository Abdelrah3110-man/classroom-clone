<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassroomApiController extends Controller
{
    /**
     * Display a listing of classrooms.
     */
    public function index()
    {
        // Fetch classrooms with teacher and nested relationships for dashboard stats
        $classrooms = Classroom::with([
            'teacher',
            'students',
            'assignments.submissions'
        ])->latest()->get();
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

        $validated['teacher_id'] = Auth::id() ?? 1;
        $validated['code'] = strtoupper(substr(md5(time()), 0, 7));

        $classroom = Classroom::create($validated);

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

        // Attach student
        if (!$classroom->students()->where('user_id', Auth::id())->exists()) {
            $classroom->students()->attach(Auth::id());
        }

        return response()->json([
            'message' => 'Joined successfully',
            'classroom' => $classroom
        ]);
    }
}
