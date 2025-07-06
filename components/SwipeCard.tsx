import React, { useState, useRef, useEffect } from 'react';
import { Recommendation, Job, Certification } from '../types';

const JobCardContent: React.FC<{ job: Job }> = ({ job }) => (
  <>
    <div className="flex items-center gap-4 mb-4">
      <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 rounded-lg object-cover" />
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
        <p className="text-md text-gray-600 dark:text-gray-400">{job.companyName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{job.location}</p>
      </div>
    </div>
    <div className="text-lg font-semibold text-green-500">
      Salary: Rp {job.salary.toLocaleString()}
    </div>
  </>
);

const CertCardContent: React.FC<{ cert: Certification }> = ({ cert }) => (
  <>
    <img src={cert.thumbnail} alt={cert.title} className="w-full h-40 object-cover rounded-t-xl" />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cert.title}</h3>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-4">{cert.description}</p>
      <div className="text-lg font-semibold text-green-500">
        Price: Rp {cert.price.toLocaleString()}
      </div>
    </div>
  </>
);


interface SwipeCardProps {
  recommendation: Recommendation;
  onSwipe: (item: Recommendation, direction: 'left' | 'right') => void;
  isActive: boolean;
  zIndex: number;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ recommendation, onSwipe, isActive, zIndex }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startPos.current = { x: e.clientX };
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isActive) return;
    const dx = e.clientX - startPos.current.x;
    setPosition({ x: dx, y: 0 });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    const swipeThreshold = 120; // pixels
    if (Math.abs(position.x) > swipeThreshold) {
      const direction = position.x > 0 ? 'right' : 'left';
      const flyOutX = (direction === 'right' ? 1 : -1) * (window.innerWidth / 2 + 300);
       if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.5s ease-out';
        setPosition({ x: flyOutX, y: position.y + 75 });
      }
      setTimeout(() => onSwipe(recommendation, direction), 100);
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
      setPosition({ x: 0, y: 0 });
    }
  };

  const rotation = position.x / 20;
  const likeOpacity = position.x > 0 ? (Math.min(position.x, 100) / 100) : 0;
  const nopeOpacity = position.x < 0 ? (Math.min(Math.abs(position.x), 100) / 100) : 0;
  
  const cardStyle = {
    transform: `translate(${position.x}px, 0px) rotate(${rotation}deg)`,
    touchAction: 'none',
    zIndex,
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={cardStyle}
      className={`absolute w-[90vw] max-w-sm h-[58vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl cursor-grab ${isActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
        {/* Watermarks */}
        <div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 text-green-500 text-5xl font-extrabold border-4 border-green-500 px-4 py-2 rounded-xl transform -rotate-12">LIKE</div>
        <div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 text-red-500 text-5xl font-extrabold border-4 border-red-500 px-4 py-2 rounded-xl transform rotate-12">NOPE</div>
      
        {/* Content */}
        <div className="w-full h-full flex flex-col pointer-events-none">
            <div className="flex-grow">
                {recommendation.type === 'job' ? <JobCardContent job={recommendation.details} /> : <CertCardContent cert={recommendation.details} />}
            </div>
            <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-b-2xl border-t dark:border-navy-700">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI Recommendation:</p>
                <p className="text-gray-700 dark:text-gray-300 italic">"{recommendation.reason}"</p>
            </div>
        </div>
    </div>
  );
};

export default SwipeCard;
