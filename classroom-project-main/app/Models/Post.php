<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Classroom;
use App\Models\Comment;
use App\Models\PostAttachment;
use App\Models\Assignment;

class Post extends Model
{
    protected $fillable = [
        'title',
        'description',
        'classroom_id',
        'user_id',
        'type',
        'assignment_id',
        'material_id'
    ];

    // ================= RELATIONS =================

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    // ================= NEW ATTACHMENTS SYSTEM =================
    public function attachments()
    {
        return $this->hasMany(PostAttachment::class);
    }

    public function material()  
    {
    return $this->belongsTo(Material::class);
    }
}
