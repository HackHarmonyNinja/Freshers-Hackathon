document.addEventListener('DOMContentLoaded', () => {
  // FIX: Key must match the one set in the home page script
  const productId = localStorage.getItem('desi_review_id');
  
  const productDiv = document.getElementById('productReview');
  const reviewsList = document.getElementById('reviewsList');
  const submitBtn = document.getElementById('submitReview');

  // Stop execution if no product was selected
  if (!productId) {
    if (productDiv) productDiv.innerHTML = '<p>No product selected.</p>';
    return;
  }

  const PRODUCTS = JSON.parse(localStorage.getItem('dd_products') || '[]');
  const REVIEWS = JSON.parse(localStorage.getItem('dd_reviews') || '{}');

  const product = PRODUCTS.find(p => p.id == productId);

  // Safely render product details
  if (product && productDiv) {
    const shopName = product.shop || 'Independent Seller';
    
    // Only generate the image tag if an image actually exists
    const imgTag = product.img 
      ? `<img src="${product.img}" style="width:200px;border-radius:12px;margin-top:12px" alt="${product.title}">` 
      : '';

    productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <div class="meta">${shopName} • ${product.category}</div>
      ${imgTag}
    `;
  }

  function renderReviews() {
    if (!reviewsList) return;
    
    const list = REVIEWS[productId] || [];
    reviewsList.innerHTML = '';
    
    if (list.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet. Be the first!</p>';
      return;
    }
    
    list.forEach(r => {
      const div = document.createElement('div');
      div.className = 'section-card';
      
      const ratingText = document.createElement('strong');
      // Ensure rating is a number, default to 1 if invalid
      const starCount = Number(r.rating) || 1;
      ratingText.textContent = `Rating: ${'★'.repeat(starCount)}`;
      
      const reviewBody = document.createElement('p');
      // FIX: Use textContent to prevent Cross-Site Scripting (XSS)
      reviewBody.textContent = r.text; 
      
      div.appendChild(ratingText);
      div.appendChild(reviewBody);
      reviewsList.appendChild(div);
    });
  }

  // Handle Review Submission
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const ratingEl = document.getElementById('reviewRating');
      const textEl = document.getElementById('reviewText');
      
      if (!ratingEl || !textEl) return;

      const rating = Number(ratingEl.value);
      const text = textEl.value.trim();
      
      if (!text) { 
        alert('Please write a review'); 
        return; 
      }
      
      // Initialize the array for this product if it doesn't exist yet
      if (!REVIEWS[productId]) REVIEWS[productId] = [];
      
      REVIEWS[productId].push({ rating, text });
      localStorage.setItem('dd_reviews', JSON.stringify(REVIEWS));
      
      textEl.value = ''; // Clear input
      renderReviews();   // Refresh UI
      alert('Review submitted!');
    });
  }

  renderReviews();
});
