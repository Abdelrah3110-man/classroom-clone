<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClassroomApiController;
use App\Http\Controllers\Api\PostApiController;

Route::prefix('v1')->group(function () {
    // Classrooms
    Route::get('/classrooms', [ClassroomApiController::class, 'index']);
    Route::post('/classrooms', [ClassroomApiController::class, 'store']);
    Route::get('/classrooms/{id}', [ClassroomApiController::class, 'show']);
    
    // Posts
    Route::post('/posts', [PostApiController::class, 'store']);
    Route::delete('/posts/{id}', [PostApiController::class, 'destroy']);
});
