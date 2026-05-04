<?php

namespace App\Http\Controllers;

use App\Models\PostAttachment;
use Illuminate\Support\Facades\Storage;

class PostAttachmentController extends Controller
{
    public function destroy($id)
{
    $attachment = PostAttachment::findOrFail($id);

    // ✅ VERY IMPORTANT: store post_id BEFORE delete
    $postId = $attachment->post_id;

    // delete file
    if ($attachment->file_path) {
        Storage::disk('public')->delete($attachment->file_path);
    }

    // delete record
    $attachment->delete();

    // ✅ ALWAYS redirect safely
    return redirect()
        ->route('posts.edit', $postId)
        ->with('success', 'Attachment deleted');
}
}