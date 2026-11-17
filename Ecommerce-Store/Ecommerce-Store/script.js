const API_URL = "https://fakestoreapi.com/products";

// Application state
let products = [];
let cart = loadCart();
let activeCategory = "all";

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const checkoutModal = document.getElementById("checkoutModal");

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem("shopCart") || "[]");
        return Array.isArray(saved)
            ? saved.filter(item =>
                item &&
                Number.isInteger(item.id) &&
                Number.isFinite(item.price) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
              )
            : [];
    } catch {
        return [];
    }
}

const formatPrice = amount => "$" + Number(amount).toFixed(2);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(cart));
}

async function fetchProducts() {
    productGrid.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Unable to fetch products");

        products = await response.json();
        displayProducts(products);
    } catch (error) {
        productGrid.innerHTML = `
            <div class="loading error-message">
                <p>Failed to load products. Check your internet connection.</p>
                <button class="retry-btn" id="retryProducts">Try Again</button>
            </div>`;
        document.getElementById("retryProducts")
            .addEventListener("click", fetchProducts);
    }
}

function displayProducts(items) {
    document.getElementById("productCount").textContent =
        `${items.length} products found`;

    if (!items.length) {
        productGrid.innerHTML =
            '<div class="empty-message">No products found.</div>';
        return;
    }

    productGrid.innerHTML = items.map(product => {
        const title = escapeHTML(product.title);
        const category = escapeHTML(product.category);
        const image = escapeHTML(product.image);
        const rating = Number(product.rating?.rate || 0);
        const ratingCount = Number(product.rating?.count || 0);

        return `
            <article class="product-card">
                <span class="badge">Featured</span>
                <img src="${image}" alt="${title}" class="product-image" loading="lazy">
                <p class="product-category">${category}</p>
                <h3 title="${title}">${title}</h3>
                <p class="rating">⭐ ${rating.toFixed(1)} (${ratingCount} reviews)</p>
                <p class="price">${formatPrice(product.price)}</p>
                <button class="add-btn" data-add="${product.id}">Add to Cart</button>
            </article>`;
    }).join("");
}

function searchProducts() {
    const searchText = document.getElementById("searchInput").value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchText);
        const matchesCategory =
            activeCategory === "all" || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

document.getElementById("searchBtn").addEventListener("click", searchProducts);
document.getElementById("searchInput").addEventListener("input", searchProducts);

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        activeCategory = button.dataset.category;
        searchProducts();
    });
});

// Event delegation keeps product buttons working after the grid is re-rendered.
productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(Number(button.dataset.add));
});

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(entry => entry.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCart();
}

function calculateTotal() {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );
    const tax = subtotal * 0.05;
    const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 10;
    return {
        subtotal,
        tax,
        shipping,
        grandTotal: subtotal + tax + shipping
    };
}

function updateCart() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = totalQuantity;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const title = escapeHTML(item.title);
            const image = escapeHTML(item.image);
            return `
                <div class="cart-item">
                    <img src="${image}" alt="${title}">
                    <div class="cart-info">
                        <h4>${title}</h4>
                        <p>${formatPrice(item.price)}</p>
                        <div class="quantity-controls">
                            <button data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button>
                            <span>${item.quantity}</span>
                            <button data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">+</button>
                            <button class="remove-btn" data-remove="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>`;
        }).join("");
    }

    const totals = calculateTotal();
    document.getElementById("subtotal").textContent = formatPrice(totals.subtotal);
    document.getElementById("tax").textContent = formatPrice(totals.tax);
    document.getElementById("shipping").textContent =
        totals.shipping === 0 && totals.subtotal > 0
            ? "FREE"
            : formatPrice(totals.shipping);
    document.getElementById("grandTotal").textContent =
        formatPrice(totals.grandTotal);

    const checkoutButton = document.getElementById("checkoutBtn");
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.style.opacity = cart.length === 0 ? "0.5" : "1";
}

cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        updateQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    } else if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCart();
});

function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;

    const totals = calculateTotal();
    const orderId = "ORD-" + Date.now().toString().slice(-8);

    document.getElementById("orderId").textContent = orderId;
    document.getElementById("orderTotal").textContent =
        formatPrice(totals.grandTotal);

    closeCart();
    checkoutModal.classList.add("show");

    // This is a simulated checkout; no payment is collected.
    cart = [];
    saveCart();
    updateCart();
});

function closeCheckoutModal() {
    checkoutModal.classList.remove("show");
}

document.getElementById("closeModal").addEventListener("click", closeCheckoutModal);
document.getElementById("continueShopping")
    .addEventListener("click", closeCheckoutModal);

checkoutModal.addEventListener("click", event => {
    if (event.target === checkoutModal) closeCheckoutModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckoutModal();
    }
});

// Initialize application
fetchProducts();
updateCart();
