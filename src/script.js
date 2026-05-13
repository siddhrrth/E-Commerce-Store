// ShopEase Luxury MPA Interaction & LocalStorage Controller

// Default Data Matrices preloaded to guarantee rich initial aesthetics
const defaultProducts = [
  { id: 1, name: 'Summit Alpine Backpack', subtitle: 'Expedition Capacity', price: 12499, oldPrice: 16999, tag: 'Best Seller', img: 'images/Hiking Backpack.png', category: 'Backpacks' },
  { id: 2, name: 'Pro Terrain Hiking Boots', subtitle: 'Gore-Tex Core', price: 14899, oldPrice: 19999, tag: 'Flagship Boot', img: 'images/hiking boots.png', category: 'Footwear' },
  { id: 3, name: 'Himalayan Down Jacket', subtitle: 'Extreme Weather', price: 18999, oldPrice: 24499, tag: 'Thermal Layer', img: 'images/jacket.png', category: 'Apparel' },
  { id: 4, name: 'Geodesic Basecamp Tent', subtitle: 'All-Season Fortress', price: 28499, oldPrice: 35000, tag: 'Ultralight', img: 'images/tent.png', category: 'Shelters' },
  { id: 5, name: 'Thermal Arctic Sleeping Bag', subtitle: 'Down Insulation', price: 9999, oldPrice: 13500, tag: '-20°C Certified', img: 'images/bag (1).png', category: 'Sleeping' },
  { id: 6, name: 'Titanium Water Flask', subtitle: '24-Hour Hot/Cold', price: 2499, oldPrice: 3499, tag: 'Vacuum Seal', img: 'images/water bottle.png', category: 'Hydration' },
  { id: 7, name: 'Expedition Compass Kit', subtitle: 'Global Needle System', price: 3899, oldPrice: 4999, tag: 'Precision Grade', img: 'images/compass.png', category: 'Navigation' },
  { id: 8, name: 'Advanced Trekking Boots', subtitle: 'Vibram Outsole', price: 13299, oldPrice: 17999, tag: 'Trail Master', img: 'images/boots.png', category: 'Footwear' }
];

const defaultOrders = [
  { id: '#EXP-2025-8821', date: '12 May 2025', items: 'Summit Alpine Backpack, Pro Terrain Hiking Boots', units: 2, total: 26098, status: 'Delivered' },
  { id: '#EXP-2025-8604', date: '04 May 2025', items: 'Himalayan Down Jacket', units: 1, total: 18999, status: 'In Transit' },
  { id: '#EXP-2025-7940', date: '18 Apr 2025', items: 'Geodesic Basecamp Tent, Expedition Compass Kit', units: 2, total: 32398, status: 'Staging' }
];

// Initialize persistent structures
function initializeStorage() {
  if (!localStorage.getItem('shopease_products')) {
    localStorage.setItem('shopease_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('shopease_orders')) {
    localStorage.setItem('shopease_orders', JSON.stringify(defaultOrders));
  }
  if (!localStorage.getItem('shopease_cart')) {
    // Populate initial cart with one high-end pack to ensure zero-state layouts showcase rich visuals
    const initialCart = [{ id: 1, name: 'Summit Alpine Backpack', subtitle: 'Expedition Capacity', price: 12499, qty: 1, img: 'images/Hiking Backpack.png' }];
    localStorage.setItem('shopease_cart', JSON.stringify(initialCart));
  }
}

// Get accessors
function getProducts() {
  return JSON.parse(localStorage.getItem('shopease_products')) || defaultProducts;
}

function getCart() {
  return JSON.parse(localStorage.getItem('shopease_cart')) || [];
}

function getOrders() {
  return JSON.parse(localStorage.getItem('shopease_orders')) || defaultOrders;
}

// Global UI synchronization
function updateNav() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('nav-cart-count');
  if (badge) {
    badge.innerText = totalQty;
  }
  
  // Highlight active page link
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav-menu li a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Display aesthetic overlay Toast Notification
function showToast(msg) {
  let toast = document.getElementById('shopease-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shopease-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '40px';
    toast.style.right = '40px';
    toast.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-dark))';
    toast.style.color = '#0a0a0a';
    toast.style.padding = '14px 28px';
    toast.style.borderRadius = '6px';
    toast.style.fontFamily = "'DM Sans', sans-serif";
    toast.style.fontWeight = '700';
    toast.style.fontSize = '0.9rem';
    toast.style.letterSpacing = '1px';
    toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
    toast.style.zIndex = '10000';
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3000);
}

// Add Item Interaction Handler
function addToCart(productId) {
  const products = getProducts();
  const target = products.find(p => p.id === productId);
  if (!target) return;

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: target.id,
      name: target.name,
      subtitle: target.subtitle || target.category,
      price: target.price,
      qty: 1,
      img: target.img
    });
  }

  localStorage.setItem('shopease_cart', JSON.stringify(cart));
  updateNav();
  showToast(`⚡ Added ${target.name} to Cart`);
}

// Cart UI dynamic pipeline rendering
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items-container');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryNet = document.getElementById('summary-net');
  const cartCountH2 = document.getElementById('cart-header-count');
  
  if (!cartContainer) return;

  const cart = getCart();
  
  if (cartCountH2) {
    cartCountH2.innerText = `(${cart.reduce((a,c)=>a+c.qty,0)} Items)`;
  }

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 48px; text-align: center;">
        <p style="color: var(--muted); font-size: 1.1rem; margin-bottom: 20px;">Your Basecamp Allocation is currently clear.</p>
        <a href="products.html" class="btn-primary" style="text-decoration: none;">Browse Premium Gear</a>
      </div>
    `;
    if (summarySubtotal) summarySubtotal.innerText = '₹0';
    if (summaryNet) summaryNet.innerText = '₹0';
    const btn = document.getElementById('checkout-action-btn');
    if (btn) btn.disabled = true;
    return;
  }

  let html = '';
  let subtotalVal = 0;

  cart.forEach(item => {
    subtotalVal += item.price * item.qty;
    html += `
      <div class="cart-item" id="cart-row-${item.id}">
        <img src="${item.img}" class="cart-item-img" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-category">${item.subtitle}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
          <div class="qty-control" style="margin-top: 12px;">
            <button class="qty-btn" onclick="updateCartQty(${item.id}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; color: var(--white); margin-bottom: 12px;">₹${(item.price * item.qty).toLocaleString()}</div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  
  if (summarySubtotal) summarySubtotal.innerText = `₹${subtotalVal.toLocaleString()}`;
  const netVal = subtotalVal > 0 ? subtotalVal + 200 - 1500 : 0;
  if (summaryNet) summaryNet.innerText = `₹${Math.max(0, netVal).toLocaleString()}`;
  
  const btn = document.getElementById('checkout-action-btn');
  if (btn) btn.disabled = false;
}

function updateCartQty(id, delta) {
  let cart = getCart();
  const target = cart.find(item => item.id === id);
  if (target) {
    target.qty += delta;
    if (target.qty <= 0) {
      cart = cart.filter(item => item.id !== id);
      showToast('Item purged from allocation');
    }
    localStorage.setItem('shopease_cart', JSON.stringify(cart));
    renderCartPage();
    updateNav();
  }
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('shopease_cart', JSON.stringify(cart));
  showToast('Item successfully removed');
  renderCartPage();
  updateNav();
}

function executeCheckout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const subtotalVal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const netVal = Math.max(0, subtotalVal + 200 - 1500);
  const itemNames = cart.map(c => c.name).join(', ');
  const totalUnits = cart.reduce((sum, item) => sum + item.qty, 0);

  const newOrder = {
    id: `#EXP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    items: itemNames,
    units: totalUnits,
    total: netVal,
    status: 'Staging'
  };

  const orders = getOrders();
  orders.unshift(newOrder); // Add to beginning of sequence
  localStorage.setItem('shopease_orders', JSON.stringify(orders));
  
  // Clear cart allocation
  localStorage.setItem('shopease_cart', JSON.stringify([]));
  showToast('🚀 Authorization complete. Dispatching to Logistics Registry...');
  
  setTimeout(() => {
    window.location.href = 'orders.html';
  }, 1200);
}

// Render product catalog MPA page dynamically supporting Search/Category inputs
function renderProductsPage() {
  const grid = document.getElementById('mpa-products-grid');
  if (!grid) return;

  const products = getProducts();
  const searchInput = document.getElementById('catalog-search-input');
  const catSelect = document.getElementById('catalog-cat-select');

  const query = searchInput ? searchInput.value.toLowerCase() : '';
  const selectedCat = catSelect ? catSelect.value : 'All';

  const filtered = products.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(query) || (p.subtitle && p.subtitle.toLowerCase().includes(query));
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesQuery && matchesCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">No premium parameters indexed matching your criteria.</p>`;
    return;
  }

  let html = '';
  filtered.forEach(p => {
    html += `
      <div class="product-card">
        <div class="product-tag">${p.tag || 'Certified'}</div>
        <div class="product-img-wrapper">
          <img src="${p.img}" class="product-img" alt="${p.name}">
        </div>
        <div class="product-info">
          <div class="product-subtitle">${p.subtitle || p.category}</div>
          <div class="product-title">${p.name}</div>
          <div class="product-price-row">
            <span class="product-price">₹${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="product-old-price">₹${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="btn-explore" onclick="addToCart(${p.id})">⚡ Explore &amp; Acquire</button>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

// Render persistent order ledger MPA page
function renderOrdersPage() {
  const container = document.getElementById('orders-registry-container');
  if (!container) return;

  const orders = getOrders();
  if (orders.length === 0) {
    container.innerHTML = `<p style="color: var(--muted); text-align: center; padding: 40px;">No authorizations archived in tracking manifest.</p>`;
    return;
  }

  let html = '';
  orders.forEach(ord => {
    let badgeClass = 'status-pending';
    if (ord.status === 'Delivered') badgeClass = 'status-delivered';
    if (ord.status === 'In Transit') badgeClass = 'status-shipped';

    html += `
      <div class="order-card">
        <div class="order-info">
          <div class="order-id">${ord.id}</div>
          <div class="order-meta">Authorized: ${ord.date} &nbsp;·&nbsp; ${ord.units} Units Allocated</div>
          <div class="order-items-preview" style="margin-top: 8px;">${ord.items}</div>
        </div>
        <span class="status-badge ${badgeClass}">${ord.status}</span>
        <div class="order-total-block">
          <div class="order-total-label">Dispatched Net</div>
          <div class="order-total">₹${ord.total.toLocaleString()}</div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// Render Admin Command Center live dashboard
function renderAdminPage() {
  const prodTbody = document.getElementById('admin-products-tbody');
  const ordTbody = document.getElementById('admin-orders-tbody');
  
  if (prodTbody) {
    const products = getProducts();
    let phtml = '';
    products.forEach(p => {
      phtml += `
        <tr>
          <td>
            <div class="td-product">
              <img src="${p.img}" class="td-product-img" alt="${p.name}">
              <span style="font-weight: 700; color: var(--white);">${p.name}</span>
            </div>
          </td>
          <td>${p.category}</td>
          <td style="color: var(--accent); font-weight: 700;">₹${p.price.toLocaleString()}</td>
          <td>Active SKU</td>
          <td>
            <span class="action-link action-delete" onclick="adminDeleteProduct(${p.id})">Purge</span>
          </td>
        </tr>
      `;
    });
    prodTbody.innerHTML = phtml;
  }

  if (ordTbody) {
    const orders = getOrders();
    let ohtml = '';
    orders.forEach(o => {
      let badgeClass = 'status-pending';
      if (o.status === 'Delivered') badgeClass = 'status-delivered';
      if (o.status === 'In Transit') badgeClass = 'status-shipped';

      ohtml += `
        <tr>
          <td style="font-weight: 700; color: var(--accent);">${o.id}</td>
          <td>Global Client</td>
          <td style="font-weight: 700;">₹${o.total.toLocaleString()}</td>
          <td><span class="status-badge ${badgeClass}">${o.status}</span></td>
          <td>
            <select class="select-status" onchange="adminUpdateOrderStatus('${o.id}', this.value)">
              <option ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option ${o.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
              <option ${o.status === 'Staging' ? 'selected' : ''}>Staging</option>
            </select>
          </td>
        </tr>
      `;
    });
    ordTbody.innerHTML = ohtml;
  }
}

function adminDeleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  localStorage.setItem('shopease_products', JSON.stringify(products));
  showToast('SKU unindexed from platform');
  renderAdminPage();
  // Also refresh catalog if mounted
  renderProductsPage();
}

function adminUpdateOrderStatus(ordId, newStatus) {
  const orders = getOrders();
  const target = orders.find(o => o.id === ordId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem('shopease_orders', JSON.stringify(orders));
    showToast(`Updated telemetry for ${ordId}`);
    renderAdminPage();
  }
}

function adminAppendProduct() {
  const name = prompt("Enter Flagship Equipment Name:", "Ultralight Carbon Trekking Poles");
  if (!name) return;
  const priceInput = prompt("Enter MSRP Base Price in INR:", "6499");
  const price = parseInt(priceInput) || 6499;
  const category = prompt("Enter Category Tag:", "Navigation");
  
  const products = getProducts();
  const newId = Date.now();
  products.push({
    id: newId,
    name: name,
    subtitle: 'Pro Alpine Core',
    price: price,
    oldPrice: price + 2000,
    tag: 'Newly Annexed',
    img: 'images/compass.png',
    category: category || 'Essentials'
  });
  
  localStorage.setItem('shopease_products', JSON.stringify(products));
  showToast(`Successfully indexed ${name}`);
  renderAdminPage();
}

// Global Cursor and startup triggers
document.addEventListener('DOMContentLoaded', () => {
  initializeStorage();
  updateNav();

  // Custom Cursor dynamics
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  // Trigger MPA specific views depending on view container signatures
  renderCartPage();
  renderProductsPage();
  renderOrdersPage();
  renderAdminPage();

  // Attach search input key/change binders
  const searchInp = document.getElementById('catalog-search-input');
  const catSel = document.getElementById('catalog-cat-select');
  if (searchInp) searchInp.addEventListener('input', renderProductsPage);
  if (catSel) catSel.addEventListener('change', renderProductsPage);

  // Slim transparent navbar scrolling
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 80) {
        nav.style.height = '70px';
        nav.style.background = 'rgba(8, 8, 8, 0.92)';
      } else {
        nav.style.height = '84px';
        nav.style.background = 'rgba(10, 10, 10, 0.7)';
      }
    }
  });
});
