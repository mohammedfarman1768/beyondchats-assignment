#!/usr/bin/env bash

# Generate the autoloader and run discovery now that we are live
composer dump-autoload --optimize

# Run database migrations
php artisan migrate --force

# Clear and set caches
php artisan config:cache
php artisan route:cache
php artisan view:cache