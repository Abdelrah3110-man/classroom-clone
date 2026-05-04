<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'title',
        'description',
        'classroom_id',
        'user_id',
        'subject_id'
    ];

    // 🔹 MATERIAL BELONGS TO CLASSROOM
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    // 🔹 MATERIAL CREATED BY USER (TEACHER)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔹 MATERIAL CAN HAVE MANY FILES (OPTIONAL)
    public function attachments()
    {
        return $this->hasMany(MaterialAttachment::class);
    }

    // 🔹 LINK WITH POST (VERY IMPORTANT FOR YOUR SYSTEM)
    public function post()
    {
        return $this->hasOne(Post::class);
    }

    public function subject()
{
    return $this->belongsTo(Subject::class);
}

}