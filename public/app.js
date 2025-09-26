// Vanilla JS frontend with carousel, pies grid, and cart stored in localStorage
const apiBase = '/api';

async function fetchPies(category) {
  const url = new URL(`${apiBase}/pies`, location.origin);
  if (category) url.searchParams.set('category', category);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch pies');
  return res.json();
}

async function fetchMonthly() {
  const res = await fetch(`${apiBase}/pies-of-the-month`);
  if (!res.ok) throw new Error('Failed to fetch monthly pies');
  return res.json();
}

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

function renderPies(pies) {
  const container = document.getElementById('pies');
  container.innerHTML = '';
  pies.forEach(pie => container.appendChild(createPieCard(pie)));
}

function renderMonthly(pies) {
  const container = document.getElementById('monthly');
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

/**
 * Safely gets search input value with fallback
 * @returns {string} Trimmed search query in lowercase
 */
function getSearchQuery() {
  const searchElement = document.getElementById('search');
  return searchElement?.value?.trim()?.toLowerCase() || '';
}

/**
 * Safely gets category filter value with fallback
 * @returns {string} Category value in lowercase
 */
function getCategoryFilter() {
  const categoryElement = document.getElementById('categoryFilter');
  return categoryElement?.value?.trim()?.toLowerCase() || '';
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
 * Checks if a pie matches the category filter
 * @param {Object} pie - Pie object with category
 * @param {string} categoryFilter - Category filter in lowercase
 * @returns {boolean} True if pie matches category criteria
 */
function matchesCategoryFilter(pie, categoryFilter) {
  if (!categoryFilter) return true;

  const pieCategory = pie.category?.toLowerCase() || '';
  return pieCategory === categoryFilter;
}

/**
 * Applies search and category filters to pies array
 * @param {Array} pies - Array of pie objects to filter
 * @returns {Array} Filtered array of pies
 */
function applyFilters(pies) {
  // Validate input
  if (!Array.isArray(pies)) {
    console.warn('applyFilters: Invalid pies array provided');
    return [];
  }

  const searchQuery = getSearchQuery();
  const categoryFilter = getCategoryFilter();

  return pies.filter(pie => {
    const matchesSearch = matchesSearchQuery(pie, searchQuery);
    const matchesCategory = matchesCategoryFilter(pie, categoryFilter);
    return matchesSearch && matchesCategory;
  });
}

// Hero carousel
function initCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const indicators = document.getElementById('hero-indicators');
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = i === 0 ? 'active' : '';
    btn.dataset.index = i;
    btn.addEventListener('click', () => setSlide(i));
    indicators.appendChild(btn);
  });

  let idx = 0;
  let timer = setInterval(() => setSlide((idx + 1) % slides.length), 5000);

  function setSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
    indicators.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    indicators.querySelector(`button[data-index='${i}']`).classList.add('active');
    idx = i;
    clearInterval(timer);
    timer = setInterval(() => setSlide((idx + 1) % slides.length), 5000);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    initCarousel();
    updateCartUI();

    // Load only monthly pies for home page
    const monthly = await fetchMonthly();
    renderMonthly(monthly);

    // cart toggle
    document.getElementById('cart-toggle')?.addEventListener('click', () => {
      document.getElementById('cart')?.classList.toggle('hidden');
    });
    document.getElementById('cart-clear')?.addEventListener('click', clearCart);
  } catch (err) {
    console.error('Failed to load home page:', err);
    const container = document.getElementById('monthly');
    if (container) {
      container.textContent = 'Failed to load pies of the month.';
    }
  }
});
