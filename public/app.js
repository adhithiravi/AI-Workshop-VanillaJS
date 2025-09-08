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

// Simple cart implementation persisted in localStorage
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
}

function saveCart(items) {
  localStorage.setItem('cart', JSON.stringify(items));
  updateCartUI();
}

function addToCart(pie) {
  const items = getCart();
  const existing = items.find(i => i.id === pie.id);
  if (existing) existing.quantity += 1; else items.push({ ...pie, quantity: 1 });
  saveCart(items);
}

function removeFromCart(id) {
  const items = getCart().filter(i => i.id !== id);
  saveCart(items);
}

function clearCart() {
  saveCart([]);
}

function updateCartUI() {
  const items = getCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  document.getElementById('cart-count').textContent = count;

  const el = document.getElementById('cart-items');
  el.innerHTML = '';
  let total = 0;
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `<div class="cart-row-left"><strong>${item.name}</strong> x ${item.quantity}</div><div class="cart-row-right">$${(item.price * item.quantity).toFixed(2)} <button class="cart-remove" data-id="${item.id}">Remove</button></div>`;
    el.appendChild(row);
    total += item.price * item.quantity;
  });
  document.getElementById('cart-total').textContent = total.toFixed(2);

  // wire remove buttons
  el.querySelectorAll('.cart-remove').forEach(btn => btn.addEventListener('click', e => {
    removeFromCart(e.currentTarget.dataset.id);
  }));
}

// Filters
function applyFilters(pies) {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const category = (document.getElementById('categoryFilter').value || '').toLowerCase();
  return pies.filter(p => {
    const matchesQ = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    const matchesCategory = !category || p.category === category;
    return matchesQ && matchesCategory;
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

    const pies = await fetchPies();
    renderPies(pies);

    const monthly = await fetchMonthly();
    renderMonthly(monthly);

    // wire up filters
    document.getElementById('search').addEventListener('input', () => renderPies(applyFilters(pies)));
    document.getElementById('categoryFilter').addEventListener('change', async (e) => {
      const cat = e.target.value.toLowerCase();
      const filtered = await fetchPies(cat || undefined);
      renderPies(filtered);
    });

    // cart toggle
    document.getElementById('cart-toggle').addEventListener('click', () => document.getElementById('cart').classList.toggle('hidden'));
    document.getElementById('cart-clear').addEventListener('click', clearCart);

    // optional: initialize Kendo widgets if available
    if (window.kendo && window.$) {
      $('#categoryFilter').kendoDropDownList();
      $('#search').kendoTextBox?.();
    }
  } catch (err) {
    console.error(err);
    document.getElementById('pies').textContent = 'Failed to load pies.';
  }
});
