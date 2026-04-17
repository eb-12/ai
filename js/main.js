/* ========================================
   Shared UI — Navigation, Mobile Menu, Active Links
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Header scroll effect --- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* --- Scroll reveal --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* --- Animated stat counters --- */
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1400;
          const frameRate = 16;
          const steps = duration / frameRate;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current);
          }, frameRate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* --- Mobile hamburger toggle --- */
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger-btn');
  if (hamburger && header) {
    hamburger.addEventListener('click', () => {
      header.classList.toggle('nav-open');
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
      });
    });
  }

  /* --- Active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Quantity selectors (used on product page and cart page) --- */
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    const input = selector.querySelector('input');
    const minusBtn = selector.querySelector('[data-qty="minus"]');
    const plusBtn = selector.querySelector('[data-qty="plus"]');

    if (!input || !minusBtn || !plusBtn) return;

    minusBtn.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > 1) {
        input.value = val - 1;
        input.dispatchEvent(new Event('change'));
      }
    });

    plusBtn.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val < 99) {
        input.value = val + 1;
        input.dispatchEvent(new Event('change'));
      }
    });

    input.addEventListener('change', () => {
      let val = parseInt(input.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      input.value = val;
    });
  });

  /* --- Product page: Add to Cart --- */
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const qtyInput = document.getElementById('product-qty');
      const qty = parseInt(qtyInput?.value) || 1;
      Cart.addItem(qty);

      // Visual feedback
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = 'Added!';
      addToCartBtn.classList.add('btn-added');

      // Bump badge animation
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        badge.classList.remove('bump');
        void badge.offsetWidth; // force reflow
        badge.classList.add('bump');
      }

      setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.classList.remove('btn-added');
      }, 1500);
    });
  }

  /* --- Contact form validation --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

      // Validate required fields
      ['name', 'email', 'message'].forEach(name => {
        const field = contactForm.querySelector(`[name="${name}"]`);
        if (!field || !field.value.trim()) {
          field.closest('.form-group').classList.add('has-error');
          valid = false;
        }
      });

      // Validate email format
      const emailField = contactForm.querySelector('[name="email"]');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          emailField.closest('.form-group').classList.add('has-error');
          valid = false;
        }
      }

      if (valid) {
        contactForm.style.display = 'none';
        document.getElementById('contact-success').classList.add('active');
      }
    });
  }

  /* --- Cart page rendering --- */
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSection = document.getElementById('cart-section');
  const checkoutSection = document.getElementById('checkout-section');

  if (cartItemsContainer) {
    renderCart();

    // Proceed to checkout
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        cartSection.style.display = 'none';
        checkoutSection.classList.add('active');
        window.scrollTo(0, 0);
        renderCheckoutSummary();
      });
    }

    // Back to cart
    const backBtn = document.getElementById('back-to-cart-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        checkoutSection.classList.remove('active');
        cartSection.style.display = 'block';
        renderCart();
      });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        checkoutForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

        ['fullname', 'email', 'address', 'city', 'postcode'].forEach(name => {
          const field = checkoutForm.querySelector(`[name="${name}"]`);
          if (!field || !field.value.trim()) {
            field.closest('.form-group').classList.add('has-error');
            valid = false;
          }
        });

        const emailField = checkoutForm.querySelector('[name="email"]');
        if (emailField && emailField.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailField.value.trim())) {
            emailField.closest('.form-group').classList.add('has-error');
            valid = false;
          }
        }

        if (valid) {
          Cart.clear();
          const orderNum = 'LFT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          document.getElementById('order-number').textContent = orderNum;
          document.querySelector('.order-confirmation').classList.add('active');
        }
      });
    }
  }

  function renderCart() {
    const items = Cart.getItems();
    const emptyEl = document.getElementById('cart-empty');
    const filledEl = document.getElementById('cart-filled');

    if (items.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (filledEl) filledEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (filledEl) filledEl.style.display = 'block';

    cartItemsContainer.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke-linejoin="round"/></svg>
        </div>
        <div class="cart-item-name">
          ${item.name}
          <small>$${item.price.toFixed(2)} each</small>
        </div>
        <div class="quantity-selector">
          <button type="button" data-qty="minus" data-item-id="${item.id}">&minus;</button>
          <input type="number" value="${item.quantity}" min="1" max="99" data-item-id="${item.id}">
          <button type="button" data-qty="plus" data-item-id="${item.id}">&plus;</button>
        </div>
        <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="cart-item-remove" data-item-id="${item.id}" aria-label="Remove item">&times;</button>
      </div>
    `).join('');

    // Bind cart item events
    cartItemsContainer.querySelectorAll('[data-qty="minus"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        const item = Cart.getItems().find(i => i.id === id);
        if (item && item.quantity > 1) {
          Cart.updateQuantity(id, item.quantity - 1);
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('[data-qty="plus"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        const item = Cart.getItems().find(i => i.id === id);
        if (item) {
          Cart.updateQuantity(id, item.quantity + 1);
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.removeItem(btn.dataset.itemId);
        renderCart();
      });
    });

    // Update summary
    updateOrderSummary();
  }

  function updateOrderSummary() {
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = '$' + Cart.getSubtotal().toFixed(2);
    if (shippingEl) {
      const shipping = Cart.getShipping();
      shippingEl.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
    }
    if (totalEl) totalEl.textContent = '$' + Cart.getTotal().toFixed(2);
  }

  function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items-summary');
    if (!container) return;
    const items = Cart.getItems();
    container.innerHTML = items.map(item => `
      <div class="summary-row muted">
        <span>${item.name} &times; ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
    updateOrderSummary();
  }
});
