const productsEl = document.getElementById("products");
const catEl = document.getElementById("categories");
const cartCount = document.getElementById("cartCount");
const search = document.getElementById("search");

let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart") || "[]");

updateCart();

fetch("https://fakestoreapi.com/products")
  .then(r => r.json())
  .then(data => {
    PRODUCTS = data;
    renderCategories();
    renderProducts(data);
    loadProductPage();
  });

function renderProducts(list) {
  if (!productsEl) return;
  productsEl.innerHTML = "";
  list.forEach(p => {
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `
      <img src="${p.image}">
      <h4>${p.title}</h4>
      <div class="price">$${p.price}</div>
      <div class="ui-btn">Add to Cart</div>
    `;
    c.onclick = () => location.href = `product.html?id=${p.id}`;
    productsEl.appendChild(c);
  });
}

function renderCategories() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  catEl.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.textContent = c;
    d.onclick = () => {
      renderProducts(c === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === c));
    };
    catEl.appendChild(d);
  });
}

if (search) {
  search.oninput = () => {
    const v = search.value.toLowerCase();
    renderProducts(PRODUCTS.filter(p => p.title.toLowerCase().includes(v)));
  };
}

function loadProductPage() {
  const box = document.getElementById("productPage");
  if (!box) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.id == id);
  if (!p) return;

  box.innerHTML = `
    <div class="card">
      <img src="${p.image}">
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <div class="price">$${p.price}</div>
      <div class="ui-btn" onclick="addToCart(${p.id})">Add to Cart</div>
    </div>
  `;
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id == id);
  CART.push(p);
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCart();
}

function updateCart() {
  if (cartCount) cartCount.textContent = CART.length;
}
