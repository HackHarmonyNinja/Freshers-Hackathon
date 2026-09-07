document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checkoutItems');
  const totalEl = document.getElementById('checkoutTotal');
  const payBtn = document.getElementById('payBtn');

  // Guard clause: stop if container element is missing
  if (!container || !totalEl) return;

  function getStorageData(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  const cart = getStorageData('dd_cart', {});
  const products = getStorageData('dd_products', []);
  const cartKeys = Object.keys(cart);

  if (cartKeys.length === 0) {
    container.innerHTML = '<div>No items in cart</div>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;

  cartKeys.forEach(id => {
    const item = cart[id];
    const prod = products.find(p => String(p.id) === String(id));

    // Handle missing/deleted product gracefully
    if (!prod) return;

    const price = Number(prod.price) || 0;
    const qty = Number(item.qty) || 1;
    const itemTotal = price * qty;
    total += itemTotal;

    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.justifySpaceBetween = 'space-between';
    el.innerHTML = `<span>${prod.title || 'Item'} × ${qty}</span> <span>₹${itemTotal}</span>`;
    container.appendChild(el);
  });

  totalEl.textContent = String(total);

  // Bind payment event listener safely
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const cardNameInput = document.getElementById('cardName');
      const cardNumberInput = document.getElementById('cardNumber');
      const expiryInput = document.getElementById('expiry');
      const cvvInput = document.getElementById('cvv');

      const name = cardNameInput ? cardNameInput.value.trim() : '';
      const number = cardNumberInput ? cardNumberInput.value.trim() : '';
      const expiry = expiryInput ? expiryInput.value.trim() : '';
      const cvv = cvvInput ? cvvInput.value.trim() : '';

      if (!name || !number || !expiry || !cvv) {
        alert('Please fill all payment details');
        return;
      }
      if (!/^\d{16}$/.test(number)) {
        alert('Card number must be 16 digits');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Expiry must be MM/YY');
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        alert('CVV must be 3 or 4 digits');
        return;
      }

      alert('Payment successful! Thank you for your order.');
      localStorage.setItem('dd_cart', '{}');
      window.location.href = 'index.html';
    });
  }
});