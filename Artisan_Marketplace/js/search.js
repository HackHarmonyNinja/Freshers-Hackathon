(function(){
  // Constants for storage keys
  const STORAGE = {
    PRODUCTS: 'dd_products',
    CART: 'dd_cart',
    WISHLIST: 'dd_wishlist',
    REVIEW: 'desi_review_id',
    PRE_SEARCH: 'desi_search_q'
  };

  const CATEGORIES = ['All', 'Handicrafts', 'Textiles', 'Bakery', 'Musical instruments'];
  const CLASS_MAP = {
    'All': 'all',
    'Handicrafts': 'handicrafts',
    'Textiles': 'textiles',
    'Bakery': 'bakery',
    'Musical instruments': 'music'
  };

  const catEl = document.getElementById('searchCategories');
  const results = document.getElementById('searchResults');
  const shown = document.getElementById('searchShown');
  const searchInput = document.getElementById('searchQ');
  const sortSelect = document.getElementById('searchSort');
  const searchBtn = document.getElementById('searchBtn');

  // Prevent script from crashing if not on the search page
  if (!results || !searchInput || !catEl) return;

  const PRODUCTS = JSON.parse(localStorage.getItem(STORAGE.PRODUCTS) || '[]');
  let currentCategory = 'All';

  // Helper: Prevent XSS attacks from user-generated product data
  const escapeHTML = (str) => str ? str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  ) : '';

  // Helper: Update global cart counters
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || '{}');
    const total = Object.values(cart).reduce((sum, item) => sum + (item.qty || 0), 0);
    document.querySelectorAll('#navCartCount, #navCartCount2, #navCartCount3')
      .forEach(el => el.textContent = total);
  }

  function renderCategories() {
    CATEGORIES.forEach(c => {
      const btn = document.createElement('button');
      btn.className = `chip ${CLASS_MAP[c] || ''}`;
      btn.textContent = c;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = c;
        doSearch();
      });

      catEl.appendChild(btn);
    });

    const first = catEl.querySelector('.chip');
    if (first) first.classList.add('active');
  }

  function doSearch() {
    const input = searchInput.value.toLowerCase().trim();
    const catQuery = currentCategory.toLowerCase();

    let list = PRODUCTS.filter(p => {
      // Safe fallback checks: using (string || '') prevents undefined errors
      const searchString = [p.title, p.desc, p.shop, p.category]
        .map(val => (val || '').toLowerCase())
        .join(' ');

      const matchesSearch = !input || searchString.includes(input);
      const matchesCategory = catQuery === 'all' || (p.category || '').toLowerCase() === catQuery;

      return matchesSearch && matchesCategory;
    });

    const sort = sortSelect ? sortSelect.value : '';
    if (sort === 'price_low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price_high') list.sort((a, b) => b.price - a.price);

    renderList(list);
  }

  function renderList(list) {
    const wishlist = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || '{}');
    results.innerHTML = '';
    
    if (list.length === 0) {
      results.innerHTML = '<p>No products found matching your search.</p>';
    }

    list.forEach(p => {
      const isWishlisted = !!wishlist[p.id];
      const safeTitle = escapeHTML(p.title);
      const safeDesc = escapeHTML(p.desc);
      const safeShop = escapeHTML(p.shop || 'Independent Seller');
      const safeCat = escapeHTML(p.category);

      const card = document.createElement('article');
      card.className = 'product';
      card.innerHTML = `
        <h4>${safeTitle}</h4>
        <div class="meta">${safeShop} • ${safeCat}</div>
        <div class="desc">${safeDesc}</div>
        <div class="price">₹${Number(p.price) || 0}</div>
        <div class="actions">
          <button class="btn primary add" data-id="${p.id}">Add to cart</button>
          <button class="icon-like wish" data-id="${p.id}">${isWishlisted ? '💛' : '🤍'}</button>
          <button class="btn ghost review" data-id="${p.id}">Review</button>
        </div>`;
      results.appendChild(card);
    });

    if (shown) shown.textContent = list.length;
  }

  // EVENT DELEGATION: Handle all button clicks inside the results container efficiently
  results.addEventListener('click', (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    if (!id) return;

    // Add to cart
    if (btn.classList.contains('add')) {
      const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || '{}');
      const it = cart[id] || { id: +id, qty: 0 };
      it.qty++;
      cart[id] = it;
      
      localStorage.setItem(STORAGE.CART, JSON.stringify(cart));
      updateCartUI();
      alert('Added to cart');
    }

    // Wishlist toggle
    if (btn.classList.contains('wish')) {
      const w = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || '{}');
      if (w[id]) { 
        delete w[id]; 
        btn.textContent = '🤍'; 
      } else { 
        w[id] = true; 
        btn.textContent = '💛'; 
      }
      localStorage.setItem(STORAGE.WISHLIST, JSON.stringify(w));
    }

    // Review redirect
    if (btn.classList.contains('review')) {
      localStorage.setItem(STORAGE.REVIEW, id);
      window.location.href = 'review.html';
    }
  });

  // Attach Input & Filter Listeners
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') doSearch();
  });
  
  if (searchBtn) searchBtn.addEventListener('click', doSearch);
  if (sortSelect) sortSelect.addEventListener('change', doSearch);

  // Initialize Page
  renderCategories();
  updateCartUI();

  // Handle redirected searches
  const pre = localStorage.getItem(STORAGE.PRE_SEARCH);
  if (pre) {
    searchInput.value = pre;
    localStorage.removeItem(STORAGE.PRE_SEARCH);
  }

  // Initial render
  doSearch();

})();
