document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.replace("login.html");
  }
});

const productsDiv = document.getElementById("products");
const categoriesDiv = document.getElementById("categories");
const searchInput = document.getElementById("search");

let ALL_PRODUCTS = [];

// FETCH REAL PRODUCTS
fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    ALL_PRODUCTS = data;
    renderProducts(data);
    renderCategories(data);
  });

// RENDER PRODUCTS
function renderProducts(list) {
  productsDiv.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.title}</h3>
      <div class="price">$${p.price}</div>
      <button class="add">Add to Cart</button>
    `;
    card.onclick = () => {
      location.href = `product.html?id=${p.id}`;
    };
    productsDiv.appendChild(card);
  });
}

// RENDER CATEGORIES
function renderCategories(products) {
  const categories = ["all", ...new Set(products.map(p => p.category))];
  categoriesDiv.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.toUpperCase();
    btn.onclick = () => {
      if (cat === "all") {
        renderProducts(ALL_PRODUCTS);
      } else {
        renderProducts(
          ALL_PRODUCTS.filter(p => p.category === cat)
        );
      }
    };
    categoriesDiv.appendChild(btn);
  });
}

// SEARCH
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  renderProducts(
    ALL_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(value)
    )
  );
});
