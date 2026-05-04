<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewPostMail extends Mailable
{
    use Queueable, SerializesModels;

    public $post;
    public $classroom;

    public function __construct($post, $classroom)
    {
        $this->post = $post;
        $this->classroom = $classroom;
    }

    public function build()
    {
        return $this->subject('📢 New Post in ' . $this->classroom->name)->view('emails.new_post');
    }
}