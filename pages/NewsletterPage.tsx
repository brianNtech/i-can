import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockArticles } from '../data/mockData';
import { NewsletterArticle, UserRole } from '../types';

const NewsletterPage: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsletterArticle[]>(mockArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', summary: '' });

  const handleAddArticle = () => {
    if (newArticle.title && newArticle.summary && user) {
        const articleToAdd: NewsletterArticle = {
            id: articles.length + 1,
            ...newArticle,
            author: user.name,
            content: 'Newly added article content.',
            date: new Date().toISOString().split('T')[0]
        };
      setArticles([articleToAdd, ...articles]);
      setIsModalOpen(false);
      setNewArticle({ title: '', summary: '' });
    }
  };
  
  const isHrd = user?.role === UserRole.HRD || user?.role === UserRole.HRD_PREMIUM;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Newsletter</h1>
        {isHrd && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add Article
          </button>
        )}
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {articles.map(article => (
          <div key={article.id} className="bg-white dark:bg-navy-900 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{article.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">By {article.author} on {article.date}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{article.summary}</p>
            <button className="font-semibold text-blue-500 dark:text-blue-400 hover:underline">Read More →</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Article</h2>
            <input
              type="text"
              placeholder="Article Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-navy-700 dark:border-navy-600"
            />
            <textarea
              placeholder="Article Summary"
              value={newArticle.summary}
              onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
              className="w-full p-2 mb-4 border rounded bg-gray-100 dark:bg-navy-700 dark:border-navy-600"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-navy-600">Cancel</button>
              <button onClick={handleAddArticle} className="px-4 py-2 rounded bg-blue-500 text-white">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;
