/* Zo’s Collection storefront behavior. Update the contact details below before launch. */
const STORE = {
  // Use your WhatsApp number with country code and digits only, e.g. 919876543210.
  whatsappNumber: "910000000000",
  phoneDisplay: "+91 00000 00000",
  phoneLink: "+910000000000",
  upiId: "your-upi-id@bank"
};

const PRODUCTS = window.ZOS_PRODUCTS || [];
const CART_KEY = "zos-collection-cart-v1";
const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const saveCart = cart => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); };
const getProduct = id => PRODUCTS.find(product => product.id === String(id));

function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(badge => badge.textContent = count);
}

function addToCart(id, size = "M") {
  const product = getProduct(id);
  if (!product) return;
  const cart = readCart();
  const existing = cart.find(item => item.id === product.id && item.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, size, quantity: 1 });
  saveCart(cart);
  const button = document.querySelector("[data-add-to-cart]");
  if (button) { const original = button.innerHTML; button.textContent = "Added to your bag ✓"; setTimeout(() => button.innerHTML = original, 1400); }
}

function productCard(product) {
  return `<article class="product-card"><a class="product-image" href="product.html?id=${encodeURIComponent(product.id)}"><img src="${product.image}" alt="${product.alt}" loading="lazy"><span class="product-tag">${product.tag}</span></a><div class="product-info"><div><h3><a href="product.html?id=${encodeURIComponent(product.id)}">${product.name}</a></h3><p>${product.category}</p></div><span class="product-price">${money(product.price)}</span></div></article>`;
}

function renderProductGrids() {
  const featured = document.querySelector("[data-featured]");
  if (featured) featured.innerHTML = PRODUCTS.slice(0, Number(featured.dataset.featured) || 4).map(productCard).join("");
  const grid = document.querySelector("[data-shop-grid]");
  if (grid) {
    const filter = document.querySelector("#category-filter");
    const paint = () => {
      const visible = filter.value === "all" ? PRODUCTS : PRODUCTS.filter(product => product.category === filter.value);
      grid.innerHTML = visible.map(productCard).join("");
      const total = document.querySelector(".product-total");
      if (total) total.textContent = `${visible.length} PIECES`;
    };
    filter.addEventListener("change", paint);
    paint();
  }
}

function renderProductDetail() {
  const root = document.querySelector("[data-product-detail]");
  if (!root) return;
  const product = getProduct(new URLSearchParams(location.search).get("id"));
  if (!product) {
    root.innerHTML = `<section class="not-found"><p class="eyebrow">NOT FOUND</p><h1>That piece isn’t here.</h1><p>It may have moved. Explore the full collection instead.</p><a class="button button-dark" href="shop.html">Shop all pieces <span>↗</span></a></section>`;
    document.title = "Product not found | Zo’s Collection";
    return;
  }
  document.title = `${product.name} | Zo’s Collection`;
  document.querySelector('meta[name="description"]').content = `${product.name} — ${product.description} Shop online from Zo’s Collection.`;
  document.querySelector('meta[property="og:title"]').content = `${product.name} | Zo’s Collection`;
  document.querySelector('meta[property="og:description"]').content = product.description;
  document.querySelector('meta[property="og:image"]').content = new URL(product.image, location.href).href;
  root.innerHTML = `<section class="product-detail"><div class="detail-image"><img src="${product.image}" alt="${product.alt}"></div><div class="detail-copy"><div class="breadcrumbs"><a href="shop.html">Shop</a> &nbsp;/&nbsp; ${product.category}</div><p class="eyebrow">${product.tag}</p><h1>${product.name}</h1><p class="detail-price">${money(product.price)}</p><p class="detail-description">${product.description}</p><div class="size-label"><span>Choose your size</span><small>Size guide coming soon</small></div><div class="size-options">${product.sizes.map((size, index) => `<button type="button" class="size-option${index === 1 ? " selected" : ""}" aria-pressed="${index === 1}" data-size="${size}">${size}</button>`).join("")}</div><button class="button button-dark detail-add" type="button" data-add-to-cart data-id="${product.id}">Add to bag <span>↗</span></button><p class="detail-help"><b>Easy ordering.</b> UPI or cash on delivery available at checkout.</p></div></section>`;
  let selected = product.sizes[1] || product.sizes[0];
  root.querySelectorAll("[data-size]").forEach(button => button.addEventListener("click", () => {
    selected = button.dataset.size;
    root.querySelectorAll("[data-size]").forEach(option => { option.classList.toggle("selected", option === button); option.setAttribute("aria-pressed", String(option === button)); });
  }));
  root.querySelector("[data-add-to-cart]").addEventListener("click", () => addToCart(product.id, selected));
}

function renderCart() {
  const root = document.querySelector("[data-cart-items]");
  if (!root) return;
  const cart = readCart().filter(item => getProduct(item.id));
  const total = cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0);
  const totalNode = document.querySelector("[data-cart-total]");
  if (totalNode) totalNode.textContent = money(total);
  if (!cart.length) {
    root.innerHTML = `<div class="cart-empty"><h2>Your bag is taking a breather.</h2><p>There’s nothing here just yet. Find the pieces you’ll wear on repeat.</p><a class="button button-dark" href="shop.html">Explore the collection <span>↗</span></a></div>`;
    return;
  }
  root.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    return `<article class="cart-row" data-cart-id="${product.id}" data-cart-size="${item.size}"><img class="cart-thumb" src="${product.image}" alt="${product.alt}"><div class="cart-product"><h3>${product.name}</h3><p>Size: ${item.size}</p><div class="quantity-control"><button type="button" aria-label="Decrease quantity" data-quantity="-1">−</button><span>${item.quantity}</span><button type="button" aria-label="Increase quantity" data-quantity="1">+</button></div><button class="remove-item" type="button" data-remove>Remove</button></div><span class="cart-row-total">${money(product.price * item.quantity)}</span></article>`;
  }).join("");
  root.querySelectorAll(".cart-row").forEach(row => {
    const change = amount => {
      const updated = readCart().map(item => item.id === row.dataset.cartId && item.size === row.dataset.cartSize ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0);
      saveCart(updated); renderCart();
    };
    row.querySelectorAll("[data-quantity]").forEach(button => button.addEventListener("click", () => change(Number(button.dataset.quantity))));
    row.querySelector("[data-remove]").addEventListener("click", () => { saveCart(readCart().filter(item => !(item.id === row.dataset.cartId && item.size === row.dataset.cartSize))); renderCart(); });
  });
}

function configureContact() {
  const hasRealWhatsapp = STORE.whatsappNumber !== "910000000000";
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    const message = encodeURIComponent("Hello Zo’s Collection! I have a question about your collection.");
    link.href = hasRealWhatsapp ? `https://wa.me/${STORE.whatsappNumber}?text=${message}` : "#";
    if (hasRealWhatsapp) { link.target = "_blank"; link.rel = "noopener"; }
    else link.addEventListener("click", event => { event.preventDefault(); alert("Before launch, add your real WhatsApp number in js/main.js."); });
  });
  document.querySelectorAll("[data-phone-display]").forEach(node => node.textContent = STORE.phoneDisplay);
  document.querySelectorAll("[data-phone-link]").forEach(node => node.href = `tel:${STORE.phoneLink}`);
  document.querySelectorAll("[data-upi-id]").forEach(node => node.textContent = STORE.upiId);
}

function setupCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const cart = readCart();
    if (!cart.length) { alert("Your bag is empty. Add a piece before placing an order."); return; }
    if (STORE.whatsappNumber === "910000000000") { alert("Before taking live orders, update the sample WhatsApp number in js/main.js to your real number."); return; }
    const data = new FormData(form);
    const lines = cart.map(item => { const product = getProduct(item.id); return `• ${product.name} (Size ${item.size}) × ${item.quantity} — ${money(product.price * item.quantity)}`; });
    const payment = document.querySelector('input[name="payment"]:checked')?.value || "UPI";
    const message = [`Hello Zo’s Collection, I’d like to place an order:`, "", ...lines, "", `Total: ${money(cart.reduce((sum, item) => sum + getProduct(item.id).price * item.quantity, 0))}`, `Payment: ${payment}`, "", `Name: ${data.get("name")}`, `Phone: ${data.get("phone")}`, `Address: ${data.get("address")}`].join("\n");
    window.open(`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProductGrids();
  renderProductDetail();
  renderCart();
  configureContact();
  setupCheckout();
  setupMobileMenu();
});
