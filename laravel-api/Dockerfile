FROM php:8.2-apache

# Install system dependencies + PHP extensions FIRST
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev zip unzip git curl \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip bcmath \
    && rm -rf /var/lib/apt/lists/*

# Install Composer EARLY (before any composer commands)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable rewrite
RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy composer files FIRST for caching
COPY composer.json composer.lock* ./

# Set memory limit
ENV COMPOSER_MEMORY_LIMIT=-1

# Install deps WITHOUT autoloader first (your original approach)
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist --ignore-platform-reqs

# NOW copy full project
COPY . .

# Generate autoloader (CRITICAL after --no-autoloader)
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apache config
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80
CMD ["/var/www/html/scripts/deploy.sh"]
