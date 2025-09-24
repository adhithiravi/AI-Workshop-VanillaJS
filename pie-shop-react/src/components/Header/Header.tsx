/**
 * Header Component - Navigation and cart preview
 * Converts header HTML and cart functionality to React
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import Cart from '../Cart/Cart';
import './Header.css';

const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCartContext();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Link to="/" className="brand-link">
              <h1>Bethany's Pie Shop</h1>
              <p>Handmade pies, served with love.</p>
            </Link>
          </div>
          
          <nav className="top-nav">
            <Link to="/">Home</Link>
            <Link to="/fruit">Fruit Pies</Link>
            <Link to="/cheesecake">Cheesecakes</Link>
            <Link to="/seasonal">Seasonal</Link>
            <Link to="/cart">Cart</Link>
          </nav>
          
          <div className="cart-preview">
            <button 
              className="cart-toggle"
              onClick={toggleCart}
              aria-label={`Cart (${cart.totalQuantity} items)`}
            >
              Cart ({cart.totalQuantity})
            </button>
          </div>
        </div>
      </header>
      
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Header;
