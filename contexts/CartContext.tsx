import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem, Certification } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (certification: Certification) => void;
  removeFromCart: (certificationId: number) => void;
  updateQuantity: (certificationId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (certification: Certification) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === certification.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === certification.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...certification, quantity: 1 }];
    });
  };

  const removeFromCart = (certificationId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== certificationId));
  };

  const updateQuantity = (certificationId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(certificationId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === certificationId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
