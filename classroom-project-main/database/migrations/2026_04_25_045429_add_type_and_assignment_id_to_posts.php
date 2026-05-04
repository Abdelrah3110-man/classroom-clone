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
        Schema::table('posts', function (Blueprint $table) {
        $table->string('type')->default('post'); // post | assignment
        $table->foreignId('assignment_id')->nullable()->constrained()->onDelete('cascade');
        });
    }


};
