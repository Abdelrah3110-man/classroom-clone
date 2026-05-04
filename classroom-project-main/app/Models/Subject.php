<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'classroom_id'
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function materials()
    {
        return $this->hasMany(Material::class);
    }
}