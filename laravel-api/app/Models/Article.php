<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'url',
        'author',
        'published_date',
        'image_url',
        'is_updated',
        'references',
        'original_article_id'
    ];

    /**
     * FIXED: This tells Laravel to handle the Array -> JSON conversion 
     * for the Neon PostgreSQL database automatically.
     */
    protected $casts = [
        'references' => 'array',
        'is_updated' => 'boolean',
        'published_date' => 'date',
    ];

    public function originalArticle()
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    public function updatedVersion()
    {
        return $this->hasOne(Article::class, 'original_article_id');
    }
}