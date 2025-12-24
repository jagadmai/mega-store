/* =========================
   GLOBAL STATE
========================= */

let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart") || "[]");
let WISHLIST = JSON.parse(localStorage.getItem("wishlist") || "[]");
let ORDERS = JSON.parse(localStorage.getItem("orders") || "[]");

/* =========================
   ELEMENTS (SAFE)
========================= */

const productsEl = document.getElementById("products");
const categoriesEl = document.getElementById("categories");
const searchEl = document.getElementById("search");
const cartCountEl = document.getElementById("cartCount");

/* =========================
   INIT
========================= */

updateCartCount();

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    PRODUCTS = data;
    renderCategories();
    renderProducts(PRODUCTS);
    loadProductPage();
    loadCartPage();
    loadWishlistPage();
    loadOrdersPage();
  })
  .catch(() => {
    console.error("Failed to load products");
  });

/* =========================
   HOME PAGE
========================= */

function renderProducts(list) {
  if (!productsEl) return;

  productsEl.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
      <div class="ui-btn">Add to Cart</div>
    `;

    card.querySelector(".ui-btn").onclick = e => {
      e.stopPropagation();
      addToCart(p.id);
    };

    card.onclick = () => {
      location.href = `product.html?id=${p.id}`;
    };

    productsEl.appendChild(card);
  });
}

function renderCategories() {
  if (!categoriesEl) return;

  const cats = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  categoriesEl.innerHTML = "";

  cats.forEach(cat => {
    const el = document.createElement("div");
    el.textContent = cat;
    el.onclick = () => {
      if (cat === "All") {
        renderProducts(PRODUCTS);
      } else {
        renderProducts(PRODUCTS.filter(p => p.category === cat));
      }
    };
    categoriesEl.appendChild(el);
  });
}

if (searchEl) {
  searchEl.oninput = () => {
    const q = searchEl.value.toLowerCase();
    renderProducts(
      PRODUCTS.filter(p => p.title.toLowerCase().includes(q))
    );
  };
}

/* =========================
   PRODUCT PAGE
========================= */

function loadProductPage() {
  const box = document.getElementById("productPage");
  if (!box) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.id == id);

  if (!p) {
    box.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  box.innerHTML = `
    <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
      <img src="${p.image}" style="height:350px;object-fit:contain;">
      <div>
        <h1>${p.title}</h1>
        <div class="price" style="font-size:22px">$${p.price}</div>
        <p style="margin-top:15px">${p.description}</p>

        <div style="margin-top:25px;display:flex;gap:15px;">
          <div class="ui-btn" onclick="addToCart(${p.id})">Add to Cart</div>
          <div class="ui-btn outline" onclick="addToWishlist(${p.id})">Add to Wishlist</div>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   CART
========================= */

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id == id);
  if (!p) return;

  CART.push(p);
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
}

function updateCartCount() {
  if (cartCountEl) cartCountEl.textContent = CART.length;
}

function loadCartPage() {
  const box = document.getElementById("cartItems");
  if (!box) return;

  box.innerHTML = "";
  CART.forEach(p => {
    const d = document.createElement("div");
    d.className = "cart-item";
    d.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
      <div class="ui-btn" onclick="location.href='product.html?id=${p.id}'">
        View Product
      </div>
    `;
    box.appendChild(d);
  });
}

function checkout() {
  if (!CART.length) return alert("Cart is empty");

  ORDERS = [...ORDERS, ...CART];
  localStorage.setItem("orders", JSON.stringify(ORDERS));
  CART = [];
  localStorage.removeItem("cart");
  location.href = "orders.html";
}

/* =========================
   WISHLIST
========================= */

function addToWishlist(id) {
  const p = PRODUCTS.find(x => x.id == id);
  if (!p) return;

  WISHLIST.push(p);
  localStorage.setItem("wishlist", JSON.stringify(WISHLIST));
}

function loadWishlistPage() {
  const box = document.getElementById("wishlistItems");
  if (!box) return;

  box.innerHTML = "";
  WISHLIST.forEach(p => {
    const d = document.createElement("div");
    d.className = "cart-item";
    d.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="ui-btn" onclick="location.href='product.html?id=${p.id}'">
        View Product
      </div>
    `;
    box.appendChild(d);
  });
}

/* =========================
   ORDERS
========================= */

function loadOrdersPage() {
  const box = document.getElementById("orders");
  if (!box) return;

  box.innerHTML = "";
  ORDERS.forEach(p => {
    const d = document.createElement("div");
    d.className = "cart-item";
    d.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
    `;
    box.appendChild(d);
  });
}
