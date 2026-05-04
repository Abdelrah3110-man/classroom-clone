<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Post;
use App\Models\Assignment;

class Classroom extends Model
{
    protected $fillable = [
    'name',
    'section',
    'subject',
    'teacher_id',
    'code'
    
];

public function teacher()
{
    return $this->belongsTo(User::class, 'teacher_id');
}

public function students()
{
    return $this->belongsToMany(User::class);
}

public function posts()
{
    return $this->hasMany(Post::class);
}

public function assignments()
{
    return $this->hasMany(Assignment::class);
}

public function materials()
{
    return $this->hasMany(Material::class);
}

public function subjects()
{
    return $this->hasMany(Subject::class);
}

}
