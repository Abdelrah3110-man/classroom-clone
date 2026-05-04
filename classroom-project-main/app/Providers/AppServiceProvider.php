<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\Classroom;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         View::composer('*', function ($view) {

        if (auth()->check()) {

            $user = auth()->user();

            $created = Classroom::where('teacher_id', $user->id)->get();

            $joined = Classroom::whereHas('students', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->get();

            $view->with([
                'created' => $created,
                'joined' => $joined,
            ]);
        }
    });
    }
}
