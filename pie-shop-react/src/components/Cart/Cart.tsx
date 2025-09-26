/**
 * Cart Component - React version of cart functionality
 * Displays cart items, total, and cart actions
 */

import React from 'react';
import { CartProps } from '../../types/pie';
import { useCartContext } from '../../contexts/CartContext';
import CartItem from './CartItem';
import './Cart.css';

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, clearCart } = useCartContext();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            ×
          </button>
        </div>
        
        <div className="cart-items">
          {cart.items.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          )}
        </div>
        
        {cart.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              Total: ${cart.totalPrice.toFixed(2)}
            </div>
            <button 
              className="btn-secondary cart-clear"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Cart;
