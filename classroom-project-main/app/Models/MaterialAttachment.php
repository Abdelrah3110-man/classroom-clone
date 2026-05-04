<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialAttachment extends Model
{
    protected $fillable = [
        'material_id',
        'file_path'
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}