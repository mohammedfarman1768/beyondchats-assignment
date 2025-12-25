<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * This ensures all generated links (CSS, JS, Pagination, and API routes) 
         * use 'https' instead of 'http' when running on Render.
         * Without this, your site may fail to load styles or scripts.
         */
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}