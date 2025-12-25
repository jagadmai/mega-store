/* =====================================================
   MEGASTORE — ADVANCED CLIENT ENGINE (NO RECOMMENDATIONS)
   ===================================================== */

/* ------------------------------
   GLOBAL STATE (PERSISTENT)
-------------------------------- */

const STATE = {
  products: [],
  cart: JSON.parse(localStorage.getItem("cart") || "{}"),
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "{}"),
  user: JSON.parse(localStorage.getItem("user") || "null")
};

/* ------------------------------
   SAFE DOM REFERENCES
-------------------------------- */

const DOM = {
  products: document.getElementById("products"),
  categories: document.getElementById("categories"),
  search: document.getElementById("search"),
  cartCount: document.getElementById("cartCount"),
  cartItems: document.getElementById("cartItems"),
  wishlistItems: document.getElementById("wishlistItems"),
  orders: document.getElementById("orders"),
  productPage: document.getElementById("productPage")
};

/* ------------------------------
   UTILITIES
-------------------------------- */

const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const debounce = (fn, t = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), t);
  };
};

/* ------------------------------
   INIT
-------------------------------- */

updateCartCount();

fetch("https://fakestoreapi.com/products")
  .then(r => r.json())
  .then(data => {
    STATE.products = data;
    initHome();
    initProductPage();
    initCartPage();
    initWishlistPage();
    initOrdersPage();
  });

/* =====================================================
   HOME PAGE (GRID, SEARCH, CATEGORIES)
   ===================================================== */

function initHome() {
  if (!DOM.products) return;
  renderCategories();
  renderGrid(STATE.products);

  if (DOM.search) {
    DOM.search.addEventListener("input",
      debounce(e => {
        const q = e.target.value.toLowerCase();
        renderGrid(
          STATE.products.filter(p =>
            p.title.toLowerCase().includes(q)
          )
        );
      }, 250)
    );
  }
}

function renderCategories() {
  if (!DOM.categories) return;
  const cats = ["All", ...new Set(STATE.products.map(p => p.category))];
  DOM.categories.innerHTML = "";

  cats.forEach(c => {
    const el = document.createElement("div");
    el.textContent = c;
    el.tabIndex = 0;
    el.onclick = () => {
      renderGrid(
        c === "All"
          ? STATE.products
          : STATE.products.filter(p => p.category === c)
      );
    };
    DOM.categories.appendChild(el);
  });
}

function renderGrid(list) {
  DOM.products.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img loading="lazy" src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
      <div class="ui-btn">Add to Cart</div>
    `;

    card.onclick = () =>
      location.href = `product.html?id=${p.id}`;

    card.querySelector(".ui-btn").onclick = e => {
      e.stopPropagation();
      addToCart(p.id);
    };

    DOM.products.appendChild(card);
  });
}

/* =====================================================
   PRODUCT PAGE (SINGLE SOURCE OF TRUTH)
   ===================================================== */

function initProductPage() {
  if (!DOM.productPage) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = STATE.products.find(x => x.id == id);
  if (!p) {
    DOM.productPage.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  DOM.productPage.innerHTML = `
    <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">
      <img src="${p.image}" style="height:400px;object-fit:contain;">
      <div>
        <h1>${p.title}</h1>
        <div class="price" style="font-size:24px">$${p.price}</div>
        <p>${p.description}</p>

        <div style="display:flex;gap:15px;margin-top:25px;">
          <div class="ui-btn" onclick="addToCart(${p.id})">Add to Cart</div>
          <div class="ui-btn outline" onclick="toggleWishlist(${p.id})">
            ${STATE.wishlist[p.id] ? "Remove Wishlist" : "Add Wishlist"}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =====================================================
   CART SYSTEM (QUANTITY + TOTALS)
   ===================================================== */

function addToCart(id) {
  STATE.cart[id] = (STATE.cart[id] || 0) + 1;
  save("cart", STATE.cart);
  updateCartCount();
}

function updateCartCount() {
  if (!DOM.cartCount) return;
  DOM.cartCount.textContent =
    Object.values(STATE.cart).reduce((a, b) => a + b, 0);
}

function initCartPage() {
  if (!DOM.cartItems) return;

  DOM.cartItems.innerHTML = "";
  let total = 0;

  Object.keys(STATE.cart).forEach(id => {
    const p = STATE.products.find(x => x.id == id);
    const qty = STATE.cart[id];
    total += p.price * qty;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div>Qty: ${qty}</div>
      <div class="price">$${(p.price * qty).toFixed(2)}</div>
    `;
    row.onclick = () =>
      location.href = `product.html?id=${p.id}`;

    DOM.cartItems.appendChild(row);
  });

  if (DOM.cartItems.innerHTML)
    DOM.cartItems.innerHTML += `
      <h2 style="grid-column:1/-1">Total: $${total.toFixed(2)}</h2>
    `;
}

/* =====================================================
   WISHLIST
   ===================================================== */

function toggleWishlist(id) {
  STATE.wishlist[id]
    ? delete STATE.wishlist[id]
    : (STATE.wishlist[id] = true);
  save("wishlist", STATE.wishlist);
  location.reload();
}

function initWishlistPage() {
  if (!DOM.wishlistItems) return;

  Object.keys(STATE.wishlist).forEach(id => {
    const p = STATE.products.find(x => x.id == id);
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="ui-btn" onclick="location.href='product.html?id=${p.id}'">
        View
      </div>
    `;
    DOM.wishlistItems.appendChild(el);
  });
}

/* =====================================================
   ORDERS (SIMULATED)
   ===================================================== */

function initOrdersPage() {
  if (!DOM.orders) return;

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.forEach(p => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
    `;
    DOM.orders.appendChild(el);
  });
}
document.getElementById("cartCount").textContent =
  JSON.parse(localStorage.getItem("cart") || "[]").length;
function filterByCategory(cat) {
  if (cat === "All") {
    renderProducts(PRODUCTS);
  }
}
if (localStorage.getItem("loggedIn") === "true") {
  const hello = document.getElementById("helloText");
  if (hello) hello.textContent = "Hello, Pranav";
}
function goToCart() {
  window.location.href = "cart.html";
}
(function fixCartText() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  const cartEl = document.getElementById("cartCount");
  if (cartEl) {
    cartEl.textContent = cartData.length;
  }
})();
