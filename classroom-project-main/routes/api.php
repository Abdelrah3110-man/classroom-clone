<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClassroomApiController;
use App\Http\Controllers\Api\PostApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\TaskController;

Route::group([], function () {
    // Auth
    Route::post('/login', [AuthApiController::class, 'login']);
    Route::post('/register', [AuthApiController::class, 'register']);
    Route::post('/logout', [AuthApiController::class, 'logout']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);

    // Classrooms
    Route::get('/classrooms', [ClassroomApiController::class, 'index']);
    Route::post('/classrooms', [ClassroomApiController::class, 'store']);
    Route::post('/classrooms/join', [ClassroomApiController::class, 'joinByCode']);
    Route::get('/classrooms/{id}', [ClassroomApiController::class, 'show']);
    
    // Posts
    Route::post('/posts', [PostApiController::class, 'store']);
});
