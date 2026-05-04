<?php

namespace App\Http\Controllers;

use App\Models\AssignmentAttachment;
use Illuminate\Support\Facades\Storage;

class AssignmentAttachmentController extends Controller
{
    public function destroy($id)
    {
        $attachment = AssignmentAttachment::findOrFail($id);

        $assignmentId = $attachment->assignment_id;

        if ($attachment->file_path) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return redirect()
            ->route('assignments.edit', $assignmentId)
            ->with('success', 'Attachment deleted');
    }
}