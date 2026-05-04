<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Post;
use App\Models\Assignment;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassroomApiController extends Controller
{
    /**
     * Display a listing of classrooms.
     */
    public function index()
    {
        // In a real scenario, we'd filter by the authenticated user's classes
        // For this demo, we'll return all classes with their owner
        $classrooms = Classroom::with('user')->latest()->get();
        
        if ($classrooms->isEmpty()) {
            return response()->json($this->getSampleClassrooms());
        }

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

        // Defaulting user_id to 1 if not auth (for demo)
        $validated['user_id'] = Auth::id() ?? 1;
        $validated['code'] = strtoupper(substr(md5(time()), 0, 7));

        $classroom = Classroom::create($validated);

        return response()->json($classroom, 21);
    }

    /**
     * Display the specified classroom with all its components.
     */
    public function show($id)
    {
        $classroom = Classroom::with([
            'user', 
            'posts.user', 
            'posts.comments.user',
            'assignments', 
            'materials'
        ])->find($id);
        
        if (!$classroom) {
            return response()->json(['error' => 'Classroom not found'], 404);
        }

        // Add a primary color if not set for the frontend UI
        $colors = ['#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a142f4', '#24c1e0'];
        $classroom->banner_color = $colors[$classroom->id % count($colors)];

        return response()->json($classroom);
    }

    /**
     * Helper for sample data to ensure the UI looks great even on first run.
     */
    private function getSampleClassrooms()
    {
        return [
            [
                'id' => 1,
                'name' => 'Advanced Web Architecture',
                'section' => 'CS-401',
                'subject' => 'Software Engineering',
                'room' => 'Online',
                'code' => 'WEB303',
                'user' => ['name' => 'Senior Developer'],
                'banner_color' => '#4285f4',
                'created_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'UI/UX Design Masterclass',
                'section' => 'Design-A',
                'subject' => 'Creative Arts',
                'room' => 'Studio 12',
                'code' => 'ART101',
                'user' => ['name' => 'Lead Designer'],
                'banner_color' => '#34a853',
                'created_at' => now()
            ]
        ];
    }
}
