<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomApiController extends Controller
{
    public function index()
    {
        // For demonstration, if no classrooms exist, return some sample data
        $classrooms = Classroom::with('user')->get();
        
        if ($classrooms->isEmpty()) {
            return response()->json([
                [
                    'id' => 1,
                    'name' => 'Advanced Web Development',
                    'section' => 'Section A',
                    'subject' => 'Computer Science',
                    'room' => 'Room 302',
                    'code' => 'WEB101',
                    'user' => ['name' => 'Dr. Smith'],
                    'banner_color' => '#4285f4'
                ],
                [
                    'id' => 2,
                    'name' => 'Graphic Design Basics',
                    'section' => 'Evening Batch',
                    'subject' => 'Arts',
                    'room' => 'Studio 1',
                    'code' => 'ART202',
                    'user' => ['name' => 'Prof. Jane'],
                    'banner_color' => '#34a853'
                ],
                [
                    'id' => 3,
                    'name' => 'Data Structures',
                    'section' => 'Year 2',
                    'subject' => 'Algorithms',
                    'room' => 'Lab 4',
                    'code' => 'DS404',
                    'user' => ['name' => 'Prof. Alan'],
                    'banner_color' => '#fbbc05'
                ]
            ]);
        }

        return response()->json($classrooms);
    }

    public function show($id)
    {
        $classroom = Classroom::with(['user', 'posts.user', 'assignments', 'materials'])->find($id);
        
        if (!$classroom) {
            // Sample data for demo
            return response()->json([
                'id' => $id,
                'name' => 'Sample Classroom',
                'section' => 'Section B',
                'subject' => 'Physics',
                'user' => ['name' => 'Einstein'],
                'posts' => [
                    ['id' => 1, 'content' => 'Welcome to the class!', 'user' => ['name' => 'Einstein'], 'created_at' => now()],
                    ['id' => 2, 'content' => 'Please check the new assignment.', 'user' => ['name' => 'Einstein'], 'created_at' => now()->subDay()],
                ],
                'assignments' => [
                    ['id' => 1, 'title' => 'Relativity Homework', 'due_date' => now()->addDays(7)],
                ]
            ]);
        }

        return response()->json($classroom);
    }
}
