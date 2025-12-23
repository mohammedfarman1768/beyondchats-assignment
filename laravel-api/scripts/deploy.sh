#!/usr/bin/env bash

# Finalize composer since we skipped it during build
composer dump-autoload --optimize --no-dev

# Run database migrations (This fixes your 'sessions' table error)
php artisan migrate --force

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# CRITICAL: Start the web server (This must be the last line)
apache2-foreground