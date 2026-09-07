(function () {
  const page = document.getElementById('cartPage');
  
  // Guard clause: stop execution if page element doesn't exist
  if (!page) return;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('dd_cart')) || {};
    } catch (e) {
      return {};
    }
  }

  function getProducts() {
    try {
      return JSON.parse(localStorage.getItem('dd_products')) || [];
    } catch (e) {
      return [];
    }
  }

  function renderCart() {
    const cart = getCart();
    const products = getProducts();
    const cartKeys = Object.keys(cart);

    page.innerHTML = '';

    if (cartKeys.length === 0) {
      page.innerHTML = '<div class="section-card">Cart is empty</div>';
      return;
    }

    let total = 0;

    cartKeys.forEach(k => {
      const it = cart[k];
      const p = products.find(x => String(x.id) === String(it.id));

      // Handle missing or deleted product gracefully
      if (!p) return;

      const price = Number(p.price) || 0;
      const qty = Number(it.qty) || 1;
      total += price * qty;

      const el = document.createElement('div');
      el.className = 'section-card';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px">
          <div>
            <strong>${p.title || 'Unknown Item'}</strong>
            <div class="muted">${p.shop || ''}</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <div>₹${price} × ${qty}</div>
            <button class="btn review-btn" data-id="${p.id}">Review</button>
            <button class="btn remove-btn" data-id="${p.id}">Remove</button>
          </div>
        </div>`;
      
      page.appendChild(el);
    });

    const totalEl = document.createElement('div');
    totalEl.className = 'section-card';
    totalEl.innerHTML = `<strong>Total ₹${total}</strong>`;
    page.appendChild(totalEl);

    bindEvents();
  }

  function bindEvents() {
    // Remove button functionality
    page.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const cart = getCart();
        delete cart[id];
        localStorage.setItem('dd_cart', JSON.stringify(cart));
        renderCart();
      });
    });

    // Review button functionality
    page.querySelectorAll('.review-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        localStorage.setItem('desi_review_id', id);
        window.location.href = 'review.html';
      });
    });
  }

  renderCart();
})();