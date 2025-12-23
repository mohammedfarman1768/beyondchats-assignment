<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('url')->nullable();
            $table->string('author')->nullable();
            $table->date('published_date')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_updated')->default(false);
            $table->text('references')->nullable();
            $table->integer('original_article_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
