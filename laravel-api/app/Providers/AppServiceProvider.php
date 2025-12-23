<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // Added this import

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
        // This ensures all generated links (CSS, JS, Pagination) 
        // use 'https' when running on Render/Production.
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}