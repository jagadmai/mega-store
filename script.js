const PRODUCTS = [
  {
    id: 1,
    title: "Apple iPhone 14",
    price: 799,
    image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL1500_.jpg"
  },
  {
    id: 2,
    title: "Dell XPS 13 Laptop",
    price: 1199,
    image: "https://m.media-amazon.com/images/I/61vFO3R5UNL._AC_SL1500_.jpg"
  },
  {
    id: 3,
    title: "HP Spectre x360",
    price: 1299,
    image: "https://m.media-amazon.com/images/I/61t0e9+ZkXL._AC_SL1500_.jpg"
  },
  {
    id: 4,
    title: "Sony WH-1000XM5 Headphones",
    price: 399,
    image: "https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg"
  },
  {
    id: 5,
    title: "PlayStation 5",
    price: 499,
    image: "https://m.media-amazon.com/images/I/619BkvKW35L._AC_SL1500_.jpg"
  },
  {
    id: 6,
    title: "Apple Watch Series 9",
    price: 429,
    image: "https://m.media-amazon.com/images/I/71XKAnxCsLL._AC_SL1500_.jpg"
  }
];

// 🔁 duplicate products to make MANY cards
const MANY_PRODUCTS = [];
for (let i = 0; i < 150; i++) {
  PRODUCTS.forEach(p => {
    MANY_PRODUCTS.push({
      ...p,
      id: MANY_PRODUCTS.length + 1,
      title: p.title + " #" + (i + 1)
    });
  });
}

const container = document.getElementById("products");
const search = document.getElementById("search");

function render(list) {
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}" loading="lazy">
      <h3>${p.title}</h3>
      <div class="price">$${p.price}</div>
      <button>Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  render(
    MANY_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(value)
    )
  );
});

render(MANY_PRODUCTS);
