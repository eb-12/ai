/* ========================================
   Cart State Management
   Persists to localStorage, used across all pages
   ======================================== */

const PRODUCT = {
  id: 'liftit-pro-rear-stand',
  name: 'Lift It Pro Rear Wheel Stand',
  price: 149.99,
  description: 'Professional-grade rear wheel motorcycle stand with adjustable height and universal spool adapters.'
};

const STORAGE_KEY = 'liftItCart';
const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 14.99;

const Cart = {
  _listeners: [],

  _save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this._notify();
  },

  _notify() {
    this._listeners.forEach(fn => fn());
  },

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  addItem(quantity) {
    const items = this.getItems();
    const existing = items.find(i => i.id === PRODUCT.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: PRODUCT.id,
        name: PRODUCT.name,
        price: PRODUCT.price,
        quantity: quantity
      });
    }
    this._save(items);
  },

  updateQuantity(id, newQty) {
    let items = this.getItems();
    if (newQty <= 0) {
      items = items.filter(i => i.id !== id);
    } else {
      const item = items.find(i => i.id === id);
      if (item) item.quantity = newQty;
    }
    this._save(items);
  },

  removeItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    this._save(items);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },

  getShipping() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  },

  getTotal() {
    return this.getSubtotal() + this.getShipping();
  },

  getItemCount() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  },

  onChange(callback) {
    this._listeners.push(callback);
  }
};

/* Update cart badge on every page load */
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const count = Cart.getItemCount();
  badge.textContent = count;
  if (count === 0) {
    badge.classList.add('hidden');
  } else {
    badge.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
Cart.onChange(updateCartBadge);
