const productsDiv = document.getElementById("products");
const categoriesDiv = document.getElementById("categories");
const searchInput = document.getElementById("search");

let ALL_PRODUCTS = [];
let CURRENT_CATEGORY = "all";

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    ALL_PRODUCTS = data;
    renderCategories(data);
    renderProducts(data);
  });

function renderProducts(list) {
  productsDiv.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.title}</h3>
      <div class="price">$${p.price}</div>
      <button>Add to Cart</button>
    `;
    productsDiv.appendChild(card);
  });
}

function renderCategories(products) {
  const cats = ["all", ...new Set(products.map(p => p.category))];
  categoriesDiv.innerHTML = "";
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.toUpperCase();
    btn.onclick = () => {
      CURRENT_CATEGORY = cat;
      filter();
    };
    categoriesDiv.appendChild(btn);
  });
}

function filter() {
  let filtered = ALL_PRODUCTS;
  const value = searchInput.value.toLowerCase();

  if (CURRENT_CATEGORY !== "all") {
    filtered = filtered.filter(p => p.category === CURRENT_CATEGORY);
  }

  if (value) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(value)
    );
  }

  renderProducts(filtered);
}

searchInput.addEventListener("input", filter);
