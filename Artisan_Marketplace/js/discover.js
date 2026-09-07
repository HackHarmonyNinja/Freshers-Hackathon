(function () {
  const shops = [
    { name: 'Ananya Handloom', cat: 'Textiles', dist: '1.2 km', desc: 'Handloom sarees & fabrics' },
    { name: "Rao's Bakrey", cat: 'Bakery', dist: '800 m', desc: 'Sweets & breads' },
    { name: 'Majestic Musicals', cat: 'Musical instruments', dist: '2.1 km', desc: 'Tablas & flutes' },
    { name: 'Village Crafts', cat: 'Handicrafts', dist: '1.6 km', desc: 'Earthenware & decor' }
  ];

  const el = document.getElementById('shopsList');
  
  // Render shops list if container exists
  if (el) {
    shops.forEach(s => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <strong>${s.name}</strong>
        <div class="muted">${s.cat} • ${s.dist}</div>
        <p class="muted">${s.desc}</p>
      `;
      card.addEventListener('click', () => {
        localStorage.setItem('desi_search_q', s.name);
        window.location.href = 'search.html';
      });
      el.appendChild(card);
    });
  }

  // Safe helper to calculate cart count
  function updateCartBadge() {
    let cart = {};
    try {
      cart = JSON.parse(localStorage.getItem('dd_cart')) || {};
    } catch (e) {
      cart = {};
    }

    const count = Object.values(cart).reduce((sum, item) => {
      return sum + (Number(item.qty) || 0);
    }, 0);

    document.querySelectorAll('#navCartCount2').forEach(badge => {
      badge.textContent = String(count);
    });
  }

  updateCartBadge();
})();