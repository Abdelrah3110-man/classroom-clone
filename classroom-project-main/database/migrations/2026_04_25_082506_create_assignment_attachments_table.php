<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignment_attachments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('assignment_id')->constrained()->onDelete('cascade');
        $table->string('file_path');
        $table->timestamps();
        });
    }

};
