// cart-page.js - reads cart from localStorage and renders it on a standalone page
function getCart() { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; } }
function saveCart(items) { localStorage.setItem('cart', JSON.stringify(items)); renderCart(); }

function removeFromCart(id) { const items = getCart().filter(i => i.id !== id); saveCart(items); }
function clearCart() { saveCart([]); }

function renderCart() {
  const el = document.getElementById('cart-items');
  el.innerHTML = '';
  const items = getCart();
  let total = 0;
  if (items.length === 0) {
    el.textContent = 'Your cart is empty.';
  } else {
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `<div class="cart-row-left"><strong>${item.name}</strong> x ${item.quantity}</div><div class="cart-row-right">$${(item.price * item.quantity).toFixed(2)} <button class="cart-remove" data-id="${item.id}">Remove</button></div>`;
      el.appendChild(row);
      total += item.price * item.quantity;
    });
  }
  document.getElementById('cart-total').textContent = total.toFixed(2);
  el.querySelectorAll?.('.cart-remove')?.forEach(btn => btn.addEventListener('click', e => removeFromCart(e.currentTarget.dataset.id)));
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cart-clear').addEventListener('click', clearCart);
  renderCart();
});
