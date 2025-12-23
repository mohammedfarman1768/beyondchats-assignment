#!/usr/bin/env bash
# Run database migrations
php artisan migrate --force

# Cache configurations for speed
php artisan config:cache
php artisan route:cache
php artisan view:cache