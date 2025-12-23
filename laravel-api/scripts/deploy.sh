#!/usr/bin/env bash

# Finalize composer since we skipped it during build
composer dump-autoload --optimize --no-dev

# Run database migrations
php artisan migrate --force

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# CRITICAL: Start the web server
apache2-foreground