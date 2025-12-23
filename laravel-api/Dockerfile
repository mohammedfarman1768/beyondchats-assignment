FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip bcmath

RUN a2enmod rewrite
WORKDIR /var/www/html

# Copy project files (ensure vendor is NOT copied)
COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set memory limit to unlimited for the build
ENV COMPOSER_MEMORY_LIMIT=-1

# FIX: Install WITHOUT scripts or autoloader to save RAM and avoid Code 2
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Point Apache to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80

# The startup command
CMD ["/var/www/html/scripts/deploy.sh"]