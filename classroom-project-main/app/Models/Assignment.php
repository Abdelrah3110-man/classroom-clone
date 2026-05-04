<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Classroom;
use App\Models\User;
use App\Models\Submission;
use App\Models\Post;
use App\Models\AssignmentAttachment;

class Assignment extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'classroom_id',
        'user_id',
        'subject_id'
    ];

    // ================= CLASSROOM =================
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    // ================= TEACHER =================
    public function teacher()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ================= SUBMISSIONS =================
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    // ================= STREAM POST =================
    public function post()
    {
        return $this->hasOne(Post::class);
    }

    // ================= MULTIPLE ATTACHMENTS (NEW SYSTEM) =================
    public function attachments()
    {
        return $this->hasMany(AssignmentAttachment::class);
    }

    public function subject()
{
    return $this->belongsTo(Subject::class);
}

}