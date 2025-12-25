
composer dump-autoload --optimize --no-dev

php artisan migrate --force

php artisan config:cache
php artisan route:cache
php artisan view:cache

apache2-foreground