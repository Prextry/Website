// ─── Data ────────────────────────────────────────────────────────────────────
const MENU = {
  mains: [
    { id: 1, name: "Taco Al Pastor", price: 2.50, desc: "House-marinated pork al pastor, pineapple, cilantro & onion on a handmade corn tortilla", emoji: "🌮", hasMods: true },
    { id: 2, name: "Taco Al Pastor - Flour", price: 3.50, desc: "Al pastor filling wrapped in a warm, pillowy flour tortilla", emoji: "🌮", hasMods: true },
    { id: 3, name: "Taco Al Pastor - Lettuce", price: 3.00, desc: "Low-carb option: al pastor with fresh crisp lettuce wrap", emoji: "🥬", hasMods: true },
    { id: 4, name: "Gringa", price: 4.00, desc: "Flour tortilla quesadilla stuffed with slow-roasted al pastor & melted Oaxacan cheese", emoji: "🧀", hasMods: true },
  ],
  dessert: [
    { id: 5, name: "Flan de Cajeta", price: 4.00, desc: "Silky Mexican custard topped with Jalisco-style goat milk caramel sauce", emoji: "🍮", hasMods: false },
  ],
  beverages: [
    { id: 6, name: "Fresh Lemonade", price: 4.00, desc: "Squeezed to order, lightly sweetened with a touch of Tajín rim", emoji: "🍋", hasMods: false },
    { id: 7, name: "Mexican Sodas", price: 4.00, desc: "Assorted glass-bottle Jarritos and other Mexican favorites", emoji: "🥤", hasMods: false },
    { id: 8, name: "Topo Chico", price: 4.00, desc: "The original Monterrey sparkling mineral water — ice cold", emoji: "💧", hasMods: false },
    { id: 9, name: "Bottled Water", price: 2.50, desc: "Still purified water", emoji: "💧", hasMods: false },
  ],
  bar: [
    { id: 10, name: "Beer", price: 4.50, desc: "Rotating selection of Mexican and craft imports, served ice cold", emoji: "🍺", hasMods: false },
    { id: 11, name: "Paloma", price: 10.00, desc: "Silver tequila, fresh grapefruit, lime juice, Topo Chico & a salt rim", emoji: "🍹", hasMods: false },
    { id: 12, name: "Tequila Shot", price: 8.00, desc: "Premium 100% agave tequila, served with lime and house salt blend", emoji: "🥃", hasMods: false },
  ],
};

const SALSAS = [
  { id: "serrano", label: "Spicy - Serrano", heat: "🔥🔥🔥", colorClass: "bg-green-500" },
  { id: "tomato_pine", label: "Medium - Tomato Pineapple", heat: "🔥🔥", colorClass: "bg-yellow-400" },
  { id: "tomatillo", label: "Medium - Tomatillo, Chile de Arbol", heat: "🔥🔥", colorClass: "bg-amber-700" },
  { id: "guajillo", label: "Mild - Chile Guajillo", heat: "🔥", colorClass: "bg-red-600" },
];

const REVIEWS = [
  { id: 1, name: "Maria G.", stars: 5, text: "Best tacos in all of San Antonio, no contest. The Al Pastor is life-changing — perfectly charred and the pineapple sweetness is just right.", tag: "Regular" },
  { id: 2, name: "Carlos M.", stars: 5, text: "The Gringa is absolutely insane. Melted cheese with that slow-roasted pork on a crispy flour tortilla... I dream about this place.", tag: "Verified Order" },
  { id: 3, name: "Jessica R.", stars: 5, text: "Perfect late-night spot. Open until 2am on weekends and the food always hits. The Paloma cocktail + tacos combo is unbeatable.", tag: "Verified Order" },
  { id: 4, name: "David K.", stars: 5, text: "Hidden gem on Alamo Street. Authentic San Antonio flavors, incredible salsas, and the staff make you feel like family. Total 10/10.", tag: "Regular" },
];

const CAT_META = {
  mains:     { label: "Mains",     icon: "utensils" },
  dessert:   { label: "Dessert",   icon: "ice-cream" },
  beverages: { label: "Beverages", icon: "coffee" },
  bar:       { label: "Bar",       icon: "wine" },
};

const GALLERY = [
  { tall: true,  label: "Main Dining Area",   emoji: "🏛️" },
  { tall: false, label: "Patio Seating",      emoji: "🌿" },
  { tall: false, label: "Bar Counter",        emoji: "🍹" },
  { tall: false, label: "Taco Station",       emoji: "🌮" },
  { tall: false, label: "Weekend Night Vibes",emoji: "✨" },
  { tall: false, label: "Private Corner",     emoji: "🕯️" },
];

// ─── State ───────────────────────────────────────────────────────────────────
let cartItems = [];
let cartOpen = false;
let modalOpen = false;
let selectedItem = null;
let mods = { extraMeat: false, addCheese: false, salsa: "serrano", qty: 1 };
let activeCategory = "mains";
let deliveryMethod = "pickup";
let paymentMethod = "cod";
let orderPlaced = false;
let isOpen = false;

// ─── Initialization ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  checkStoreStatus();
  renderGallery();
  renderMenuTabs();
  renderMenuGrid();
  renderReviews();
  setupScrollListener();
  lucide.createIcons();
});

// ─── Core Logic ──────────────────────────────────────────────────────────────
function checkStoreStatus() {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  
  if (day === 0) isOpen = false;
  else if (day === 1) isOpen = (h >= 12 && h < 22);
  else if (day >= 2 && day <= 4) isOpen = (h >= 12);
  else if (day >= 5) isOpen = (h >= 12 || h < 2);

  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  const footerStatus = document.getElementById("footer-status");

  dot.className = `pulse-dot ${isOpen ? 'open' : 'closed'}`;
  text.innerText = `${isOpen ? "NOW OPEN" : "CURRENTLY CLOSED"} · SAN ANTONIO, TX`;
  text.style.color = isOpen ? "#d8b4fe" : "#f87171";
  footerStatus.innerText = isOpen ? "Open Now" : "Closed Now";
}

function setupScrollListener() {
  const header = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Render Functions ────────────────────────────────────────────────────────

function renderGallery() {
  const container = document.getElementById("gallery-grid");
  container.innerHTML = GALLERY.map(g => `
    <div class="gallery-item" style="grid-row: span ${g.tall ? 2 : 1}">
      <div class="img-placeholder" style="height: 100%; min-height: ${g.tall ? '412px' : '200px'}">
        <div class="gallery-item-inner">
          <div class="g-emoji">${g.emoji}</div>
          <p class="g-label">${g.label}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderMenuTabs() {
  const container = document.getElementById("category-tabs");
  container.innerHTML = Object.entries(CAT_META).map(([key, val]) => `
    <button class="cat-tab ${activeCategory === key ? 'active' : ''}" onclick="setCategory('${key}')">
      <span style="margin-right: 6px"><i data-lucide="${val.icon}" class="icon-sm"></i></span>
      ${val.label}
    </button>
  `).join('');
  lucide.createIcons();
}

function setCategory(cat) {
  activeCategory = cat;
  renderMenuTabs();
  renderMenuGrid();
}

function renderMenuGrid() {
  const container = document.getElementById("menu-grid");
  container.innerHTML = MENU[activeCategory].map(item => `
    <div class="menu-card" onclick="openModal(${item.id})">
      <div class="m-img">${item.emoji}</div>
      <div class="m-content">
        <div class="m-header">
          <h3 class="m-name">${item.name}</h3>
          <span class="m-price">$${item.price.toFixed(2)}</span>
        </div>
        <p class="m-desc">${item.desc}</p>
        <div class="m-footer">
          ${item.hasMods ? `<span class="m-mods"><i data-lucide="sparkles" style="width:10px;height:10px;margin-right:4px;"></i> Customizable</span>` : '<span></span>'}
          <div class="m-add"><i data-lucide="plus" class="icon-sm"></i></div>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  container.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="r-header">
        <div class="r-avatar">${r.name.split(" ").map(n => n[0]).join("")}</div>
        <div class="r-info">
          <div class="r-name">${r.name}</div>
          <div class="r-stars">
            ${Array.from({ length: r.stars }).map(() => '<i data-lucide="star" style="width:12px; height:12px; fill:#a855f7;"></i>').join('')}
          </div>
        </div>
        <div class="r-img">📸</div>
      </div>
      <p class="r-text">${r.text}</p>
      <span class="r-tag">${r.tag}</span>
    </div>
  `).join('');
}

// ─── Modal Logic ─────────────────────────────────────────────────────────────

function openModal(itemId) {
  // Find item across all categories
  for (let cat in MENU) {
    const found = MENU[cat].find(i => i.id === itemId);
    if (found) {
      selectedItem = found;
      break;
    }
  }
  if (!selectedItem) return;

  mods = { extraMeat: false, addCheese: false, salsa: "serrano", qty: 1 };
  document.getElementById("modal-container").classList.remove("hidden");
  renderModalContent();
}

function closeModal() {
  document.getElementById("modal-container").classList.add("hidden");
  selectedItem = null;
}

function closeModalOnOutsideClick(e) {
  if (e.target.id === "modal-container") closeModal();
}

function calcPrice() {
  if (!selectedItem) return 0;
  let p = selectedItem.price;
  if (mods.extraMeat && selectedItem.hasMods) p += 1.00;
  if (mods.addCheese && selectedItem.hasMods) p += 0.50;
  return p * mods.qty;
}

function toggleMod(key) {
  mods[key] = !mods[key];
  renderModalContent();
}

function setSalsa(id) {
  mods.salsa = id;
  renderModalContent();
}

function setQty(delta) {
  mods.qty = Math.max(1, mods.qty + delta);
  renderModalContent();
}

function renderModalContent() {
  const container = document.getElementById("modal-container");
  
  let addOnsHtml = '';
  if (selectedItem.hasMods) {
    addOnsHtml = `
      <div style="margin-bottom: 22px;">
        <p class="section-label">Add-Ons</p>
        <div class="mod-row ${mods.extraMeat ? 'active' : 'inactive'}" onclick="toggleMod('extraMeat')">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="custom-check ${mods.extraMeat ? 'checked' : ''}">${mods.extraMeat ? '<i data-lucide="check" style="width:12px; height:12px;"></i>' : ''}</div>
            <span style="font-size:0.9rem; color:${mods.extraMeat ? '#e9d5ff' : 'rgba(255,255,255,0.55)'}">Extra Meat</span>
          </div>
          <span style="font-size:0.82rem; color:#8b5cf6; font-weight:600;">+$1.00</span>
        </div>
        <div class="mod-row ${mods.addCheese ? 'active' : 'inactive'}" onclick="toggleMod('addCheese')">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="custom-check ${mods.addCheese ? 'checked' : ''}">${mods.addCheese ? '<i data-lucide="check" style="width:12px; height:12px;"></i>' : ''}</div>
            <span style="font-size:0.9rem; color:${mods.addCheese ? '#e9d5ff' : 'rgba(255,255,255,0.55)'}">Add Cheese</span>
          </div>
          <span style="font-size:0.82rem; color:#8b5cf6; font-weight:600;">+$0.50</span>
        </div>
      </div>
    `;
  }

  let salsaHtml = `
    <div style="margin-bottom: 22px;">
      <p class="section-label">Choose Your Salsa</p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${SALSAS.map(s => `
          <div class="salsa-opt ${mods.salsa === s.id ? 'selected' : ''}" onclick="setSalsa('${s.id}')">
            <div class="custom-radio ${mods.salsa === s.id ? 'checked' : ''}"></div>
            <div class="salsa-color ${s.colorClass}"></div>
            <span style="font-size:0.88rem; color:${mods.salsa === s.id ? '#e9d5ff' : 'rgba(255,255,255,0.55)'}; flex:1;">${s.label}</span>
            <span style="font-size:0.7rem;">${s.heat}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = `
    <div class="modal-panel">
      <div class="modal-header-img">
        ${selectedItem.emoji}
        <button class="close-btn" onclick="closeModal()"><i data-lucide="x" class="icon-sm"></i></button>
      </div>
      <div class="modal-body">
        <div class="modal-title-row">
          <h3 class="serif modal-title">${selectedItem.name}</h3>
          <span class="modal-price">$${selectedItem.price.toFixed(2)}</span>
        </div>
        <p class="modal-desc">${selectedItem.desc}</p>
        
        ${addOnsHtml}
        ${salsaHtml}

        <div class="qty-row">
          <span style="font-size:0.85rem; color:rgba(255,255,255,0.5); font-weight:500;">Quantity</span>
          <div style="display:flex; align-items:center; gap:14px;">
            <button class="qty-btn" onclick="setQty(-1)"><i data-lucide="minus" class="icon-xs" style="color:#fff;"></i></button>
            <span style="min-width:20px; text-align:center; font-size:1rem; font-weight:600; color:#e9d5ff;">${mods.qty}</span>
            <button class="qty-btn" onclick="setQty(1)"><i data-lucide="plus" class="icon-xs" style="color:#fff;"></i></button>
          </div>
        </div>

        <button class="btn-primary" onclick="addToCart()" style="width:100%; padding:15px; border-radius:14px; font-size:0.95rem; font-weight:700;">
          <i data-lucide="shopping-cart" class="icon-sm"></i> Add to Cart - $${calcPrice().toFixed(2)}
        </button>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// ─── Cart Logic ──────────────────────────────────────────────────────────────

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (cartItems.length > 0) {
    badge.innerText = cartItems.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function addToCart() {
  const item = {
    ...selectedItem,
    mods: { ...mods },
    finalPrice: calcPrice(),
    cartId: Date.now()
  };
  cartItems.push(item);
  updateCartBadge();
  closeModal();
  openCart();
}

function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.cartId !== id);
  updateCartBadge();
  renderCartContent();
}

function openCart() {
  document.getElementById("cart-container").classList.remove("hidden");
  renderCartContent();
}

function closeCart() {
  document.getElementById("cart-container").classList.add("hidden");
}

function setDelivery(method) {
  deliveryMethod = method;
  renderCartContent();
}

function setPayment(method) {
  paymentMethod = method;
  renderCartContent();
}

function placeOrder() {
  orderPlaced = true;
  renderCartContent();
  setTimeout(() => {
    cartItems = [];
    orderPlaced = false;
    updateCartBadge();
    closeCart();
  }, 3500);
}

function renderCartContent() {
  const panel = document.getElementById("cart-panel");
  const cartTotal = cartItems.reduce((s, i) => s + i.finalPrice, 0);
  
  if (orderPlaced) {
    panel.innerHTML = `
      <div class="cart-header">
        <div>
          <h2 style="font-size:1.1rem; font-weight:700; color:#e9d5ff;">Your Order</h2>
        </div>
        <button class="close-btn" style="position:static;" onclick="closeCart()"><i data-lucide="x" class="icon-sm"></i></button>
      </div>
      <div class="cart-body success-pop">
        <div style="font-size:56px; margin-bottom:16px;">✅</div>
        <h3 class="serif gradient-text" style="font-size:1.8rem; margin-bottom:10px;">Order Placed!</h3>
        <p style="color:rgba(255,255,255,0.4); font-size:0.9rem; line-height:1.7;">
          ${paymentMethod === "cod" ? "Pay with cash when your order arrives." : "Payment confirmation sent."}<br/>
          We'll have your tacos ready soon. 🌮
        </p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  if (cartItems.length === 0) {
    panel.innerHTML = `
      <div class="cart-header">
        <div>
          <h2 style="font-size:1.1rem; font-weight:700; color:#e9d5ff;">Your Order</h2>
          <p style="font-size:0.75rem; color:rgba(255,255,255,0.35); margin-top:2px;">0 items</p>
        </div>
        <button class="close-btn" style="position:static;" onclick="closeCart()"><i data-lucide="x" class="icon-sm"></i></button>
      </div>
      <div class="cart-body" style="text-align:center; padding-top:60px;">
        <div style="font-size:48px; margin-bottom:16px; opacity:0.5;">🛒</div>
        <p style="color:rgba(255,255,255,0.3); font-size:0.9rem;">Your cart is empty</p>
        <button class="btn-ghost" onclick="closeCart()" style="margin-top:20px; padding:10px 24px; border-radius:100px; font-size:0.85rem;">Browse Menu</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let itemsHtml = cartItems.map(item => {
    let modsText = '';
    if (item.hasMods) {
      modsText += item.mods.extraMeat ? "Extra Meat · " : "";
      modsText += item.mods.addCheese ? "Add Cheese · " : "";
      const salsaName = SALSAS.find(s => s.id === item.mods.salsa)?.label.split("-")[0].trim();
      modsText += salsaName;
    }
    
    return `
      <div class="cart-item">
        <span style="font-size:24px; flex-shrink:0;">${item.emoji}</span>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; justify-content:space-between;">
            <span style="font-size:0.9rem; font-weight:600; color:#e9d5ff;">${item.name}</span>
            <span style="font-size:0.9rem; font-weight:700; color:#a78bfa;">$${item.finalPrice.toFixed(2)}</span>
          </div>
          ${item.hasMods ? `<div style="margin-top:4px; font-size:0.72rem; color:rgba(255,255,255,0.3);">${modsText}</div>` : ''}
          ${item.mods.qty > 1 ? `<div style="margin-top:4px; font-size:0.72rem; color:rgba(255,255,255,0.3);">Qty: ${item.mods.qty}</div>` : ''}
        </div>
        <button onclick="removeFromCart(${item.cartId})" style="width:26px; height:26px; border-radius:50%; flex-shrink:0; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(239,68,68,0.6);">
          <i data-lucide="x" style="width:12px; height:12px;"></i>
        </button>
      </div>
    `;
  }).join('');

  let checkoutFormHtml = deliveryMethod === "delivery" ? `
    <div style="margin-bottom:16px;">
      <input type="text" class="styled-input" placeholder="Delivery Address">
      <input type="text" class="styled-input" placeholder="Phone Number">
      <textarea class="styled-input" placeholder="Delivery Instructions (optional)" rows="2" style="resize:none;"></textarea>
    </div>
  ` : `
    <div style="background:rgba(109,40,217,0.08); border:1px solid rgba(139,92,246,0.15); border-radius:12px; padding:12px 16px; margin-bottom:16px; display:flex; gap:10px; align-items:center;">
      <i data-lucide="map-pin" class="icon-xs"></i>
      <span style="font-size:0.8rem; color:rgba(255,255,255,0.45);">Pickup at 732 S Alamo St, San Antonio TX 78205</span>
    </div>
  `;

  let totalAmount = cartTotal + (deliveryMethod === "delivery" ? 2 : 0);

  panel.innerHTML = `
    <div class="cart-header">
      <div>
        <h2 style="font-size:1.1rem; font-weight:700; color:#e9d5ff;">Your Order</h2>
        <p style="font-size:0.75rem; color:rgba(255,255,255,0.35); margin-top:2px;">${cartItems.length} item(s)</p>
      </div>
      <button class="close-btn" style="position:static;" onclick="closeCart()"><i data-lucide="x" class="icon-sm"></i></button>
    </div>
    
    <div class="cart-body">
      ${itemsHtml}
      
      <div style="margin-top:24px; margin-bottom:16px;">
        <p class="section-label">Delivery Method</p>
        <div class="del-toggle-grid">
          <button class="del-btn ${deliveryMethod === 'pickup' ? 'active' : 'inactive'}" onclick="setDelivery('pickup')">
            <i data-lucide="package" class="icon-sm"></i> Pickup
          </button>
          <button class="del-btn ${deliveryMethod === 'delivery' ? 'active' : 'inactive'}" onclick="setDelivery('delivery')">
            <i data-lucide="truck" class="icon-sm"></i> Delivery
          </button>
        </div>
      </div>
      
      ${checkoutFormHtml}

      <div style="margin-bottom:24px;">
        <p class="section-label">Payment</p>
        <div class="pay-row ${paymentMethod === 'cod' ? 'active' : 'inactive'}" onclick="setPayment('cod')">
          <div class="custom-radio ${paymentMethod === 'cod' ? 'checked' : ''}"></div>
          <span style="font-size:0.9rem;">💵</span>
          <span style="font-size:0.88rem; color:${paymentMethod === 'cod' ? '#e9d5ff' : 'rgba(255,255,255,0.45)'}; font-weight:500;">Cash on Delivery (COD)</span>
        </div>
        <div class="pay-row ${paymentMethod === 'online' ? 'active' : 'inactive'}" onclick="setPayment('online')">
          <div class="custom-radio ${paymentMethod === 'online' ? 'checked' : ''}"></div>
          <span style="font-size:0.9rem;">💳</span>
          <span style="font-size:0.88rem; color:${paymentMethod === 'online' ? '#e9d5ff' : 'rgba(255,255,255,0.45)'}; font-weight:500;">Pay Online</span>
        </div>
      </div>
    </div>

    <div class="cart-footer">
      <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
        <span style="color:rgba(255,255,255,0.45); font-size:0.85rem;">Subtotal</span>
        <span style="color:#e9d5ff; font-weight:600;">$${cartTotal.toFixed(2)}</span>
      </div>
      ${deliveryMethod === "delivery" ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="color:rgba(255,255,255,0.45); font-size:0.85rem;">Delivery Fee</span>
          <span style="color:#a78bfa; font-weight:600;">$2.00</span>
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between; margin-bottom:18px; padding-top:10px; border-top:1px solid rgba(139,92,246,0.15);">
        <span style="font-weight:700; font-size:1rem; color:#e9d5ff;">Total</span>
        <span class="gradient-text" style="font-weight:700; font-size:1.15rem;">$${totalAmount.toFixed(2)}</span>
      </div>
      <button class="btn-primary" onclick="placeOrder()" style="width:100%; padding:15px; border-radius:14px; font-size:0.95rem; font-weight:700;">
        ${paymentMethod === "cod" ? "Place Order (Cash on Delivery)" : "Proceed to Payment"}
      </button>
    </div>
  `;
  lucide.createIcons();
}
