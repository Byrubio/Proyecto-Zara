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
    if (isMenuOpen && !menuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
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
    cartCount.setAttribute("aria-label", 
      count === 0 ? "Carrito vacío" : `${count} producto${count !== 1 ? 's' : ''} en el carrito`
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
  if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch');
  }

  // Lazy load images (if not using native loading)
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  }

  // Smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === "#") return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// =========================
// CONSOLE MESSAGE (branding)
// =========================
console.log(
  "%cZARA HOME",
  'font-family: "Cormorant Garamond", serif; font-size: 24px; font-weight: 300; letter-spacing: 0.2em; color: #1a1a1a;'
);

console.log(
  "%cBienvenido a la web oficial de Zara Home España",
  'font-family: "Manrope", sans-serif; font-size: 14px; color: #666;'
);