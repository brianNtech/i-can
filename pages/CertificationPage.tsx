import React from 'react';
import { useCart } from '../contexts/CartContext';
import { mockCertifications } from '../data/mockData';
import { Certification } from '../types';

const CertificationCard: React.FC<{ cert: Certification; onAddToCart: (cert: Certification) => void }> = ({ cert, onAddToCart }) => (
    <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <img src={cert.thumbnail} alt={cert.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 flex-grow">{cert.description}</p>
            <div className="mt-6 flex justify-between items-center">
                <p className="text-lg font-semibold text-green-500">Rp {cert.price.toLocaleString()}</p>
                <button 
                    onClick={() => onAddToCart(cert)}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

const CertificationPage: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (cert: Certification) => {
    addToCart(cert);
    // Maybe show a toast notification here in a real app
    alert(`${cert.title} has been added to your cart!`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Get Certified</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
        Boost your resume with industry-recognized certifications. Invest in your future today.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockCertifications.map(cert => (
            <CertificationCard key={cert.id} cert={cert} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default CertificationPage;
