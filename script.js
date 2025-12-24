// ===============================
// GLOBAL ELEMENTS
// ===============================
const productsDiv = document.getElementById("products");
const categoriesDiv = document.getElementById("categories");
const searchInput = document.getElementById("search");

// ===============================
// STATE
// ===============================
let ALL_PRODUCTS = [];
let CURRENT_CATEGORY = "all";

// ===============================
// FETCH REAL PRODUCTS
// ===============================
fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    ALL_PRODUCTS = data;
    renderCategories(data);
    renderProducts(data);
  })
  .catch(err => {
    productsDiv.innerHTML = "<p>Failed to load products</p>";
    console.error(err);
  });

// ===============================
// RENDER PRODUCTS
// ===============================
function renderProducts(list) {
  productsDiv.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="price">$${p.price}</div>
      <button class="add">Add to Cart</button>
    `;

    // Click anywhere → product page
    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${p.id}`;
    });

    productsDiv.appendChild(card);
  });
}

// ===============================
// RENDER CATEGORIES
// ===============================
function renderCategories(products) {
  const cats = ["all", ...new Set(products.map(p => p.category))];
  categoriesDiv.innerHTML = "";

  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.toUpperCase();

    btn.addEventListener("click", () => {
      CURRENT_CATEGORY = cat;
      filterAndRender();
    });

    categoriesDiv.appendChild(btn);
  });
}

// ===============================
// SEARCH + CATEGORY FILTER
// ===============================
function filterAndRender() {
  const searchValue = searchInput.value.toLowerCase();

  let filtered = ALL_PRODUCTS;

  if (CURRENT_CATEGORY !== "all") {
    filtered = filtered.filter(
      p => p.category === CURRENT_CATEGORY
    );
  }

  if (searchValue) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchValue)
    );
  }

  renderProducts(filtered);
}

searchInput.addEventListener("input", filterAndRender);

