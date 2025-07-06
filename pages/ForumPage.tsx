import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockForumPosts, mockUsers } from '../data/mockData';
import { ForumPost } from '../types';

const ForumPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [newComment, setNewComment] = useState('');

  const getUserById = (id: number) => mockUsers.find(u => u.id === id);

  const handlePostComment = () => {
    if (newComment.trim() && user && activePost) {
      const comment = {
        id: Math.random(),
        authorId: user.id,
        content: newComment.trim(),
      };
      const updatedPosts = posts.map(p => 
        p.id === activePost.id ? { ...p, comments: [...p.comments, comment] } : p
      );
      setPosts(updatedPosts);
      setActivePost(updatedPosts.find(p => p.id === activePost.id) || null);
      setNewComment('');
    }
  };
  
  if (activePost) {
    const postAuthor = getUserById(activePost.authorId);
    return (
      <div>
        <button onClick={() => setActivePost(null)} className="mb-6 text-blue-500 hover:underline">
          &larr; Back to all topics
        </button>
        <div className="bg-white dark:bg-navy-900 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <img src={postAuthor?.profilePicture} alt={postAuthor?.name} className="w-12 h-12 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">{activePost.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">by {postAuthor?.name}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-8">{activePost.content}</p>
          
          <h3 className="text-xl font-semibold border-t dark:border-navy-700 pt-6 mb-4">Comments</h3>
          <div className="space-y-4">
            {activePost.comments.map(comment => {
              const commentAuthor = getUserById(comment.authorId);
              return (
                <div key={comment.id} className="flex items-start gap-3 bg-gray-50 dark:bg-navy-800 p-4 rounded-lg">
                  <img src={commentAuthor?.profilePicture} alt={commentAuthor?.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{commentAuthor?.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {user && (
            <div className="mt-8 border-t dark:border-navy-700 pt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full p-2 border rounded bg-gray-100 dark:bg-navy-800 dark:border-navy-600"
                rows={3}
              />
              <button onClick={handlePostComment} className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Post Comment
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Community Forum</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">Discuss topics, ask questions, and share knowledge with the community.</p>
      
      <div className="space-y-4">
        {posts.map(post => {
            const author = getUserById(post.authorId);
            return (
              <div key={post.id} onClick={() => setActivePost(post)} className="bg-white dark:bg-navy-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {author?.name}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{post.comments.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">comments</p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default ForumPage;
