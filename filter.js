// ============================================================
// 🧩 FILTER PROJECT – Advanced with CART (Complete Version)
// ============================================================

// ===== PRODUCT CLASS (OOP + Error Handling) =====
class Product {
  constructor(id, name, img, price, cat) {
    try {
      if (!name || !img || !price || !cat) {
        throw new Error("Missing product data");
      }
      this.id = id;
      this.name = name;
      this.img = img;
      this.price = price;
      this.cat = cat;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
    }
  }
}

// ===== PRODUCT DATA =====
const data = [
  new Product(
    1,
    "Invicta Men's Pro Diver",
    "https://m.media-amazon.com/images/I/71e04Q53xlL._AC_UY879_.jpg",
    74,
    "Dress"
  ),
  new Product(
    2,
    "Timex Men's Expedition Scout",
    "https://m.media-amazon.com/images/I/91WvnZ1g40L._AC_UY879_.jpg",
    40,
    "Sport"
  ),
  new Product(
    3,
    "Breitling Superocean Heritage",
    "https://m.media-amazon.com/images/I/61hGDiWBU8L._AC_UY879_.jpg",
    200,
    "Luxury"
  ),
  new Product(
    4,
    "Casio Classic Resin Strap",
    "https://m.media-amazon.com/images/I/51Nk5SEBARL._AC_UY879_.jpg",
    16,
    "Sport"
  ),
  new Product(
    5,
    "Garmin Venu Smartwatch",
    "https://m.media-amazon.com/images/I/51kyjYuOZhL._AC_SL1000_.jpg",
    120,
    "Casual"
  ),
];

// ===== FAVORITES + CART STATE (Persistent) =====
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== DOM REFERENCES =====
const productsContainer = document.querySelector(".products");
const searchInput = document.querySelector(".search");
const categoriesContainer = document.querySelector(".cats");
const priceRange = document.querySelector(".priceRange");
const priceValue = document.querySelector(".priceValue");
const sortSelect = document.getElementById("sortSelect");
const resetBtn = document.getElementById("resetBtn");
const stats = document.querySelector(".stats");
const cartItems = document.querySelector(".cartItems");
const cartTotal = document.querySelector(".cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

// ===== DISPLAY PRODUCTS =====
const displayProducts = (filteredProducts) => {
  const avg =
    filteredProducts.reduce((acc, p) => acc + p.price, 0) /
    (filteredProducts.length || 1);
  stats.textContent = `Showing ${filteredProducts.length} products | Avg Price: $${avg.toFixed(
    2
  )}`;

  productsContainer.innerHTML = filteredProducts
    .map(
      (product) => `
      <div class="product">
        <img src="${product.img}" alt="${product.name}">
        <span class="name">${product.name}</span>
        <span class="priceText">$${product.price}</span>
        <button class="addToCart" data-id="${product.id}">Add to Cart</button>
        <span class="favorite ${
          favorites.includes(product.id) ? "active" : ""
        }" data-id="${product.id}">♥</span>
      </div>`
    )
    .join("");

  // Favorite click event
  document.querySelectorAll(".favorite").forEach((heart) => {
    heart.addEventListener("click", () => {
      const id = parseInt(heart.dataset.id);
      if (favorites.includes(id)) {
        favorites = favorites.filter((f) => f !== id);
      } else {
        favorites.push(id);
      }
      localStorage.setItem("favorites", JSON.stringify(favorites));
      heart.classList.toggle("active");
    });
  });

  // Add to cart buttons
  document.querySelectorAll(".addToCart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const selectedProduct = data.find((p) => p.id === id);
      addToCart(selectedProduct);
    });
  });
};

// ===== ADD TO CART FUNCTION =====
const addToCart = (product) => {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
};

// ===== REMOVE FROM CART FUNCTION =====
const removeFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
};

// ===== UPDATE CART DISPLAY =====
const updateCart = () => {
  cartItems.innerHTML = cart
    .map(
      (item) => `
      <li>
        ${item.name} x${item.quantity} 
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="removeItem" data-id="${item.id}">❌</button>
      </li>`
    )
    .join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Attach remove event
  document.querySelectorAll(".removeItem").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });
};

// ===== CLEAR CART =====
clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

// ===== INITIALIZE CART ON PAGE LOAD =====
updateCart();

// ===== SEARCH FILTER =====
searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(value)
  );
  displayProducts(value ? filtered : data);
});

// ===== CATEGORY FILTER =====
const setCategories = () => {
  const allCats = ["All", ...new Set(data.map((item) => item.cat))];

  categoriesContainer.innerHTML = allCats
    .map((cat) => `<span class="cat">${cat}</span>`)
    .join("");

  categoriesContainer.addEventListener("click", (e) => {
    const selectedCat = e.target.textContent;
    const filtered =
      selectedCat === "All"
        ? data
        : data.filter((item) => item.cat === selectedCat);
    displayProducts(filtered);
  });
};

// ===== PRICE RANGE FILTER =====
const setPrices = () => {
  const priceList = data.map((item) => item.price);
  const min = Math.min(...priceList);
  const max = Math.max(...priceList);

  priceRange.min = min;
  priceRange.max = max;
  priceRange.value = max;
  priceValue.textContent = "$" + max;

  priceRange.addEventListener("input", (e) => {
    priceValue.textContent = "$" + e.target.value;
    const filtered = data.filter((item) => item.price <= e.target.value);
    displayProducts(filtered);
  });
};

// ===== SORT FILTER =====
sortSelect.addEventListener("change", () => {
  let sorted = [...data];
  if (sortSelect.value === "low-high") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "high-low") {
    sorted.sort((a, b) => b.price - a.price);
  }
  displayProducts(sorted);
});

// ===== RESET FILTERS =====
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "none";
  priceRange.value = priceRange.max;
  priceValue.textContent = "$" + priceRange.max;
  displayProducts(data);
});

// ===== INITIALIZE EVERYTHING =====
setCategories();
setPrices();
displayProducts(data);
