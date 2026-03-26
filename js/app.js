console.log("app.js cargado");

/*COMPORTAMIENTO HAMBURGUESAS-SOLO ESCRITORIO*/
const hamburgerBtn = document.getElementById("hamburger-btn");
const dropdownMenu = document.getElementById("dropdownMenu");
const menuOverlay = document.getElementById("menuOverlay");
const closeBtn = document.getElementById("closeMenu");



if (hamburgerBtn && dropdownMenu && menuOverlay) {
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    dropdownMenu.classList.add("active");
    menuOverlay.classList.add("active");
    hamburgerBtn.classList.add("active");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    isOpen = false;
    dropdownMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    hamburgerBtn.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  hamburgerBtn.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  menuOverlay.addEventListener("click", closeMenu);
  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });

  // Click en link de baño:
  dropdownMenu.querySelectorAll(".close-on-click").forEach((link) => {
    link.addEventListener("click", closeMenu);
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

  // Init modal
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

  globalThis.addEventListener("scroll", () => {
    if (!ticking) {
      globalThis.requestAnimationFrame(updateHeader);
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

// Detectar y cargar productos de baño si el elemento existe en la página
document.addEventListener("DOMContentLoaded", function () {
  const contenedorBano = document.getElementById("contenedor-baño");
  console.log("Contenedor baño encontrado:", contenedorBano);
  if (contenedorBano) {
    console.log("Página de baños detectada. Cargando productos...");
    cargarProductosBano();
  } else {
    console.log("Contenedor de baño no encontrado");
  }
});

function cargarProductosBano() {
  console.log("Iniciando carga de productos de baño...");
  fetch("data/banos.json")
    .then((res) => {
      console.log("Respuesta del fetch:", res);
      if (!res.ok) throw new Error("No se encuentra el JSON");
      return res.json();
    })
    .then((productos) => {
      console.log("Productos cargados:", productos.length);
      allBathProducts = productos;
      renderBathProducts(productos);
      initBathSearchAndFilters();
    })
    .catch((err) => console.error("Error cargando productos:", err));
}

// RENDERIZAR productos de baño
function renderBathProducts(productArray) {
  const contenedor = document.querySelector("#contenedor-baño");
  console.log("Renderizando productos. Contenedor:", contenedor);
  console.log("Productos a renderizar:", productArray.length);
  if (!contenedor) {
    console.error("Contenedor #contenedor-baño no encontrado");
    return;
  }

  contenedor.innerHTML = ""; // Limpiar
  console.log("Contenedor limpiado");

  if (productArray.length === 0) {
    contenedor.innerHTML =
      "<p class='no-products'>No se encontraron productos</p>";
    console.log("No hay productos para mostrar");
    return;
  }

  const favorites = getFavorites();

  productArray.forEach((product) => {
    const card = document.createElement("div");
    card.className = "producto-card";
    const isFavorite = favorites.some((f) => f.id === product.id);
    const heartClass = isFavorite ? "filled" : "";

    card.innerHTML = `
    
  
      <div class="image-wrapper">
        <button class="wishlist-btn ${heartClass}" title="Añadir a favoritos" data-product-id="${product.id}" data-product-name="${product.nombre}">
           &#9825;
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

  // BOTON AÑADIR AL CARRITO: Agregar detectores de eventos a los botones
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = Number.parseInt(e.target.dataset.productId);
      const productName = e.target.dataset.productName;
      const productPrice = Number.parseFloat(btn.dataset.productPrice);
      addToBathCart(productId, productName, productPrice);
      btn.textContent = "Añadido";
      btn.classList.add("added");
    });
  });

  // Agregar oyentes a los botones de favoritos
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = Number.parseInt(e.currentTarget.dataset.productId);
      const productName = e.currentTarget.dataset.productName;
      toggleFavorite(productId, productName, e.currentTarget);
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

// Eliminar un producto del carrito (completo)
function removeFromBathCart(productId) {
  let cart = getCart();
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    updateCartDisplayAll();
    // Restaurar el botón de añadir al eliminar un producto del carrito
    const btn = document.querySelector(
      `.add-cart-btn[data-product-id="${productId}"]`,
    );
    if (btn) {
      btn.classList.remove("added");
      btn.textContent = "Añadir al carrito";
    }
  }
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

// Guardar carrito en localStorage (también sincroniza clave general)
function saveCart(cart) {
  try {
    // key específico para productos de baño
    localStorage.setItem("zarahome_bath_cart", JSON.stringify(cart));
    // key genérica usada por el contador de cabecera
    localStorage.setItem("zarahome_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Error al guardar carrito:", e);
  }
}

// Obtener favoritos del localStorage
function getFavorites() {
  try {
    const favorites = localStorage.getItem("zarahome_bath_favorites");
    const parsed = favorites ? JSON.parse(favorites) : [];
    // compatibilidad con versiones antiguas (solo names como strings)
    if (parsed.length && typeof parsed[0] === "string") {
      // convertir strings a objetos con solo nombre
      return parsed.map((name) => ({ name }));
    }
    return parsed;
  } catch (e) {
    console.error("Error al obtener favoritos:", e);
    return [];
  }
}

// Guardar favoritos en localStorage
function saveFavorites(favorites) {
  try {
    // Guardar solo los nombres como strings
    const names = favorites.map((f) => f.name);
    localStorage.setItem("zarahome_bath_favorites", JSON.stringify(names));
  } catch (e) {
    console.error("Error al guardar favoritos:", e);
  }
}

// Alternar favorito
function toggleFavorite(productId, productName, buttonElement) {
  let favorites = getFavorites();
  const idx = favorites.findIndex((f) => f.name === productName);
  if (idx >= 0) {
    // ya está como favorito -> eliminar
    favorites.splice(idx, 1);
    buttonElement.classList.remove("filled");
    buttonElement.innerHTML = "&#9825;";
  } else {
    favorites.push({ id: productId, name: productName });
    buttonElement.classList.add("filled");
    buttonElement.innerHTML = "&#9829;";
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
      0,
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
    const product = allBathProducts?.find((p) => p.id === item.id);
    const productImage = product?.imagen || "./img/placeholder.png";

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
      <button class="remove-cart-btn" data-product-id="${item.id}" title="Eliminar">&times;</button>
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
    if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
      cartDropdown.classList.add("hidden");
    }
  });

  // Delegate remove button clicks inside dropdown
  cartDropdown.addEventListener("click", (e) => {
    if (e.target.matches(".remove-cart-btn")) {
      // evitar que el evento burbujee hasta document y cierre el dropdown
      e.stopPropagation();
      const id = Number.parseInt(e.target.dataset.productId);
      removeFromBathCart(id);
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

// Inicializar búsqueda y filtros ++
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

/*nuevo*/
const searchToggle = document.getElementById("searchToggle");
const searchOverlay = document.getElementById("searchOverlay");

searchToggle.addEventListener("click", () => {
  searchOverlay.classList.add("active");
  document.getElementById("searchInput").focus();
});

// cerrar al hacer click fuera
searchOverlay.addEventListener("click", (e) => {
  if (e.target === searchOverlay) {
    searchOverlay.classList.remove("active");
  }
});



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
      console.warn("Could not parse cart data", e);
      count = 0;
    }

    cartCount.textContent = count > 0 ? `(${count})` : "";

    let ariaLabel = "";
    if (count === 0) {
      ariaLabel = "Carrito vacío";
    } else {
      ariaLabel = `${count} producto${count !== 1 ? "s" : ""} en el carrito`;
    }

    cartCount.setAttribute("aria-label", ariaLabel);
  }

  // Initial update
  updateCartCount();

  // Optional: Listen for storage changes (if cart is modified in another tab)
  globalThis.addEventListener("storage", (e) => {
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
  if ("ontouchstart" in globalThis) {
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
