<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();

        if ($request->has('is_updated')) {
            $query->where('is_updated', $request->boolean('is_updated'));
        }

        if ($request->boolean('with_original')) {
            $query->with('originalArticle');
        }

        if ($request->boolean('with_updated')) {
            $query->with('updatedVersion');
        }

        $articles = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $articles
        ]);
    }

    public function latest(): JsonResponse
    {
        $article = Article::where('is_updated', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'No articles found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'url' => 'nullable|url',
            'author' => 'nullable|string',
            'published_date' => 'nullable|date',
            'image_url' => 'nullable|url',
            'is_updated' => 'boolean',
            'references' => 'nullable|array',
            'original_article_id' => 'nullable|exists:articles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $article = Article::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article created successfully'
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $article = Article::with(['originalArticle', 'updatedVersion'])->find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $article
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'content' => 'string',
            'excerpt' => 'nullable|string',
            'url' => 'nullable|url',
            'author' => 'nullable|string',
            'published_date' => 'nullable|date',
            'image_url' => 'nullable|url',
            'is_updated' => 'boolean',
            'references' => 'nullable|array',
            'original_article_id' => 'nullable|exists:articles,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $article,
            'message' => 'Article updated successfully'
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully'
        ]);
    }
}
