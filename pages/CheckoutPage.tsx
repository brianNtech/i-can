import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePayment = () => {
    alert("Redirecting to dummy payment gateway... Payment successful! Thank you for your purchase.");
    clearCart();
    navigate('/certifications');
  };
  
  if (items.length === 0) {
    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added any certifications yet.</p>
            <button onClick={() => navigate('/certifications')} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                Browse Certifications
            </button>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">Shopping Cart</h1>
      
      <div className="bg-white dark:bg-navy-900 rounded-xl shadow-lg">
        <div className="p-6 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b dark:border-navy-700 pb-4">
              <div className="flex items-center gap-4">
                <img src={item.thumbnail} alt={item.title} className="w-24 h-16 rounded-lg object-cover" />
                <div>
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h2>
                  <p className="text-gray-500">Rp {item.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-16 p-1 text-center border rounded bg-gray-100 dark:bg-navy-800 dark:border-navy-600"
                />
                 <p className="font-semibold w-28 text-right">Rp {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-navy-800/50 rounded-b-xl">
            <div className="flex justify-end items-center text-xl font-bold">
                <span className="text-gray-600 dark:text-gray-300 mr-4">Total:</span>
                <span className="text-green-500">Rp {total.toLocaleString()}</span>
            </div>
             <div className="flex justify-end mt-6">
                <button 
                    onClick={handlePayment} 
                    className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-green-500 hover:to-blue-600 transition-all shadow-lg"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
