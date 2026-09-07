document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const sellerExtras = document.getElementById('sellerExtras');
  const signupBtn = document.getElementById('signupBtn');
  const loginBtn = document.getElementById('loginBtn');
  const radios = document.getElementsByName('role');

  // Toggle forms
  signupBtn.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
  });

  loginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
  });

  // Helper function to update seller field visibility & required status
  const updateSellerFields = (roleValue) => {
    if (!sellerExtras) return;
    if (roleValue === 'Seller') {
      sellerExtras.style.display = 'block';
      sellerExtras.querySelectorAll('input, textarea').forEach(f => f.setAttribute('required', ''));
    } else {
      sellerExtras.style.display = 'none';
      sellerExtras.querySelectorAll('input, textarea').forEach(f => f.removeAttribute('required'));
    }
  };

  // Show/hide Seller fields dynamically on toggle
  Array.from(radios).forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) updateSellerFields(radio.value);
    });
  });

  // Safely initialize display on page load
  const selectedRoleElement = document.querySelector('input[name="role"]:checked');
  if (selectedRoleElement) {
    updateSellerFields(selectedRoleElement.value);
  }

  // Sign up submit handler
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    
    const roleElement = document.querySelector('input[name="role"]:checked');
    const role = roleElement ? roleElement.value : 'Buyer';

    const bizDescInput = document.getElementById('bizDesc');
    const shopAddrInput = document.getElementById('shopAddr');
    const bizDesc = bizDescInput ? bizDescInput.value.trim() : '';
    const shopAddr = shopAddrInput ? shopAddrInput.value.trim() : '';

    if (!name || !email || !phone || !password || (role === 'Seller' && (!bizDesc || !shopAddr))) {
      alert('Please fill all required fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists'); 
      return; 
    }

    const user = { id: Date.now(), name, email, phone, password, role };
    if (role === 'Seller') { 
      user.bizDesc = bizDesc; 
      user.shopAddr = shopAddr; 
    }

    users.push(user);
    localStorage.setItem('dd_users', JSON.stringify(users));
    alert('Account created! Redirecting to Home...');
    window.location.href = 'index.html';
  });

  // Log in submit handler
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
    const user = users.find(u => u.name === name && u.password === password);
    
    if (!user) { 
      alert('Invalid name or password'); 
      return; 
    }
    
    localStorage.setItem('dd_currentUser', JSON.stringify(user));
    alert('Login successful! Redirecting to Home...');
    window.location.href = 'index.html';
  });
});