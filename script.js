// script.js — Neon Grill
(() => {
  const menuItems = [
    {
      id: 'm1',
      name: 'Signature Burger',
      price: 120,
      image: 'signature-burger.jpg',
      category: 'main',
      desc: 'Beef patty, neon sauce, fries'
    },
    {
      id: 'm2',
      name: 'Neon Veggie',
      price: 110,
      image: 'neon-veggie.jpg',
      category: 'main',
      desc: 'Grilled veggies, vegan bun'
    },
    {
      id: 'm3',
      name: 'Street Fries',
      price: 45,
      image: 'street-fries.jpg',
      category: 'side',
      desc: 'Double-fried, salted'
    },
    {
      id: 'm4',
      name: 'Arcade Shake',
      price: 65,
      image: 'arcade-shake.jpg',
      category: 'drink',
      desc: 'Vanilla neon swirl'
    },
    {
      id: 'm5',
      name: 'Glowing Nachos',
      price: 75,
      image: 'glowing-nachos.jpg',
      category: 'side',
      desc: 'Cheesy, with pico'
    },
    {
      id: 'm6',
      name: 'Midnight Hotdog',
      price: 85,
      image: 'midnight-hotdog.jpg',
      category: 'main',
      desc: 'Loaded with neon relish'
    },
    {
      id: 'm7',
      name: 'Pixel Pancakes',
      price: 55,
      image: 'pixel-pancakes.jpg',
      category: 'dessert',
      desc: 'Sweet stack with syrup'
    },
    {
      id: 'm8',
      name: 'Fizzy Pop',
      price: 35,
      image: 'fizzy-pop.jpg',
      category: 'drink',
      desc: 'Soda with neon ice'
    },
    {
      id: 'm9',
      name: 'Choco Bomb',
      price: 50,
      image: 'choco-bomb.jpg',
      category: 'dessert',
      desc: 'Chocolate lava mini'
    },
    {
      id: 'm10',
      name: 'Neo Salad',
      price: 95,
      image: 'neo-salad.jpg',
      category: 'main',
      desc: 'Fresh greens, neon dressing'
    },
    {
      id: 'm11',
      name: 'Spicy Dragon Burger',
      price: 130,
      image: 'spicy-dragon-burger.jpg',
      category: 'main',
      desc: 'Jalapeño, ghost pepper, fire sauce'
    },
    {
      id: 'm12',
      name: 'Cyber Fries',
      price: 55,
      image: 'cyber-fries.jpg',
      category: 'side',
      desc: 'Truffle oil & parmesan'
    },
    {
      id: 'm13',
      name: 'Neon Milkshake',
      price: 75,
      image: 'neon-milkshake.jpg',
      category: 'drink',
      desc: 'Strawberry & mint neon blend'
    },
    {
      id: 'm14',
      name: 'Arcade Onion Rings',
      price: 65,
      image: 'arcade-onion-rings.jpg',
      category: 'side',
      desc: 'Crispy golden rings'
    },
    {
      id: 'm15',
      name: 'Future Pie',
      price: 60,
      image: 'future-pie.jpg',
      category: 'dessert',
      desc: 'Apple pie with neon glaze'
    }
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

  const money = (number) => `$${number.toFixed(2)}`;

  const saveCart = () => {
    try {
      localStorage.setItem('neon_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Could not save cart:', error);
    }
  };

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('neon_cart');
      cart = savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      cart = {};
    }
  };

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  function renderMenu(filter = 'all') {
    if (!menuGrid) return;

    menuGrid.innerHTML = '';

    const items = filter === 'all'
      ? menuItems
      : menuItems.filter(item => item.category === filter);

    if (items.length === 0) {
      menuGrid.innerHTML =
        '<div class="card" style="padding:20px">No items in this category.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement('article');

      card.className = 'menu-card';
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="food-art">
          <img
            src="${item.image}"
            alt="${escapeHtml(item.name)}"
            style="width:100%; height:100%; object-fit:cover; border-radius:16px;"
          >
        </div>

        <div class="menu-info">
          <div class="menu-top">
            <h3>${escapeHtml(item.name)}</h3>
            <div class="menu-price">${money(item.price)}</div>
          </div>

          <p>${escapeHtml(item.desc)}</p>

          <div class="menu-bottom">
            <div class="category">${escapeHtml(item.category)}</div>

            <div class="qty">
              <button
                class="btn-decrease"
                aria-label="Decrease quantity for ${escapeHtml(item.name)}"
              >
                −
              </button>

              <input
                class="qty-input"
                type="text"
                value="${cart[item.id] || 0}"
                aria-label="Quantity for ${escapeHtml(item.name)}"
              >

              <button
                class="btn-increase"
                aria-label="Increase quantity for ${escapeHtml(item.name)}"
              >
                +
              </button>

              <button
                class="btn-add btn primary"
                style="margin-left:8px"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      `;

      fragment.appendChild(card);
    });

    menuGrid.appendChild(fragment);
  }

  function renderCart() {
    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = '';

    const ids = Object.keys(cart);

    if (ids.length === 0) {
      cartItemsEl.innerHTML =
        '<div class="cart-empty">Your cart is empty.</div>';

      if (cartCountEl) cartCountEl.textContent = '0';
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (serviceEl) serviceEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';

      return;
    }

    const fragment = document.createDocumentFragment();
    let subtotal = 0;

    ids.forEach((id) => {
      const quantity = cart[id];
      const item = menuItems.find(menuItem => menuItem.id === id);

      if (!item) return;

      const row = document.createElement('div');
      const left = document.createElement('div');
      const right = document.createElement('div');

      row.className = 'cart-item';

      left.innerHTML = `
        <strong>${escapeHtml(item.name)}</strong>
        <small>${money(item.price)} · ${quantity} ×</small>
      `;

      right.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <button
            class="btn-decrease-cart"
            data-id="${id}"
            aria-label="Decrease ${escapeHtml(item.name)}"
          >
            −
          </button>

          <span style="min-width:28px; text-align:center">
            ${quantity}
          </span>

          <button
            class="btn-increase-cart"
            data-id="${id}"
            aria-label="Increase ${escapeHtml(item.name)}"
          >
            +
          </button>

          <button
            class="btn-remove-cart"
            data-id="${id}"
            aria-label="Remove ${escapeHtml(item.name)}"
            style="margin-left:8px"
          >
            Remove
          </button>
        </div>
      `;

      row.appendChild(left);
      row.appendChild(right);
      fragment.appendChild(row);

      subtotal += item.price * quantity;
    });

    cartItemsEl.appendChild(fragment);

    const totalProducts = ids.reduce(
      (total, id) => total + cart[id],
      0
    );

    const service = subtotal * 0.05;
    const total = subtotal + service;

    if (cartCountEl) cartCountEl.textContent = totalProducts;
    if (subtotalEl) subtotalEl.textContent = money(subtotal);
    if (serviceEl) serviceEl.textContent = money(service);
    if (totalEl) totalEl.textContent = money(total);
  }

  function syncMenuQuantities() {
    document.querySelectorAll('.menu-card').forEach((card) => {
      const id = card.dataset.id;
      const quantityInput = card.querySelector('.qty-input');

      if (quantityInput) {
        quantityInput.value = cart[id] || 0;
      }
    });
  }

  function addToCart(id, amount = 1) {
    if (!cart[id]) {
      cart[id] = 0;
    }

    cart[id] = Math.max(0, cart[id] + amount);

    if (cart[id] === 0) {
      delete cart[id];
    }

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

  function openCart() {
    if (!cartEl || !overlay) return;

    cartEl.classList.add('open');
    cartEl.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
  }

  function closeCart() {
    if (!cartEl || !overlay) return;

    cartEl.classList.remove('open');
    cartEl.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
  }

  function bindEvents() {
    if (filtersEl) {
      filtersEl.addEventListener('click', (event) => {
        const button = event.target.closest('.filter');

        if (!button) return;

        const filter = button.dataset.filter || 'all';

        filtersEl.querySelectorAll('.filter').forEach((filterButton) => {
          filterButton.classList.toggle(
            'active',
            filterButton === button
          );
        });

        renderMenu(filter);
      });
    }

    if (menuGrid) {
      menuGrid.addEventListener('click', (event) => {
        const increaseButton = event.target.closest('.btn-increase');
        const decreaseButton = event.target.closest('.btn-decrease');
        const addButton = event.target.closest('.btn-add');
        const card = event.target.closest('.menu-card');

        if (!card) return;

        const id = card.dataset.id;
        const quantityInput = card.querySelector('.qty-input');

        if (!quantityInput) return;

        if (increaseButton) {
          quantityInput.value =
            parseInt(quantityInput.value || '0', 10) + 1;
        } else if (decreaseButton) {
          quantityInput.value = Math.max(
            0,
            parseInt(quantityInput.value || '0', 10) - 1
          );
        } else if (addButton) {
          const quantity =
            parseInt(quantityInput.value || '0', 10) || 1;

          addToCart(id, quantity);
        }
      });

      menuGrid.addEventListener('change', (event) => {
        const input = event.target.closest('.qty-input');

        if (!input) return;

        const card = input.closest('.menu-card');
        const id = card.dataset.id;

        const quantity = Math.max(
          0,
          parseInt(input.value || '0', 10) || 0
        );

        if (quantity > 0) {
          cart[id] = quantity;
        } else {
          delete cart[id];
        }

        saveCart();
        renderCart();
        syncMenuQuantities();
      });
    }

    if (cartBtn) {
      cartBtn.addEventListener('click', openCart);
    }

    if (overlay) {
      overlay.addEventListener('click', closeCart);
    }

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', closeCart);
    }

    if (cartItemsEl) {
      cartItemsEl.addEventListener('click', (event) => {
        const increaseButton =
          event.target.closest('.btn-increase-cart');

        const decreaseButton =
          event.target.closest('.btn-decrease-cart');

        const removeButton =
          event.target.closest('.btn-remove-cart');

        if (increaseButton) {
          addToCart(increaseButton.dataset.id, 1);
        } else if (decreaseButton) {
          addToCart(decreaseButton.dataset.id, -1);
        } else if (removeButton) {
          removeFromCart(removeButton.dataset.id);
        }
      });
    }

    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        cart = {};
        saveCart();
        renderCart();
        syncMenuQuantities();
        closeCart();
      });
    }

    if (confirmOrderBtn) {
      confirmOrderBtn.addEventListener('click', () => {
        if (modal) {
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        }

        cart = {};
        saveCart();
        renderCart();
        syncMenuQuantities();
        closeCart();
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        if (!modal) return;

        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
      } else if (cartEl && cartEl.classList.contains('open')) {
        closeCart();
      }
    });
  }

  function init() {
    loadCart();
    renderMenu('all');
    renderCart();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
