<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentAttachment extends Model
{
    protected $fillable = [
        'assignment_id',
        'file_path'
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }
}