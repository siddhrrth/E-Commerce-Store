import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// ShopEase Luxury Outdoor E-Commerce React Component Integration
export function App() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Summit Alpine Backpack', category: 'Expedition Pack', price: 12499, qty: 1, img: 'images/Hiking Backpack.png' },
    { id: 2, name: 'Pro Terrain Hiking Boots', category: 'Flagship Footwear', price: 14899, qty: 1, img: 'images/hiking boots.png' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const products = [
    { id: 1, name: 'Summit Alpine Backpack', subtitle: 'Expedition Capacity', price: 12499, oldPrice: 16999, tag: 'Best Seller', img: 'images/Hiking Backpack.png', category: 'Packs' },
    { id: 2, name: 'Pro Terrain Hiking Boots', subtitle: 'Gore-Tex Core', price: 14899, oldPrice: 19999, tag: 'Flagship Boot', img: 'images/hiking boots.png', category: 'Footwear' },
    { id: 3, name: 'Himalayan Down Jacket', subtitle: 'Extreme Weather', price: 18999, oldPrice: 24499, tag: 'Thermal Layer', img: 'images/jacket.png', category: 'Apparel' },
    { id: 4, name: 'Geodesic Basecamp Tent', subtitle: 'All-Season Fortress', price: 28499, oldPrice: 35000, tag: 'Ultralight', img: 'images/tent.png', category: 'Shelters' },
    { id: 5, name: 'Thermal Arctic Sleeping Bag', subtitle: 'Down Insulation', price: 9999, oldPrice: 13500, tag: '-20°C Certified', img: 'images/bag (1).png', category: 'Sleeping' },
    { id: 6, name: 'Titanium Water Flask', subtitle: '24-Hour Hot/Cold', price: 2499, oldPrice: 3499, tag: 'Vacuum Seal', img: 'images/water bottle.png', category: 'Hydration' },
    { id: 7, name: 'Expedition Compass Kit', subtitle: 'Global Needle System', price: 3899, oldPrice: 4999, tag: 'Precision Grade', img: 'images/compass.png', category: 'Navigation' },
    { id: 8, name: 'Advanced Trekking Boots', subtitle: 'Vibram Outsole', price: 13299, oldPrice: 17999, tag: 'Trail Master', img: 'images/boots.png', category: 'Footwear' }
  ];

  const addToCart = (prod) => {
    setCart(prev => {
      const exists = prev.find(item => item.name === prod.name);
      if (exists) {
        return prev.map(item => item.name === prod.name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: Date.now(), name: prod.name, category: prod.subtitle, price: prod.price, qty: 1, img: prod.img }];
    });
  };

  const updateQty = (name, delta) => {
    setCart(prev => prev.map(item => {
      if (item.name === name) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal > 0 ? subtotal + 200 - 1500 : 0;

  return (
    <div className="shopease-app">
      {/* Dynamic Nav */}
      <nav style={{ background: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(20px)' }}>
        <a href="#home" className="logo">Shop<span>Ease</span></a>
        <ul className={mobileMenuOpen ? 'show' : ''}>
          <li><a href="#home">Home</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#cart">Cart ({cart.reduce((a, c) => a + c.qty, 0)})</a></li>
          <li><a href="#orders">Orders</a></li>
          <li><a href="#admin">Admin</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#auth" className="nav-btn" style={{ textDecoration: 'none' }}>Portal</a>
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
        </div>
      </nav>

      {/* Hero Section Integration */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-tag">React JSX Framework Layer Enabled</div>
          <h1>Shop <em>Smarter,</em> Live Better.</h1>
          <p>Cinematic outdoor performance powered by dynamic state management. Experience real-time reactivity overlaid on uncompromising aesthetic luxury.</p>
          <div className="hero-btns">
            <a href="#products" className="btn-primary">Browse Interactive Grid</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-val">500+</div>
              <div className="stat-label">Flagship SKUs</div>
            </div>
            <div>
              <div className="stat-val">0ms</div>
              <div className="stat-label">Virtual DOM Lag</div>
            </div>
          </div>
        </div>
        <div className="hero-img-wrapper">
          <img src="images/hero banner.png" className="hero-img" alt="Hero Interactive Preview" />
        </div>
      </section>

      {/* Live React Filter Product Catalog */}
      <section id="products" style={{ background: 'var(--bg)' }}>
        <div className="section-header">
          <div className="section-label">State Driven</div>
          <h2 className="section-title">Live Reactive Matrix</h2>
          <p className="section-sub">Filter equipment instantly using typed parameter inputs below.</p>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Real-time matching string..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Framework Tags</option>
            <option value="Packs">Packs</option>
            <option value="Footwear">Footwear</option>
            <option value="Apparel">Apparel</option>
            <option value="Shelters">Shelters</option>
          </select>
        </div>

        <div className="products-grid">
          {products
            .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(p => (
              <div key={p.id} className="product-card">
                <div className="product-tag">{p.tag}</div>
                <div className="product-img-wrapper">
                  <img src={p.img} className="product-img" alt={p.name} />
                </div>
                <div className="product-info">
                  <div className="product-subtitle">{p.subtitle}</div>
                  <div className="product-title">{p.name}</div>
                  <div className="product-price-row">
                    <span className="product-price">₹{p.price.toLocaleString()}</span>
                    <span className="product-old-price">₹{p.oldPrice.toLocaleString()}</span>
                  </div>
                  <button className="btn-explore" onClick={() => addToCart(p)}>
                    ⚡ Add to Live Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Cart Integration */}
      <section id="cart" style={{ background: '#0d0d0d' }}>
        <div className="section-header">
          <div className="section-label">Reactive Store</div>
          <h2 className="section-title">Interactive Dispatch Manifest</h2>
        </div>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No components allocated in virtual checkout state.</p>
            ) : (
              cart.map(item => (
                <div key={item.name} className="cart-item">
                  <img src={item.img} className="cart-item-img" alt={item.name} />
                  <div style={{ flex: 1 }}>
                    <div className="cart-item-title">{item.name}</div>
                    <div className="cart-item-price">₹{item.price.toLocaleString()}</div>
                    <div className="qty-control" style={{ marginTop: '10px' }}>
                      <button className="qty-btn" onClick={() => updateQty(item.name, -1)}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.name, 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => updateQty(item.name, -item.qty)}>Purge</button>
                </div>
              ))
            )}
          </div>
          <div className="cart-summary">
            <div className="summary-title">State Ledger</div>
            <div className="summary-row"><span>Subtotal Matrix</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Logistics Multiplier</span><span>₹200</span></div>
            <div className="summary-row total">
              <span>Dispatched Total</span>
              <span className="total-val">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Automatically mount module if root container present
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('react-app-root');
    if (appRoot) {
      const root = ReactDOM.createRoot(appRoot);
      root.render(<App />);
    }
  });
}
