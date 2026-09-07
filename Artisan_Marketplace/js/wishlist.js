(function(){
  // Centralize storage keys
  const STORAGE = {
    PRODUCTS: 'dd_products',
    CART: 'dd_cart',
    WISHLIST: 'dd_wishlist'
  };

  const page = document.getElementById('wishlistPage');
  
  // Prevent crash if script loads on a different page
  if (!page) return;

  // Helper: Escape HTML to prevent XSS
  const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  ) : '';

  // Helper: Sync navigation cart numbers
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || '{}');
    const total = Object.values(cart).reduce((sum, item) => sum + (item.qty || 0), 0);
    document.querySelectorAll('#navCartCount, #navCartCount2, #navCartCount3')
      .forEach(el => el.textContent = total);
  }

  function renderWishlist() {
    const wishlist = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || '{}');
    const products = JSON.parse(localStorage.getItem(STORAGE.PRODUCTS) || '[]');
    const ids = Object.keys(wishlist);

    page.innerHTML = ''; // Clear current view

    if (ids.length === 0) { 
      page.innerHTML = '<div class="section-card">No wishlist items yet.</div>'; 
      return; 
    }

    let hasStaleItems = false;

    ids.forEach(id => {
      const p = products.find(x => x.id == id);
      
      // Self-Healing: If product no longer exists, skip it and mark for cleanup
      if (!p) {
        delete wishlist[id];
        hasStaleItems = true;
        return;
      }

      const safeTitle = escapeHTML(p.title);
      const safeShop = escapeHTML(p.shop || 'Independent Seller');

      const el = document.createElement('div'); 
      el.className = 'section-card';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${safeTitle}</strong>
            <div class="muted">${safeShop}</div>
          </div>
          <div>
            <button class="btn primary addFromWish" data-id="${p.id}">Add to cart</button>
            <button class="btn ghost remWish" data-id="${p.id}">Remove</button>
          </div>
        </div>
      `;
      page.appendChild(el);
    });

    // Clean storage if we found and removed orphaned IDs
    if (hasStaleItems) {
      localStorage.setItem(STORAGE.WISHLIST, JSON.stringify(wishlist));
      if (Object.keys(wishlist).length === 0) {
        page.innerHTML = '<div class="section-card">No wishlist items yet.</div>';
      }
    }
  }

  // EVENT DELEGATION: Single listener handles all clicks inside the container
  page.addEventListener('click', (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    
    if (!id) return;

    // Handle Add to Cart
    if (btn.classList.contains('addFromWish')) {
      const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || '{}');
      cart[id] = cart[id] || { id: +id, qty: 0 };
      cart[id].qty++;
      
      localStorage.setItem(STORAGE.CART, JSON.stringify(cart));
      updateCartUI(); // Update UI counters immediately
      alert('Added to cart');
    }

    // Handle Remove
    if (btn.classList.contains('remWish')) {
      const w = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || '{}');
      delete w[id];
      localStorage.setItem(STORAGE.WISHLIST, JSON.stringify(w));
      
      renderWishlist(); // Dynamically update UI without reloading the page
    }
  });

  // Initialize page
  renderWishlist();
  updateCartUI();
})();
