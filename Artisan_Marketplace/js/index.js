(function () {
  // Constants for storage keys
  const STORAGE = {
    PRODUCTS: "dd_products",
    CART: "dd_cart",
    WISHLIST: "dd_wishlist",
    REVIEW: "desi_review_id"
  };

  const PRODUCTS = [
    { id: 1, title: "Handcrafted Terracotta Vase", category: "Handicrafts", price: 499, desc: "Decorative handmade terracotta vase", featured: true },
    { id: 2, title: "Traditional Bandhani Fabric", category: "Textiles", price: 799, desc: "Authentic Bandhani printed textile" },
    { id: 3, title: "Organic Millet Cookies", category: "Bakery", price: 299, desc: "Fresh organic millet cookies", featured: true },
    { id: 4, title: "Handcrafted Bamboo Flute", category: "Musical instruments", price: 349, desc: "Traditional crafted bamboo flute" },
    { id: 5, title: "Clay Festival Diyas (Pack of 6)", category: "Handicrafts", price: 199, desc: "Handmade clay diya set", featured: true },
    { id: 6, title: "Handwoven Cotton Shawl", category: "Textiles", price: 999, desc: "Soft hand-woven winter cotton shawl" }
  ];

  localStorage.setItem(STORAGE.PRODUCTS, JSON.stringify(PRODUCTS));
  const featuredWrap = document.getElementById("homeProducts");

  // Helper to update cart UI globally
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || "{}");
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll("#navCartCount, #navCartCount2, #navCartCount3")
      .forEach(el => el.textContent = totalItems);
  }

  function render(list, container) {
    if (!container) return; // Prevent crash if element doesn't exist
    
    const wishlist = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || "{}");
    container.innerHTML = "";

    // Render HTML
    list.forEach(p => {
      const isWishlisted = !!wishlist[p.id];
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <h4>${p.title}</h4>
        <p class="meta">${p.category}</p>
        <p class="desc">${p.desc}</p>
        <div class="price">₹${p.price}</div>
        <div class="actions">
          <button class="btn primary add" data-id="${p.id}">Add to cart</button>
          <button class="icon-like wish" data-id="${p.id}">${isWishlisted ? '💛' : '🤍'}</button>
          <button class="btn ghost review" data-id="${p.id}">Review</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Event Delegation: Single listener for the entire container
    container.addEventListener("click", (e) => {
      const btn = e.target;
      const id = btn.dataset.id;

      if (!id) return; // Exit if a non-button element was clicked

      // Handle Add to Cart
      if (btn.classList.contains("add")) {
        const cart = JSON.parse(localStorage.getItem(STORAGE.CART) || "{}");
        const item = cart[id] || { id: +id, qty: 0 };
        item.qty++;
        cart[id] = item;
        
        localStorage.setItem(STORAGE.CART, JSON.stringify(cart));
        updateCartUI();
        alert("Added to cart");
      }

      // Handle Wishlist
      if (btn.classList.contains("wish")) {
        const w = JSON.parse(localStorage.getItem(STORAGE.WISHLIST) || "{}");
        if (w[id]) { 
          delete w[id]; 
          btn.textContent = '🤍'; 
        } else { 
          w[id] = true; 
          btn.textContent = '💛'; 
        }
        localStorage.setItem(STORAGE.WISHLIST, JSON.stringify(w));
      }

      // Handle Review
      if (btn.classList.contains("review")) {
        localStorage.setItem(STORAGE.REVIEW, id);
        window.location.href = "review.html";
      }
    });
  }

  // Initial execution
  if (featuredWrap) {
    render(PRODUCTS.filter(p => p.featured), featuredWrap);
    updateCartUI(); // Initialize cart counts on page load
  }
})();
