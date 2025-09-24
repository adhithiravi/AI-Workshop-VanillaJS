/**
 * Cart Context - Global cart state management
 * Provides cart state and actions to all components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { CartContextType } from '../types/pie';
import { useCart } from '../hooks/useCart';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartState = useCart();

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
