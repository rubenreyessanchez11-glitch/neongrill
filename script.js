// script.js — Neon Grill: menu + cart interactivity
(() => {
  const menuItems = [
    { id: 'm1', name: 'Signature Burger', price: 120, emoji: '🍔', category: 'main', desc: 'Beef patty, neon sauce, fries' },
    { id: 'm2', name: 'Neon Veggie', price: 110, emoji: '🥗', category: 'main', desc: 'Grilled veggies, vegan bun' },
    { id: 'm3', name: 'Street Fries', price: 45, emoji: '🍟', category: 'side', desc: 'Double-fried, salted' },
    { id: 'm4', name: 'Arcade Shake', price: 65, emoji: '🥤', category: 'drink', desc: 'Vanilla neon swirl' },
    { id: 'm5', name: 'Glowing Nachos', price: 75, emoji: '🧀', category: 'side', desc: 'Cheesy, with pico' },
    { id: 'm6', name: 'Midnight Hotdog', price: 85, emoji: '🌭', category: 'main', desc: 'Loaded with neon relish' },
    { id: 'm7', name: 'Pixel Pancakes', price: 55, emoji: '🥞', category: 'dessert', desc: 'Sweet stack with syrup' },
    { id: 'm8', name: 'Fizzy Pop', price: 35, emoji: '🥤', category: 'drink', desc: 'Soda with neon ice' },
    { id: 'm9', name: 'Choco Bomb', price: 50, emoji: '🍫', category: 'dessert', desc: 'Chocolate lava mini' },
    { id: 'm10', name: 'Neo Salad', price: 95, emoji: '🥗', category: 'main', desc: 'Fresh greens, neon dressing' }
  ];

  const menuGrid = document.getElementById('menuGrid');
  const filtersEl = document.getElementById('filters');
  const cartBtn = document.getElementById('openCart');
  const cartEl = document.getElementById('cart');
  const overlay = document.getElementById('overlay');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('subtotal');
  const serviceEl = document.getElementById('service');
  const totalEl = document.getElementById('total');
  const clearCartBtn = document.getElementById('clearCart');
  const confirmOrderBtn = document.getElementById('confirmOrder');
  const closeCartBtn = document.getElementById('closeCart');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');

  let cart = {};

  const money = (n) => `$${n.toFixed(2)}`;
  const saveCart = () => {
    try { localStorage.setItem('neon_cart', JSON.stringify(cart)); } catch (e) {}
  };
  const loadCart = () => {
    try {
      const raw = localStorage.getItem('neon_cart');
      cart = raw ? JSON.parse(raw) : {};
    } catch (e) { cart = {}; }
  };

  function escapeHtml(str) {
    return ('' + str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function renderMenu(filter = 'all') {
    menuGrid.innerHTML = '';
    const items = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);
    if (items.length === 0) {
      menuGrid.innerHTML = '<div class="card" style="padding:20px">No items in this category.</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="food-art" aria-hidden="true">
          <div class="food-emoji">${item.emoji}</div>
        </div>
        <div class="menu-info">
          <div class="menu-top">
            <h3>${item.name}</h3>
            <div class="menu-price">${money(item.price)}</div>
          </div>
          <p>${escapeHtml(item.desc || '')}</p>
          <div class="menu-bottom">
            <div class="category">${item.category}</div>
            <div class="qty">
              <button class="btn-decrease" aria-label="Decrease quantity for ${escapeHtml(item.name)}">−</button>
              <input class="qty-input" type="text" value="${cart[item.id] || 0}" aria-label="Quantity for ${escapeHtml(item.name)}" />
              <button class="btn-increase" aria-label="Increase quantity for ${escapeHtml(item.name)}">+</button>
              <button class="btn-add btn primary" style="margin-left:8px">Add</button>
            </div>
          </div>
        </div>
      `;
      frag.appendChild(card);
    });
    menuGrid.appendChild(frag);
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';
    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartItemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
      cartCountEl.textContent = '0';
      subtotalEl.textContent = '$0';
      serviceEl.textContent = '$0';
      totalEl.textContent = '$0';
      return;
    }
    const frag = document.createDocumentFragment();
    let subtotal = 0;
    ids.forEach(id => {
      const qty = cart[id];
      const item = menuItems.find(m => m.id === id);
      if (!item) return;
      const row = document.createElement('div');
      row.className = 'cart-item';
      const left = document.createElement('div');
      left.innerHTML = `<strong>${item.name}</strong><small>${item.emoji} ${money(item.price)} · ${qty} ×</small>`;
      const right = document.createElement('div');
      right.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="btn-decrease-cart" data-id="${id}" aria-label="Decrease ${escapeHtml(item.name)}">−</button>
          <span style="min-width:28px;text-align:center">${qty}</span>
          <button class="btn-increase-cart" data-id="${id}" aria-label="Increase ${escapeHtml(item.name)}">+</button>
          <button class="btn-remove-cart" data-id="${id}" aria-label="Remove ${escapeHtml(item.name)}" style="margin-left:8px">Remove</button>
        </div>
      `;
      row.appendChild(left);
      row.appendChild(right);
      frag.appendChild(row);
      subtotal += item.price * qty;
    });
    cartItemsEl.appendChild(frag);
    cartCountEl.textContent = ids.reduce((s, id) => s + cart[id], 0);
    subtotalEl.textContent = money(subtotal);
    const service = +(subtotal * 0.05);
    serviceEl.textContent = money(service);
    totalEl.textContent = money(subtotal + service);
  }

  function syncMenuQuantities() {
    document.querySelectorAll('.menu-card').forEach(card => {
      const id = card.dataset.id;
      const qtyInput = card.querySelector('.qty-input');
      if (qtyInput) qtyInput.value = cart[id] || 0;
    });
  }

  function addToCart(id, amount = 1) {
    if (!cart[id]) cart[id] = 0;
    cart[id] = Math.max(0, cart[id] + amount);
    if (cart[id] === 0) delete cart[id];
    saveCart();
    renderCart();
    syncMenuQuantities();
  }

  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    renderCart();
    syncMenuQuantities();
  }

  function bindEvents() {
    filtersEl.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.filter');
      if (!btn) return;
      const filter = btn.dataset.filter || 'all';
      filtersEl.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
      renderMenu(filter);
    });

    menuGrid.addEventListener('click', (ev) => {
      const inc = ev.target.closest('.btn-increase');
      const dec = ev.target.closest('.btn-decrease');
      const add = ev.target.closest('.btn-add');
      const card = ev.target.closest('.menu-card');
      if (!card) return;
      const id = card.dataset.id;
      const qtyInput = card.querySelector('.qty-input');
      if (inc) {
        qtyInput.value = parseInt(qtyInput.value || '0', 10) + 1;
      } else if (dec) {
        qtyInput.value = Math.max(0, parseInt(qtyInput.value || '0', 10) - 1);
      } else if (add) {
        const v = parseInt(qtyInput.value || '0', 10) || 1;
        addToCart(id, v);
      }
    });

    menuGrid.addEventListener('change', (ev) => {
      const input = ev.target.closest('.qty-input');
      if (!input) return;
      const card = input.closest('.menu-card');
      const id = card.dataset.id;
      const v = Math.max(0, parseInt(input.value || '0', 10) || 0);
      if (v > 0) {
        cart[id] = v;
        saveCart();
        renderCart();
      }
    });

    cartBtn.addEventListener('click', () => openCart());
    overlay.addEventListener('click', () => closeCart());
    closeCartBtn && closeCartBtn.addEventListener('click', () => closeCart());

    cartItemsEl.addEventListener('click', (ev) => {
      const inc = ev.target.closest('.btn-increase-cart');
      const dec = ev.target.closest('.btn-decrease-cart');
      const rem = ev.target.closest('.btn-remove-cart');
      if (inc) addToCart(inc.dataset.id, +1);
      else if (dec) addToCart(dec.dataset.id, -1);
      else if (rem) removeFromCart(rem.dataset.id);
    });

    clearCartBtn && clearCartBtn.addEventListener('click', () => {
      cart = {};
      saveCart();
      renderCart();
      closeCart();
    });

    confirmOrderBtn && confirmOrderBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      }
      cart = {};
      saveCart();
      renderCart();
      closeCart();
    });

    closeModalBtn && closeModalBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (modal && modal.classList.contains('show')) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
        } else if (cartEl && cartEl.classList.contains('open')) closeCart();
      }
    });
  }

  function openCart() {
    cartEl.classList.add('open');
    cartEl.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
  }

  function closeCart() {
    cartEl.classList.remove('open');
    cartEl.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
  }

  function init() {
    loadCart();
    renderMenu('all');
    renderCart();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
