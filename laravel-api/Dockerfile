FROM php:8.4-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies + PHP extensions
# We add g++ and libicu-dev to fix the 'icu-uc' error
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    g++ \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        zip \
        bcmath \
        gd \
        intl \
        mbstring \
        exif \
        pcntl \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite headers

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

ENV COMPOSER_MEMORY_LIMIT=-1
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install dependencies
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --no-interaction \
    --prefer-dist \
    --ignore-platform-reqs

# Copy the rest of the application
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --classmap-authoritative \
    --ignore-platform-reqs

# Fix permissions for Render/Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Apache configuration to point to /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Create and set up the deploy script
RUN mkdir -p /var/www/html/scripts && \
    echo '#!/bin/bash\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\n# Run migrations if needed\n# php artisan migrate --force\napache2-foreground' > /var/www/html/scripts/deploy.sh && \
    chmod +x /var/www/html/scripts/deploy.sh

EXPOSE 80

CMD ["/var/www/html/scripts/deploy.sh"]
