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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('section')->nullable();
            $table->string('subject')->nullable();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

  
};
