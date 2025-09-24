/**
 * Cart Storage Utility - TypeScript version of cartStorage.js
 * Provides centralized cart management with schema validation and type safety
 */

import { CartItem, Pie } from '../types/pie';

class CartStorage {
  private readonly CART_KEY = 'cart';

  /**
   * Cart item schema validation
   * @param item - Item to validate
   * @returns True if item is valid
   */
  private isValidCartItem(item: any): item is CartItem {
    if (!item || typeof item !== 'object') return false;

    const requiredFields = ['id', 'name', 'price', 'quantity'];
    return requiredFields.every(field =>
      field in item &&
      (field === 'quantity' ? Number.isInteger(item[field]) && item[field] > 0 : true) &&
      (field === 'price' ? typeof item[field] === 'number' && item[field] >= 0 : true) &&
      (field === 'id' || field === 'name' ? typeof item[field] === 'string' && item[field].trim().length > 0 : true)
    );
  }

  /**
   * Cart schema validation
   * @param cart - Cart array to validate
   * @returns True if cart is valid
   */
  private isValidCart(cart: any): cart is CartItem[] {
    return Array.isArray(cart) && cart.every(this.isValidCartItem.bind(this));
  }

  /**
   * Sanitizes a cart item to ensure it meets schema requirements
   * @param item - Item to sanitize
   * @returns Sanitized item or null if invalid
   */
  private sanitizeCartItem(item: any): CartItem | null {
    if (!item || typeof item !== 'object') return null;

    const sanitized: CartItem = {
      id: String(item.id || '').trim(),
      name: String(item.name || '').trim(),
      price: Number(item.price) || 0,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    };

    return this.isValidCartItem(sanitized) ? sanitized : null;
  }

  /**
   * Safely retrieves cart from localStorage with validation
   * @returns Valid cart array (empty array if invalid/missing)
   */
  getCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!this.isValidCart(parsed)) {
        console.warn('cartStorage: Invalid cart data detected, resetting to empty cart');
        return [];
      }

      return parsed;
    } catch (error) {
      console.warn('cartStorage: Failed to parse cart data, resetting to empty cart:', error);
      return [];
    }
  }

  /**
   * Safely saves cart to localStorage with validation
   * @param items - Cart items to save
   * @returns True if save was successful
   */
  saveCart(items: CartItem[]): boolean {
    try {
      // Validate input
      if (!Array.isArray(items)) {
        console.warn('cartStorage: Invalid items array provided to saveCart');
        return false;
      }

      // Sanitize and filter valid items
      const validItems = items
        .map(item => this.sanitizeCartItem(item))
        .filter((item): item is CartItem => item !== null);

      // Save to localStorage
      localStorage.setItem(this.CART_KEY, JSON.stringify(validItems));
      return true;
    } catch (error) {
      console.error('cartStorage: Failed to save cart:', error);
      return false;
    }
  }

  /**
   * Adds an item to the cart with validation
   * @param pie - Pie object to add
   * @returns True if item was added successfully
   */
  addToCart(pie: Pie): boolean {
    if (!pie || typeof pie !== 'object') {
      console.warn('cartStorage: Invalid pie object provided to addToCart');
      return false;
    }

    const items = this.getCart();
    const existing = items.find(i => i.id === pie.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      const newItem = this.sanitizeCartItem({
        id: pie.id,
        name: pie.name,
        price: pie.price,
        quantity: 1
      });

      if (!newItem) {
        console.warn('cartStorage: Failed to create valid cart item from pie');
        return false;
      }

      items.push(newItem);
    }

    return this.saveCart(items);
  }

  /**
   * Removes an item from the cart by ID
   * @param id - Item ID to remove
   * @returns True if item was removed successfully
   */
  removeFromCart(id: string): boolean {
    if (!id || typeof id !== 'string') {
      console.warn('cartStorage: Invalid ID provided to removeFromCart');
      return false;
    }

    const items = this.getCart().filter(i => i.id !== id);
    return this.saveCart(items);
  }

  /**
   * Updates the quantity of an item in the cart
   * @param id - Item ID to update
   * @param quantity - New quantity
   * @returns True if item was updated successfully
   */
  updateQuantity(id: string, quantity: number): boolean {
    if (!id || typeof id !== 'string' || !Number.isInteger(quantity) || quantity < 0) {
      console.warn('cartStorage: Invalid parameters provided to updateQuantity');
      return false;
    }

    const items = this.getCart();
    const item = items.find(i => i.id === id);
    
    if (!item) {
      console.warn('cartStorage: Item not found in cart');
      return false;
    }

    if (quantity === 0) {
      return this.removeFromCart(id);
    }

    item.quantity = quantity;
    return this.saveCart(items);
  }

  /**
   * Clears the entire cart
   * @returns True if cart was cleared successfully
   */
  clearCart(): boolean {
    return this.saveCart([]);
  }

  /**
   * Gets the total quantity of items in the cart
   * @returns Total quantity
   */
  getCartQuantity(): number {
    const items = this.getCart();
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  /**
   * Gets the total price of items in the cart
   * @returns Total price
   */
  getCartTotal(): number {
    const items = this.getCart();
    return items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  }

  /**
   * Checks if an item is in the cart
   * @param id - Item ID to check
   * @returns True if item is in cart
   */
  isInCart(id: string): boolean {
    const items = this.getCart();
    return items.some(item => item.id === id);
  }
}

// Export singleton instance
export const cartStorage = new CartStorage();
export default cartStorage;
