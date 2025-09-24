/**
 * CartPage Component - Full cart page
 * Displays all cart items with detailed controls
 */

import React from 'react';
import { useCartContext } from '../contexts/CartContext';
import CartItem from '../components/Cart/CartItem';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cart, clearCart } = useCartContext();

  if (cart.items.length === 0) {
    return (
      <main className="container">
        <div className="cart-empty-page">
          <h1>Your Cart</h1>
          <div className="empty-cart-content">
            <h2>Your cart is empty</h2>
            <p>Add some delicious pies to get started!</p>
            <a href="/" className="btn-primary">
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="cart-page">
        <div className="cart-page-header">
          <h1>Your Cart</h1>
          <button 
            className="btn-secondary"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>

        <div className="cart-page-content">
          <div className="cart-items-list">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Items ({cart.totalQuantity}):</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-primary checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
