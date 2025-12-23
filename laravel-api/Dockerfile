FROM php:8.4-apache

WORKDIR /var/www/html

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
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

RUN a2enmod rewrite

COPY composer.json composer.lock* ./

ENV COMPOSER_MEMORY_LIMIT=-1
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install deps (ignore platform reqs for install, but PHP 8.4 will satisfy them)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --no-interaction \
    --prefer-dist \
    --ignore-platform-reqs \
    --verbose

COPY . .

# FIXED: Add --ignore-platform-reqs to dump-autoload
RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --classmap-authoritative \
    --ignore-platform-reqs

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Apache config
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf \
    && a2enmod headers

# Deploy script fallback
RUN if [ ! -f /var/www/html/scripts/deploy.sh ]; then \
    mkdir -p /var/www/html/scripts && \
    echo '#!/bin/bash\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\napache2-foreground' > /var/www/html/scripts/deploy.sh && \
    chmod +x /var/www/html/scripts/deploy.sh; \
    fi

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["/var/www/html/scripts/deploy.sh"]
