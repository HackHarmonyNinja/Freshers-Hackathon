document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openAddProduct');
  const viewBtn = document.getElementById('viewMyProducts');
  const main = document.getElementById('sellerContent');

  function getProducts() {
    try {
      const local = JSON.parse(localStorage.getItem('dd_products'));
      if (Array.isArray(local) && local.length > 0) return local;
      return (window.DesiState && window.DesiState.products) || [];
    } catch (e) {
      return (window.DesiState && window.DesiState.products) || [];
    }
  }

  function openAddProductForm() {
    window.location.href = 'add-product.html';
  }

  function viewProducts() {
    if (!main) return;

    const list = getProducts();
    main.innerHTML = '';

    if (list.length === 0) {
      main.innerHTML = '<div class="section-card">No products yet</div>';
      return;
    }

    list.forEach(p => {
      const el = document.createElement('div');
      el.className = 'section-card';
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${p.title || 'Untitled Product'}</strong>
            <div class="muted">${p.shop || 'Unknown Shop'} • ${p.category || 'General'}</div>
          </div>
          <div>
            <button class="btn ghost edit-btn" data-id="${p.id}">Edit</button>
          </div>
        </div>
      `;
      main.appendChild(el);
    });

    bindEditEvents();
  }

  function bindEditEvents() {
    if (!main) return;
    main.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        localStorage.setItem('dd_edit_product_id', id);
        window.location.href = 'add-product.html';
      });
    });
  }

  if (openBtn) openBtn.addEventListener('click', openAddProductForm);
  if (viewBtn) viewBtn.addEventListener('click', viewProducts);

  // Automatically load products if main container exists
  if (main) viewProducts();
});