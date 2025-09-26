/**
 * useCart Hook - React hook for cart management
 * Converts cartStorage logic to React state management
 */

import { useState, useEffect, useCallback } from 'react';
import { Cart, Pie, UseCartReturn } from '../types/pie';
import { cartStorage } from '../utils/cartStorage';

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalQuantity: 0,
    totalPrice: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      const items = cartStorage.getCart();
      const totalQuantity = cartStorage.getCartQuantity();
      const totalPrice = cartStorage.getCartTotal();
      
      setCart({
        items,
        totalQuantity,
        totalPrice
      });
    };

    loadCart();
  }, []);

  // Update cart state when localStorage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        const items = cartStorage.getCart();
        const totalQuantity = cartStorage.getCartQuantity();
        const totalPrice = cartStorage.getCartTotal();
        
        setCart({
          items,
          totalQuantity,
          totalPrice
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = useCallback((pie: Pie) => {
    const success = cartStorage.addToCart(pie);
    if (success) {
      const items = cartStorage.getCart();
      const totalQuantity = cartStorage.getCartQuantity();
      const totalPrice = cartStorage.getCartTotal();
      
      setCart({
        items,
        totalQuantity,
        totalPrice
      });
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const success = cartStorage.removeFromCart(id);
    if (success) {
      const items = cartStorage.getCart();
      const totalQuantity = cartStorage.getCartQuantity();
      const totalPrice = cartStorage.getCartTotal();
      
      setCart({
        items,
        totalQuantity,
        totalPrice
      });
    }
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const success = cartStorage.updateQuantity(id, quantity);
    if (success) {
      const items = cartStorage.getCart();
      const totalQuantity = cartStorage.getCartQuantity();
      const totalPrice = cartStorage.getCartTotal();
      
      setCart({
        items,
        totalQuantity,
        totalPrice
      });
    }
  }, []);

  const clearCart = useCallback(() => {
    const success = cartStorage.clearCart();
    if (success) {
      setCart({
        items: [],
        totalQuantity: 0,
        totalPrice: 0
      });
    }
  }, []);

  const isInCart = useCallback((id: string) => {
    return cartStorage.isInCart(id);
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart
  };
};
