import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/api';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getById(id);
      setArticle(response.data);
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const hasRelatedVersion = article.updated_version || article.original_article;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Articles
          </button>

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              article.is_updated
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {article.is_updated ? 'Updated Version' : 'Original Article'}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mt-3">
            {article.title}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            {article.author || 'Unknown'} • {formatDate(article.published_date)}
          </p>

          {hasRelatedVersion && (
            <div className="mt-6">
              <button
                onClick={() => {
                  const relatedId =
                    article.updated_version?.id ||
                    article.original_article?.id;
                  navigate(`/article/${relatedId}`);
                }}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                View {article.is_updated ? 'Original' : 'Updated'} Version
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}

          {article.content
            .split('\n\n')
            .map((para, idx) => (
              <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                {para}
              </p>
            ))}

          {article.url && (
            <div className="mt-6 pt-6 border-t">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Original Source
              </a>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;
