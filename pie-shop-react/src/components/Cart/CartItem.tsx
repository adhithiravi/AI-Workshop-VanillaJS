/**
 * CartItem Component - Individual cart item display
 * Shows item details and quantity controls
 */

import React from 'react';
import { CartItemProps } from '../../types/pie';
import { useCartContext } from '../../contexts/CartContext';

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const { removeFromCart, updateQuantity } = useCartContext();

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item-left">
        <strong>{item.name}</strong>
        <div className="cart-item-price">${item.price.toFixed(2)} each</div>
      </div>
      
      <div className="cart-item-right">
        <div className="cart-item-quantity">
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <div className="cart-item-total">${itemTotal}</div>
        
        <button 
          className="cart-remove"
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
