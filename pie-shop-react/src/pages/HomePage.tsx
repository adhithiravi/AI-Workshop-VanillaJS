/**
 * HomePage Component - React version of index.html
 * Displays hero carousel, monthly pies, and category links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';
import { useMonthlyPies } from '../hooks/usePies';
import PieCard from '../components/PieCard/PieCard';
import Hero from   '../components/Hero/Hero';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { addToCart } = useCartContext();
  const { pies: monthlyPies, loading, error } = useMonthlyPies();

  const handleAddToCart = (pie: any) => {
    addToCart(pie);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Failed to load pies of the month</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="container">
      <Hero />
      
      <section id="featured" className="featured">
        <h2>Pies of the Month</h2>
        <div className="pies-grid">
          {monthlyPies.map((pie: any) => (
            <PieCard 
              key={pie.id} 
              pie={pie} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      <section className="shop-cta">
        <h2>Shop by Category</h2>
        <div className="category-links">
          <Link to="/fruit" className="category-link">
            <h3>Fruit Pies</h3>
            <p>Fresh, seasonal fruit pies</p>
          </Link>
          <Link to="/cheesecake" className="category-link">
            <h3>Cheesecakes</h3>
            <p>Rich, creamy cheesecakes</p>
          </Link>
          <Link to="/seasonal" className="category-link">
            <h3>Seasonal</h3>
            <p>Holiday favorites</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
