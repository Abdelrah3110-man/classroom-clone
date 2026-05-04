<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;
use App\Models\Assignment;
use App\Models\Material;

class SubjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'classroom_id' => 'required|exists:classrooms,id'
        ]);

        Subject::create([
            'name' => $request->name,
            'classroom_id' => $request->classroom_id
        ]);

        return back()->with('success', 'Subject created');
    }

    public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255'
    ]);

    $subject = Subject::findOrFail($id);

    $subject->update([
        'name' => $request->name
    ]);

    return back()->with('success', 'Subject updated');
}

public function destroy($id)
{
    $subject = Subject::findOrFail($id);

    // optional: detach classwork
    Assignment::where('subject_id', $id)->update(['subject_id' => null]);
    Material::where('subject_id', $id)->update(['subject_id' => null]);

    $subject->delete();

    return back()->with('success', 'Subject deleted');
}
}