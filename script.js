const productsEl = document.getElementById("products");
const categoriesEl = document.getElementById("categories");
const searchEl = document.getElementById("search");
const modal = document.getElementById("modal");
const cartCount = document.getElementById("cartCount");

let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem("cart") || "[]");

updateCartCount();

fetch("https://fakestoreapi.com/products")
  .then(r => r.json())
  .then(data => {
    PRODUCTS = data;
    renderCategories();
    renderProducts(data);
  });

function renderProducts(list) {
  productsEl.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.title}</h3>
      <div class="price">$${p.price}</div>
      <button>Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => addToCart(p);
    card.onclick = e => {
      if (e.target.tagName !== "BUTTON") showModal(p);
    };

    productsEl.appendChild(card);
  });
}

function renderCategories() {
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  categoriesEl.innerHTML = "";
  cats.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.onclick = () => {
      const filtered = c === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === c);
      renderProducts(filtered);
    };
    categoriesEl.appendChild(btn);
  });
}

searchEl.oninput = () => {
  const val = searchEl.value.toLowerCase();
  renderProducts(PRODUCTS.filter(p => p.title.toLowerCase().includes(val)));
};

function addToCart(p) {
  CART.push(p);
  localStorage.setItem("cart", JSON.stringify(CART));
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = CART.length;
}

function showModal(p) {
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div>
      <h2>${p.title}</h2>
      <img src="${p.image}" style="width:200px">
      <p>${p.description}</p>
      <button onclick="closeModal()">Close</button>
    </div>
  `;
}

function closeModal() {
  modal.classList.add("hidden");
}
