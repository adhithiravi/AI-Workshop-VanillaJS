/**
 * PieCard Component - React version of createPieCard function
 * Displays individual pie information with add to cart functionality
 */

import React from 'react';
import { PieCardProps } from '../../types/pie';
import './PieCard.css';

const PieCard: React.FC<PieCardProps> = ({ pie, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(pie);
  };

  return (
    <article className="pie-card">
      <img 
        src={pie.image || '/images/placeholder.png'} 
        alt={pie.name}
        className="pie-image"
      />
      <h3 className="pie-title">{pie.name}</h3>
      <p className="pie-description">{pie.description || ''}</p>
      <div className="pie-price">${pie.price.toFixed(2)}</div>
      <button 
        className="btn-primary pie-add-button"
        onClick={handleAddToCart}
        aria-label={`Add ${pie.name} to cart`}
      >
        Add to Cart
      </button>
    </article>
  );
};

export default PieCard;
