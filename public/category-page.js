// Category page JavaScript - handles individual category pages with search functionality
const apiBase = '/api';

/**
 * Gets the current category from the page URL
 * @returns {string} Category name (fruit, cheesecake, or seasonal)
 */
function getCurrentCategory() {
  const path = window.location.pathname;
  if (path.includes('fruit')) return 'fruit';
  if (path.includes('cheesecake')) return 'cheesecake';
  if (path.includes('seasonal')) return 'seasonal';
  return 'fruit'; // fallback
}

/**
 * Fetches pies for the current category
 * @param {string} category - Category to fetch
 * @returns {Promise<Array>} Array of pie objects
 */
async function fetchPies(category) {
  const url = new URL(`${apiBase}/pies`, location.origin);
  if (category) url.searchParams.set('category', category);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch pies');
  return res.json();
}

/**
 * Creates a pie card element
 * @param {Object} pie - Pie object with id, name, price, description, image
 * @returns {HTMLElement} Pie card element
 */
function createPieCard(pie) {
  const card = document.createElement('article');
  card.className = 'pie-card';

  const img = document.createElement('img');
  img.src = pie.image || '/images/placeholder.png';
  img.alt = pie.name;
  img.className = 'pie-image';

  const title = document.createElement('h3');
  title.textContent = pie.name;

  const desc = document.createElement('p');
  desc.textContent = pie.description || '';

  const price = document.createElement('div');
  price.className = 'price';
  price.textContent = `$${pie.price.toFixed(2)}`;

  const add = document.createElement('button');
  add.textContent = 'Add to Cart';
  add.className = 'btn-primary';
  add.onclick = () => addToCart(pie);

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(price);
  card.appendChild(add);

  return card;
}

/**
 * Renders pies in the grid container
 * @param {Array} pies - Array of pie objects to render
 */
function renderPies(pies) {
  const container = document.getElementById('pies');
  container.innerHTML = '';
  pies.forEach(pie => container.appendChild(createPieCard(pie)));
}

// Cart functionality using cartStorage module
function addToCart(pie) {
  const success = window.cartStorage?.addToCart(pie);
  if (success) {
    updateCartUI();
  }
}

function removeFromCart(id) {
  const success = window.cartStorage?.removeFromCart(id);
  if (success) {
    updateCartUI();
  }
}

function clearCart() {
  const success = window.cartStorage?.clearCart();
  if (success) {
    updateCartUI();
  }
}

/**
 * Updates the cart count display in the header
 * @param {number} count - Total number of items in cart
 */
function updateCartCount(count) {
  document.getElementById('cart-count').textContent = count;
}

/**
 * Creates a cart item row element
 * @param {Object} item - Cart item with id, name, price, and quantity
 * @returns {HTMLElement} Cart row element
 */
function createCartItemRow(item) {
  const row = document.createElement('div');
  row.className = 'cart-row';

  const itemTotal = (item.price * item.quantity).toFixed(2);
  row.innerHTML = `
    <div class="cart-row-left">
      <strong>${item.name}</strong> x ${item.quantity}
    </div>
    <div class="cart-row-right">
      $${itemTotal} 
      <button class="cart-remove" data-id="${item.id}">Remove</button>
    </div>
  `;

  return row;
}

/**
 * Renders all cart items in the cart container
 * @param {Array} items - Array of cart items
 * @returns {number} Total price of all items
 */
function renderCartItems(items) {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';

  let total = 0;

  items.forEach(item => {
    const row = createCartItemRow(item);
    cartContainer.appendChild(row);
    total += item.price * item.quantity;
  });

  return total;
}

/**
 * Updates the cart total display
 * @param {number} total - Total price to display
 */
function updateCartTotal(total) {
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

/**
 * Attaches event listeners to all remove buttons in the cart
 */
function attachRemoveButtonListeners() {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      removeFromCart(e.currentTarget.dataset.id);
    });
  });
}

/**
 * Updates the entire cart UI including count, items, total, and event listeners
 */
function updateCartUI() {
  const items = window.cartStorage?.getCart() || [];

  // Update cart count in header
  const totalQuantity = window.cartStorage?.getCartQuantity() || 0;
  updateCartCount(totalQuantity);

  // Render cart items and calculate total
  const totalPrice = renderCartItems(items);
  updateCartTotal(totalPrice);

  // Attach event listeners to remove buttons
  attachRemoveButtonListeners();
}

// Search functionality
/**
 * Safely gets search input value with fallback
 * @returns {string} Trimmed search query in lowercase
 */
function getSearchQuery() {
  const searchElement = document.getElementById('search');
  return searchElement?.value?.trim()?.toLowerCase() || '';
}

/**
 * Checks if a pie matches the search query
 * @param {Object} pie - Pie object with name and description
 * @param {string} query - Search query in lowercase
 * @returns {boolean} True if pie matches search criteria
 */
function matchesSearchQuery(pie, query) {
  if (!query) return true;

  const name = pie.name?.toLowerCase() || '';
  const description = pie.description?.toLowerCase() || '';

  return name.includes(query) || description.includes(query);
}

/**
 * Applies search filter to pies array
 * @param {Array} pies - Array of pie objects to filter
 * @returns {Array} Filtered array of pies
 */
function applySearchFilter(pies) {
  // Validate input
  if (!Array.isArray(pies)) {
    console.warn('applySearchFilter: Invalid pies array provided');
    return [];
  }

  const searchQuery = getSearchQuery();
  return pies.filter(pie => matchesSearchQuery(pie, searchQuery));
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const category = getCurrentCategory();
    updateCartUI();

    // Fetch and render pies for this category
    const pies = await fetchPies(category);
    renderPies(pies);

    // Set up search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const filteredPies = applySearchFilter(pies);
        renderPies(filteredPies);
      });
    }

    // Cart functionality
    document.getElementById('cart-toggle')?.addEventListener('click', () => {
      document.getElementById('cart')?.classList.toggle('hidden');
    });

    document.getElementById('cart-clear')?.addEventListener('click', clearCart);

    // Optional: initialize Kendo widgets if available
    if (window.kendo && window.$) {
      $('#search').kendoTextBox?.();
    }
  } catch (err) {
    console.error('Failed to load category page:', err);
    const container = document.getElementById('pies');
    if (container) {
      container.textContent = 'Failed to load pies. Please try again later.';
    }
  }
});
