const API_URL = "https://fakestoreapi.com/products";
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FEE = 6.95;
const CART_KEY = "forma_store_cart_v1";

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const cartItemsEl = $("#cartItems");
let products = [];
let activeCategory = "all";
let searchTerm = "";
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter(item => item && Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);
}
function categoryLabel(category) {
  return category.replace("'", "’").replace(/\b\w/g, c => c.toUpperCase());
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function setLoading(isLoading) {
  $("#statusLine").textContent = isLoading ? "Gathering the good stuff…" : "";
  $("#retryButton").closest(".load-error").classList.add("hidden");
}
async function fetchProducts() {
  setLoading(true);
  productGrid.innerHTML = "";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Unexpected product response");
    products = data;
    $("#resultCount").textContent = `${products.length} considered finds`;
    $("#year").textContent = new Date().getFullYear();
    renderProducts();
    renderCart();
  } catch (error) {
    console.error("Product loading failed:", error);
    $("#statusLine").textContent = "";
    $("#loadError").classList.remove("hidden");
    $("#resultCount").textContent = "Collection unavailable";
  }
}
function getVisibleProducts() {
  let visible = products.filter(product => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
    const query = searchTerm.toLowerCase();
    const searchMatch = !query || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  });
  const sort = $("#sortSelect").value;
  if (sort === "price-low") visible.sort((a,b) => a.price-b.price);
  if (sort === "price-high") visible.sort((a,b) => b.price-a.price);
  if (sort === "rating") visible.sort((a,b) => b.rating.rate-a.rating.rate);
  if (sort === "name") visible.sort((a,b) => a.title.localeCompare(b.title));
  return visible;
}
function renderProducts() {
  const visible = getVisibleProducts();
  $("#resultCount").textContent = `${visible.length} ${visible.length === 1 ? "piece" : "pieces"} to discover`;
  if (!visible.length) {
    productGrid.innerHTML = `<div class="no-results"><h3>Nothing just yet.</h3><p>Try another search or browse all pieces.</p><button class="button button-outline" id="clearFilters">Clear filters</button></div>`;
    $("#clearFilters").addEventListener("click", () => {
      activeCategory = "all"; searchTerm = ""; $("#searchInput").value = "";
      $("#categoryFilters").querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.category === "all"));
      renderProducts();
    });
    return;
  }
  productGrid.innerHTML = visible.map((product, index) => {
    const badge = product.rating.rate >= 4.5 ? "Most loved" : index === 0 ? "The edit" : "";
    return `<article class="product-card">
      <div class="product-image-wrap">
        ${badge ? `<span class="product-badge">${badge}</span>` : ""}
        <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}" loading="lazy">
        <button class="quick-add" data-add="${product.id}">＋ Add to bag</button>
      </div>
      <div class="product-meta">
        <p class="product-category">${escapeHTML(categoryLabel(product.category))}</p>
        <h3 class="product-title">${escapeHTML(product.title)}</h3>
        <div class="product-bottom"><span class="product-price">${money(product.price)}</span><span class="rating"><b>★</b> ${Number(product.rating.rate).toFixed(1)} <span>(${product.rating.count})</span></span></div>
      </div>
    </article>`;
  }).join("");
}
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); showToast("Added to your bag");
}
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); renderCart();
}
function updateQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveCart(); renderCart();
}
function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  const isEmpty = cart.length === 0;
  $("#emptyCart").classList.toggle("hidden", !isEmpty);
  $("#cartSummary").classList.toggle("hidden", isEmpty);
  cartItemsEl.classList.toggle("hidden", isEmpty);
  if (!isEmpty) {
    cartItemsEl.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return "";
      return `<div class="cart-item">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.title)}">
        <div><p class="item-category">${escapeHTML(categoryLabel(product.category))}</p><h4>${escapeHTML(product.title)}</h4>
          <span class="item-price">${money(product.price * item.quantity)}</span>
          <div class="quantity-control"><button data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">＋</button></div>
        </div><button class="remove-item" data-remove="${item.id}">Remove</button>
      </div>`;
    }).join("");
  }
  const totals = calculateTotal();
  $("#subtotalValue").textContent = money(totals.subtotal);
  $("#taxValue").textContent = money(totals.tax);
  $("#shippingValue").textContent = totals.shipping === 0 ? "Complimentary" : money(totals.shipping);
  $("#totalValue").textContent = money(totals.total);
  $("#shippingNote").textContent = totals.subtotal >= FREE_SHIPPING_THRESHOLD
    ? "Lovely — your order qualifies for complimentary shipping."
    : `Add ${money(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for complimentary shipping.`;
  $("#checkoutTotal").textContent = money(totals.total);
}
function openCart() {
  cartDrawer.classList.add("open"); overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  $("#closeCart").focus();
}
function closeCart() {
  cartDrawer.classList.remove("open"); overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
}
function openCheckout() {
  if (!cart.length) return;
  closeCart();
  $("#checkoutTotal").textContent = money(calculateTotal().total);
  $("#checkoutFormView").classList.remove("hidden");
  $("#confirmationView").classList.add("hidden");
  $("#checkoutModal").classList.add("open");
  $("#checkoutModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeCheckout() {
  $("#checkoutModal").classList.remove("open");
  $("#checkoutModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$("#categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  $("#categoryFilters").querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
});
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
cartItemsEl.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) updateQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});
$("#searchInput").addEventListener("input", event => { searchTerm = event.target.value.trim(); renderProducts(); });
$("#sortSelect").addEventListener("change", renderProducts);
$("#focusSearch").addEventListener("click", () => { $("#shop").scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("#searchInput").focus(), 450); });
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#checkoutButton").addEventListener("click", openCheckout);
$("#closeCheckout").addEventListener("click", closeCheckout);
$("#modalBackdrop").addEventListener("click", closeCheckout);
$("#retryButton").addEventListener("click", fetchProducts);
$("#checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) return;
  const formData = new FormData(event.currentTarget);
  const orderId = `FM-${Date.now().toString().slice(-7)}`;
  $("#orderNumber").textContent = orderId;
  $("#checkoutFormView").classList.add("hidden");
  $("#confirmationView").classList.remove("hidden");
  cart = []; saveCart(); renderCart();
  event.currentTarget.reset();
});
$("#finishOrder").addEventListener("click", () => { closeCheckout(); showToast("Thanks for exploring FORMA."); });
$("#menuToggle").addEventListener("click", () => $(".main-nav").classList.toggle("open"));
document.querySelectorAll("[data-category-link]").forEach(link => link.addEventListener("click", () => {
  activeCategory = link.dataset.categoryLink;
  $("#categoryFilters").querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.category === activeCategory));
  renderProducts(); $(".main-nav").classList.remove("open");
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { closeCart(); closeCheckout(); $(".main-nav").classList.remove("open"); }
});

fetchProducts();
