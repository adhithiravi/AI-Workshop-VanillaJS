/**
 * Cart Storage Module
 * Provides centralized cart management with schema validation and nullish guards
 */

/**
 * Cart item schema validation
 * @param {any} item - Item to validate
 * @returns {boolean} True if item is valid
 */
function isValidCartItem(item) {
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
 * @param {any} cart - Cart array to validate
 * @returns {boolean} True if cart is valid
 */
function isValidCart(cart) {
  return Array.isArray(cart) && cart.every(isValidCartItem);
}

/**
 * Sanitizes a cart item to ensure it meets schema requirements
 * @param {any} item - Item to sanitize
 * @returns {Object|null} Sanitized item or null if invalid
 */
function sanitizeCartItem(item) {
  if (!item || typeof item !== 'object') return null;

  const sanitized = {
    id: String(item.id || '').trim(),
    name: String(item.name || '').trim(),
    price: Number(item.price) || 0,
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
  };

  return isValidCartItem(sanitized) ? sanitized : null;
}

/**
 * Safely retrieves cart from localStorage with validation
 * @returns {Array} Valid cart array (empty array if invalid/missing)
 */
function getCart() {
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!isValidCart(parsed)) {
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
 * @param {Array} items - Cart items to save
 * @returns {boolean} True if save was successful
 */
function saveCart(items) {
  try {
    // Validate input
    if (!Array.isArray(items)) {
      console.warn('cartStorage: Invalid items array provided to saveCart');
      return false;
    }

    // Sanitize and filter valid items
    const validItems = items
      .map(sanitizeCartItem)
      .filter(item => item !== null);

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(validItems));
    return true;
  } catch (error) {
    console.error('cartStorage: Failed to save cart:', error);
    return false;
  }
}

/**
 * Adds an item to the cart with validation
 * @param {Object} pie - Pie object to add
 * @returns {boolean} True if item was added successfully
 */
function addToCart(pie) {
  if (!pie || typeof pie !== 'object') {
    console.warn('cartStorage: Invalid pie object provided to addToCart');
    return false;
  }

  const items = getCart();
  const existing = items.find(i => i.id === pie.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    const newItem = sanitizeCartItem({
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

  return saveCart(items);
}

/**
 * Removes an item from the cart by ID
 * @param {string} id - Item ID to remove
 * @returns {boolean} True if item was removed successfully
 */
function removeFromCart(id) {
  if (!id || typeof id !== 'string') {
    console.warn('cartStorage: Invalid ID provided to removeFromCart');
    return false;
  }

  const items = getCart().filter(i => i.id !== id);
  return saveCart(items);
}

/**
 * Clears the entire cart
 * @returns {boolean} True if cart was cleared successfully
 */
function clearCart() {
  return saveCart([]);
}

/**
 * Gets the total quantity of items in the cart
 * @returns {number} Total quantity
 */
function getCartQuantity() {
  const items = getCart();
  return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

/**
 * Gets the total price of items in the cart
 * @returns {number} Total price
 */
function getCartTotal() {
  const items = getCart();
  return items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
}

// Export functions for use in other modules
window.cartStorage = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartQuantity,
  getCartTotal,
  isValidCartItem,
  isValidCart
};
