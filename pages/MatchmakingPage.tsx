import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getMatchmakingRecommendations } from '../services/geminiService';
import { mockJobs, mockCertifications } from '../data/mockData';
import { Recommendation, UserRole } from '../types';
import SwipeCard from '../components/SwipeCard';

const MatchmakingPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(Date.now()); // Used to reset the component

  const fetchRecs = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const recs = await getMatchmakingRecommendations(user, mockJobs, mockCertifications);
    setRecommendations(recs);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== UserRole.CLIENT) {
      navigate('/');
      return;
    }
    fetchRecs();
  }, [user, navigate, fetchRecs]);

  const handleSwipe = (item: Recommendation, direction: 'left' | 'right') => {
    if (direction === 'right') {
      if (item.type === 'job') {
        alert(`You liked the job: "${item.details.title}"! In a real app, this would save your interest.`);
      } else {
        addToCart(item.details);
        alert(`"${item.details.title}" added to your cart! Check it out by clicking the cart icon.`);
      }
    }

    // Remove the swiped card from the top of the stack
    setRecommendations(prev => prev.slice(0, prev.length - 1));
  };
  
  const handleReset = () => {
      setKey(Date.now());
      fetchRecs();
  }

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold">Finding your perfect matches...</p>
        <p className="text-gray-500 dark:text-gray-400">Our AI is analyzing your profile.</p>
    </div>
  );

  const AllSwipedView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-navy-900 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">All Done!</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">You've seen all recommendations for now.</p>
        <p className="text-gray-500 dark:text-gray-400">Update your profile or check back later for more!</p>
        <button onClick={handleReset} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
            Start Over
        </button>
    </div>
  );

  return (
    <div className="space-y-6" key={key}>
        <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Your AI Matchmaker</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Swipe right to like, swipe left to pass. Your next opportunity is a swipe away!</p>
        </div>

        <div className="relative w-full h-[65vh] flex items-center justify-center">
            {isLoading ? <LoadingSpinner /> : (
                recommendations.length > 0 ? (
                    recommendations.map((rec, index) => {
                        const isTopCard = index === recommendations.length - 1;
                        return (
                            <SwipeCard
                                key={`${rec.type}-${rec.details.id}`}
                                recommendation={rec}
                                onSwipe={handleSwipe}
                                isActive={isTopCard}
                                zIndex={index}
                            />
                        );
                    })
                ) : (
                    <AllSwipedView />
                )
            )}
        </div>
    </div>
  );
};

export default MatchmakingPage;
