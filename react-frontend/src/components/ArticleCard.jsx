import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {article.is_updated ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              Updated
            </span>
          ) : (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              Original
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.author || 'Unknown'}</span>
          <span>{formatDate(article.published_date)}</span>
        </div>

        {article.updated_version && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-green-600 font-medium">
              ✓ Has updated version available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
