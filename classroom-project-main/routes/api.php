<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClassroomApiController;
use App\Http\Controllers\Api\PostApiController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\MaterialApiController;
use App\Http\Controllers\Api\AssignmentApiController;
use App\Http\Controllers\Api\CommentApiController;
use App\Http\Controllers\Api\ProfileApiController;

Route::group([], function () {
    // Auth
    Route::post('/login', [AuthApiController::class, 'login']);
    Route::post('/register', [AuthApiController::class, 'register']);
    Route::post('/logout', [AuthApiController::class, 'logout']);

    // Profile
    Route::post('/profile', [ProfileApiController::class, 'update']);
    Route::put('/profile/password', [ProfileApiController::class, 'updatePassword']);

    // Classrooms
    Route::get('/classrooms', [ClassroomApiController::class, 'index']);
    Route::post('/classrooms', [ClassroomApiController::class, 'store']);
    Route::post('/classrooms/join', [ClassroomApiController::class, 'joinByCode']);
    Route::get('/classrooms/{id}', [ClassroomApiController::class, 'show']);
    Route::put('/classrooms/{id}', [ClassroomApiController::class, 'update']);
    Route::delete('/classrooms/{id}', [ClassroomApiController::class, 'destroy']);
    
    // Posts
    Route::post('/posts', [PostApiController::class, 'store']);
    Route::delete('/posts/{id}', [PostApiController::class, 'destroy']);

    // Materials
    Route::get('/materials/{id}', [MaterialApiController::class, 'show']);
    Route::post('/materials', [MaterialApiController::class, 'store']);
    Route::put('/materials/{id}', [MaterialApiController::class, 'update']);
    Route::delete('/materials/{id}', [MaterialApiController::class, 'destroy']);

    // Assignments
    Route::get('/assignments/{id}', [AssignmentApiController::class, 'show']);
    Route::post('/assignments', [AssignmentApiController::class, 'store']);
    Route::put('/assignments/{id}', [AssignmentApiController::class, 'update']);
    Route::delete('/assignments/{id}', [AssignmentApiController::class, 'destroy']);

    // Comments
    Route::post('/comments', [CommentApiController::class, 'store']);
    Route::delete('/comments/{id}', [CommentApiController::class, 'destroy']);

    // Submissions
    Route::post('/submissions', [\App\Http\Controllers\Api\SubmissionApiController::class, 'store']);

    // Tasks (Scaffolded earlier)
    Route::apiResource('tasks', TaskController::class);

    // Profile Delete
    Route::delete('/profile', [ProfileApiController::class, 'destroy']);
});
