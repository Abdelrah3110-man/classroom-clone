<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Post;

class PostAttachment extends Model
{
   protected $fillable = [
        'post_id',
        'file_path'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
