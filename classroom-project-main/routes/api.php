<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClassroomApiController;

Route::prefix('v1')->group(function () {
    Route::get('/classrooms', [ClassroomApiController::class, 'index']);
    Route::get('/classrooms/{id}', [ClassroomApiController::class, 'show']);
});
