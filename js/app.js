/*COMPORTAMIENTO HAMBURGUESAS*/
const hamburgerBtn = document.getElementById("hamburger-btn");
const dropdownMenu = document.getElementById("dropdownMenu");
const menuOverlay = document.getElementById("menuOverlay");

if (hamburgerBtn && dropdownMenu && menuOverlay) {
  hamburgerBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
    menuOverlay.classList.toggle("hidden");
    hamburgerBtn.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  menuOverlay.addEventListener("click", () => {
    dropdownMenu.classList.remove("active");
    menuOverlay.classList.add("hidden");
    hamburgerBtn.classList.remove("active");
    document.body.classList.remove("menu-open");
  });
}

// =========================
// CONSTANTS & CONFIG
// =========================
const STORAGE_KEY = "zarahome_modal_dismissed";

// =========================
// MODAL FUNCTIONALITY
// =========================
(function initModal() {
  const countryModal = document.getElementById("countryModal");
  const modalClose = document.getElementById("modalClose");
  const continueBtn = document.getElementById("continueBtn");

  // Early return if modal doesn't exist
  if (!countryModal) return;

  function closeModal() {
    countryModal.classList.add("hidden");
    localStorage.setItem(STORAGE_KEY, "true");
    document.body.style.overflow = "";
  }

  function openModal() {
    const modalDismissed = localStorage.getItem(STORAGE_KEY);
    if (!modalDismissed) {
      countryModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  }

  // Initialize modal
  openModal();

  // Event listeners
  modalClose?.addEventListener("click", closeModal);
  continueBtn?.addEventListener("click", closeModal);

  // Close when clicking outside
  countryModal.addEventListener("click", (e) => {
    if (e.target === countryModal) closeModal();
  });

  // Close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !countryModal.classList.contains("hidden")) {
      closeModal();
    }
  });
})();

// =========================
// HEADER SCROLL EFFECT
// =========================
(function initHeaderScroll() {
  const header = document.getElementById("header");

  if (!header) return;

  let ticking = false;
  const SCROLL_THRESHOLD = 50;

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // Check initial scroll position
  updateHeader();
})();

// =========================
// HERO IMAGE SWAP & PRELOAD
// =========================
(function initHero() {
  const heroImage = document.querySelector(".hero-image");
  const heroNavLinks = document.querySelectorAll(".hero-nav-link");
  const heroNavContainer = document.querySelector(".hero-nav");

  // Early return if hero elements don't exist
  if (!heroImage || !heroNavLinks.length) return;

  // Preload all hero images
  heroNavLinks.forEach((link) => {
    const imgUrl = link.dataset.image;
    if (imgUrl) {
      const preload = new Image();
      preload.src = imgUrl;
    }
  });

  // Function to update hero image
  function updateHeroImage(clickedLink) {
    // Update active states
    heroNavLinks.forEach((link) => link.classList.remove("active"));
    clickedLink.classList.add("active");

    // Update image with fade effect
    const imgUrl = clickedLink.dataset.image;
    if (imgUrl && heroImage.src !== imgUrl) {
      // Add fade-out effect
      heroImage.style.opacity = "0.5";

      setTimeout(() => {
        heroImage.src = imgUrl;
        heroImage.style.opacity = "1";
      }, 150);
    }
  }

  // Add click handlers
  heroNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      updateHeroImage(link);
    });
  });

  // Add keyboard navigation
  if (heroNavContainer) {
    heroNavContainer.addEventListener("keydown", (e) => {
      const currentActive = document.querySelector(".hero-nav-link.active");
      const links = Array.from(heroNavLinks);
      const currentIndex = links.indexOf(currentActive);

      let newIndex;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        newIndex = (currentIndex + 1) % links.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        newIndex = (currentIndex - 1 + links.length) % links.length;
      } else {
        return;
      }

      links[newIndex].focus();
      updateHeroImage(links[newIndex]);
    });
  }
})();
/*PRODUCTOS DE BAÑO*/
let allBathProducts = []; // Almacenar todos los productos

if (window.location.pathname.includes("banos.html")) {
  console.log("Cargando productos de baño...");
  cargarProductosBano();
}

function cargarProductosBano() {
  fetch("data/banos.json")
    .then((res) => {
      if (!res.ok) throw new Error("No se encuentra el JSON");
      return res.json();
    })
    .then((productos) => {
      allBathProducts = productos;
      renderBathProducts(productos);
      initBathSearchAndFilters();
    })
    .catch((err) => console.error("Error:", err));
}

// RENDERIZAR productos de baño
function renderBathProducts(productArray) {
  const contenedor = document.querySelector("#contenedor-baño");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar

  if (productArray.length === 0) {
    contenedor.innerHTML = "<p class='no-products'>No se encontraron productos</p>";
    return;
  }

  const favorites = getFavorites();

  productArray.forEach((product) => {
    const card = document.createElement("div");
    card.className = "producto-card";
    const isFavorite = favorites.includes(product.id);
    const heartClass = isFavorite ? "filled" : "";

    card.innerHTML = `
      <div class="image-wrapper">
        <button class="wishlist-btn ${heartClass}" title="Añadir a favoritos" data-product-id="${product.id}">
          ♥
        </button>
        <img src="${product.imagen}" alt="${product.nombre}" class="producto-imagen">
      </div>
      <div class="info">
        <h3>${product.nombre}</h3>
        <p class="precio">${product.precio.toFixed(2)} €</p>
        <button class="add-cart-btn" data-product-id="${product.id}" data-product-name="${product.nombre}" data-product-price="${product.precio}">
          Añadir al carrito
        </button>
      </div>
    `;

    contenedor.appendChild(card);
  });

  // Agregar event listeners a los botones
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.productId);
      const productName = e.target.dataset.productName;
      const productPrice = parseFloat(e.target.dataset.productPrice);
      addToBathCart(productId, productName, productPrice);
    });
  });

  // Agregar event listeners a los botones de favoritos
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.currentTarget.dataset.productId);
      toggleFavorite(productId, e.currentTarget);
    });
  });
}

// Función para agregar al carrito
function addToBathCart(productId, productName, productPrice) {
  let cart = getCart();

  // Buscar si el producto ya está en el carrito
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartDisplayAll();

  // Mostrar feedback visual
  showAddedToCartMessage(productName);
}

// Obtener carrito del localStorage
function getCart() {
  try {
    const cart = localStorage.getItem("zarahome_bath_cart");
    return cart ? JSON.parse(cart) : [];
  } catch (e) {
    console.error("Error al obtener carrito:", e);
    return [];
  }
}

// Guardar carrito en localStorage
function saveCart(cart) {
  try {
    localStorage.setItem("zarahome_bath_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Error al guardar carrito:", e);
  }
}

// Obtener favoritos del localStorage
function getFavorites() {
  try {
    const favorites = localStorage.getItem("zarahome_bath_favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (e) {
    console.error("Error al obtener favoritos:", e);
    return [];
  }
}

// Guardar favoritos en localStorage
function saveFavorites(favorites) {
  try {
    localStorage.setItem("zarahome_bath_favorites", JSON.stringify(favorites));
  } catch (e) {
    console.error("Error al guardar favoritos:", e);
  }
}

// Alternar favorito
function toggleFavorite(productId, buttonElement) {
  let favorites = getFavorites();

  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
    buttonElement.classList.remove("filled");
  } else {
    favorites.push(productId);
    buttonElement.classList.add("filled");
  }

  saveFavorites(favorites);
}

// Actualizar la pantalla del carrito
function updateCartDisplayAll() {
  const cart = getCart();
  const cartItemCount = document.getElementById("cartItemCount");
  const cartTotal = document.getElementById("cartTotal");
  const cartCountHeader = document.getElementById("cartCount");

  if (cartItemCount && cartTotal) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cartItemCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
  }

  // Actualizar contador en el header (si existe en la página)
  if (cartCountHeader) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountHeader.textContent = totalItems > 0 ? `(${totalItems})` : "";
  }

  // Renderizar el dropdown del carrito
  renderCartDropdown();
}

// Renderizar el dropdown del carrito
function renderCartDropdown() {
  const cartItems = document.getElementById("cartItems");
  const totalAmount = document.getElementById("totalAmount");
  const cart = getCart();

  if (!cartItems || !totalAmount) return;

  // Si el carrito está vacío
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
    totalAmount.textContent = "0.00 €";
    return;
  }

  // Limpiar items
  cartItems.innerHTML = "";

  let totalPrice = 0;

  // Renderizar cada producto
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    // Buscar imagen del producto
    let productImage = "./img/placeholder.png";
    if (typeof allBathProducts !== "undefined" && allBathProducts.length > 0) {
      const product = allBathProducts.find((p) => p.id === item.id);
      if (product && product.imagen) {
        productImage = product.imagen;
      }
    }

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${productImage}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-details">
          <div class="cart-item-quantity">Cantidad: <strong>${item.quantity}</strong></div>
          <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} €</div>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItem);
  });

  // Actualizar total
  totalAmount.textContent = totalPrice.toFixed(2) + " €";
}

// Inicializar el carrito desplegable
(function initCartDropdown() {
  const cartIcon = document.getElementById("cartIcon");
  const cartDropdown = document.getElementById("cartDropdown");
  const cartClose = document.getElementById("cartClose");

  if (!cartIcon || !cartDropdown) return;

  // Toggle cart dropdown
  cartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle("hidden");
  });

  // Close cart dropdown
  cartClose?.addEventListener("click", () => {
    cartDropdown.classList.add("hidden");
  });

  // Close cart when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !cartIcon.contains(e.target) &&
      !cartDropdown.contains(e.target)
    ) {
      cartDropdown.classList.add("hidden");
    }
  });

  // Close cart with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !cartDropdown.classList.contains("hidden")) {
      cartDropdown.classList.add("hidden");
    }
  });

  // Renderizar el carrito al iniciar
  renderCartDropdown();
})();

// Mostrar mensaje de producto añadido
function showAddedToCartMessage(productName) {
  const message = document.createElement("div");
  message.className = "cart-message";
  message.textContent = `${productName} añadido al carrito`;
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

// Inicializar búsqueda y filtros
function initBathSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = allBathProducts.filter((product) =>
      product.nombre.toLowerCase().includes(searchTerm),
    );

    renderBathProducts(filtered);
  });

  // Actualizar pantalla del carrito al cargar
  updateCartDisplayAll();
}

// =========================
// MOBILE MENU FUNCTIONALITY
// =========================
(function initMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (!menuBtn || !dropdownMenu) return;

  let isMenuOpen = false;

  function toggleMenu(open = !isMenuOpen) {
    isMenuOpen = open;
    dropdownMenu.classList.toggle("active", isMenuOpen);
    menuBtn.classList.toggle("active", isMenuOpen);
    menuBtn.setAttribute("aria-expanded", isMenuOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }

  menuBtn.addEventListener("click", () => toggleMenu());

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !menuBtn.contains(e.target) &&
      !dropdownMenu.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      toggleMenu(false);
      menuBtn.focus();
    }
  });

  // Close menu when clicking on a link
  dropdownMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
})();

// =========================
// CART COUNTER FUNCTIONALITY
// =========================
(function initCart() {
  const cartBtn = document.querySelector(".cart-icon");
  const cartCount = document.getElementById("cartCount");

  if (!cartBtn || !cartCount) return;

  // Example: Get cart count from localStorage or initialize to 0
  function updateCartCount() {
    let count = 0;
    try {
      const cartData = localStorage.getItem("zarahome_cart");
      if (cartData) {
        const cart = JSON.parse(cartData);
        count = cart.length || 0;
      }
    } catch (e) {
      console.warn("Could not parse cart data");
    }

    cartCount.textContent = count > 0 ? `(${count})` : "";
    cartCount.setAttribute(
      "aria-label",
      count === 0
        ? "Carrito vacío"
        : `${count} producto${count !== 1 ? "s" : ""} en el carrito`,
    );
  }

  // Initial update
  updateCartCount();

  // Optional: Listen for storage changes (if cart is modified in another tab)
  window.addEventListener("storage", (e) => {
    if (e.key === "zarahome_cart") {
      updateCartCount();
    }
  });
})();

// =========================
// UTILITIES & PERFORMANCE
// =========================
(function initUtils() {
  // Add touch support detection class
  if ("ontouchstart" in window) {
    document.documentElement.classList.add("touch");
  }

  // Lazy load images (if not using native loading)
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.setAttribute("loading", "lazy");
    });
  }

  // Smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();

// =========================
// CONSOLE MESSAGE (branding)
// =========================
console.log(
  "%cZARA HOME",
  'font-family: "Cormorant Garamond", serif; font-size: 24px; font-weight: 300; letter-spacing: 0.2em; color: #1a1a1a;',
);

console.log(
  "%cBienvenido a la web oficial de Zara Home España",
  'font-family: "Manrope", sans-serif; font-size: 14px; color: #666;',
);
