<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialAttachment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MaterialApiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'nullable|exists:subjects,id',
            'files.*'      => 'nullable|file|max:10240',
        ]);

        $classroom = \App\Models\Classroom::findOrFail($request->classroom_id);
        $userId = Auth::id() ?? $classroom->teacher_id;

        $material = Material::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'classroom_id' => $request->classroom_id,
            'subject_id'   => $request->subject_id,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('materials', 'public');
                MaterialAttachment::create([
                    'material_id' => $material->id,
                    'file_path'   => $path
                ]);
            }
        }

        // Stream Post
        Post::create([
            'description'   => $material->title,
            'classroom_id'  => $request->classroom_id,
            'user_id'       => $userId,
            'type'          => 'material',
            'material_id'   => $material->id
        ]);

        return response()->json($material->load('attachments'), 201);
    }

    public function show($id)
    {
        $material = Material::with(['attachments', 'classroom', 'subject'])->findOrFail($id);
        return response()->json($material);
    }

    public function update(Request $request, $id)
    {
        $material = Material::findOrFail($id);
        
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id'  => 'nullable|exists:subjects,id',
        ]);

        $material->update($request->only(['title', 'description', 'subject_id']));

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('materials', 'public');
                MaterialAttachment::create([
                    'material_id' => $material->id,
                    'file_path'   => $path
                ]);
            }
        }

        return response()->json($material->load('attachments'));
    }

    public function destroy($id)
    {
        $material = Material::with('attachments')->findOrFail($id);
        
        foreach ($material->attachments as $file) {
            Storage::disk('public')->delete($file->file_path);
        }
        $material->attachments()->delete();
        Post::where('material_id', $material->id)->delete();
        
        $material->delete();

        return response()->json(['message' => 'Material deleted']);
    }
}
