<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Material;
use App\Models\Post;
use App\Models\MaterialAttachment;
use App\Models\Classroom;

class MaterialController extends Controller
{
    // ================= CREATE =================
    public function create($classroomId)
    {
        $classroom = Classroom::with('subjects')->findOrFail($classroomId);

        return view('materials.create', compact('classroom'));
    }


    // ================= STORE =================
    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'subject_id'   => 'nullable|exists:subjects,id',
            'files.*'      => 'nullable|file|max:10240',
        ]);

        // ================= CREATE MATERIAL =================
        $material = Material::create([
            'title'        => $request->title,
            'description'  => $request->description,
            'classroom_id' => $request->classroom_id,
            'subject_id'   => $request->subject_id,
        ]);

        // ================= CREATE POST =================
        Post::create([
            'description'  => $material->title,
            'user_id'      => auth()->id(),
            'classroom_id' => $request->classroom_id,
            'material_id'  => $material->id,
        ]);

        // ================= STORE FILES =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('materials', 'public');

                MaterialAttachment::create([
                    'material_id' => $material->id,
                    'file_path'   => $path,
                ]);
            }
        }

        return redirect()
            ->route('classrooms.classwork', $request->classroom_id)
            ->with('success', 'Material created successfully');
    }


    // ================= SHOW =================
    public function show($id)
    {
        $material = Material::with([
            'attachments',
            'subject',
            'classroom.subjects',
        ])->findOrFail($id);

        return view('materials.show', [
            'material' => $material,
            'classroom'  => $material->classroom
        ]);
    }


    // ================= EDIT =================
    public function edit($id)
    {
        $material = Material::with([
            'attachments',
            'subject',
            'classroom.subjects',
        ])->findOrFail($id);

        return view('materials.edit', compact('material'));
    }


    // ================= UPDATE =================
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'subject_id'  => 'nullable|exists:subjects,id',
            'files.*'     => 'nullable|file|max:10240',
        ]);

        $material = Material::with('post')->findOrFail($id);

        // ================= UPDATE MATERIAL =================
        $material->update([
            'title'       => $request->title,
            'description' => $request->description,
            'subject_id'  => $request->subject_id,
        ]);

        // ================= ADD NEW FILES =================
        if ($request->hasFile('files')) {

            foreach ($request->file('files') as $file) {

                $path = $file->store('materials', 'public');

                MaterialAttachment::create([
                    'material_id' => $material->id,
                    'file_path'   => $path,
                ]);
            }
        }

        // ================= UPDATE POST =================
        if ($material->post) {

            $material->post->update([
                'description' => $material->title,
            ]);
        }

        return redirect()
            ->route('materials.show', $material->id)
            ->with('success', 'Material updated successfully');
    }


    // ================= DELETE =================
    public function destroy($id)
    {
        $material = Material::with([
            'attachments',
            'post'
        ])->findOrFail($id);

        // ================= DELETE FILES =================
        foreach ($material->attachments as $file) {

            if (Storage::disk('public')->exists($file->file_path)) {

                Storage::disk('public')->delete($file->file_path);
            }

            $file->delete();
        }

        // ================= DELETE POST =================
        if ($material->post) {

            $material->post->delete();
        }

        $classroomId = $material->classroom_id;

        // ================= DELETE MATERIAL =================
        $material->delete();

        return redirect()
            ->route('classrooms.classwork', $classroomId)
            ->with('success', 'Material deleted successfully');
    }
}