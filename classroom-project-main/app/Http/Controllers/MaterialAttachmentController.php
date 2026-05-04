<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

use App\Models\MaterialAttachment;

class MaterialAttachmentController extends Controller
{
     public function destroy($id)
    {
        $attachment = MaterialAttachment::findOrFail($id);

        $materialId = $attachment-> material_id;

        if ($attachment->file_path) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return redirect()
            ->route('materials.edit', $materialId)
            ->with('success', 'Attachment deleted');
    }
}
