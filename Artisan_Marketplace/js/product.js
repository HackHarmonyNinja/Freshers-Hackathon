document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveProd');

  // Prevent script crash if button isn't on the current page
  if (!saveBtn) return;

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop default form submission if wrapped in a <form>

    // Safely retrieve elements
    const titleEl = document.getElementById('pTitle');
    const descEl = document.getElementById('pDesc');
    const priceEl = document.getElementById('pPrice');
    const catEl = document.getElementById('pCat');
    const shopEl = document.getElementById('pShop');
    const imgEl = document.getElementById('pImg');

    // Ensure all required DOM elements exist before extracting values
    if (!titleEl || !descEl || !priceEl || !catEl || !shopEl) {
      console.error("Form elements missing from DOM.");
      return;
    }

    const title = titleEl.value.trim();
    const desc = descEl.value.trim();
    const price = Number(priceEl.value);
    const cat = catEl.value;
    const shop = shopEl.value.trim();
    const img = (imgEl && imgEl.value.trim()) || 'assets/images/placeholder.jpg';

    // Improved validation logic
    if (!title || !desc || !shop) {
      alert('Please fill all required text fields.');
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price greater than 0.');
      return;
    }

    try {
      // Fetch existing list or start fresh
      const list = JSON.parse(localStorage.getItem('dd_products') || '[]');
      
      const newProduct = {
        id: Date.now(),
        title,
        desc,
        price,
        category: cat,
        shop,
        img,
        featured: false // Maintain consistent schema with the home page
      };

      list.push(newProduct);
      localStorage.setItem('dd_products', JSON.stringify(list));

      alert('Product added successfully.');
      window.location.href = 'seller-dashboard.html';
      
    } catch (error) {
      console.error("Failed to save product to storage:", error);
      alert('An error occurred while saving the product.');
    }
  });
});
