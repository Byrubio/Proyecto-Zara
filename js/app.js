/* ─── ZARA HOME · app.js ─────────────────────────────────────────── */

// ── Estado ─────────────────────────────────────────────────────────
const cart     = JSON.parse(localStorage.getItem('zh_cart')     || '[]');
const wishlist = JSON.parse(localStorage.getItem('zh_wishlist') || '[]');
let   allProducts = {};       // datos del JSON, por categoría
let   activeCategory = null;  // categoría visible actualmente

const save = () => {
  localStorage.setItem('zh_cart',     JSON.stringify(cart));
  localStorage.setItem('zh_wishlist', JSON.stringify(wishlist));
};

// ── Toast ──────────────────────────────────────────────────────────
function toast(msg) {
  let el = document.getElementById('zh-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'zh-toast';
    Object.assign(el.style, {
      position:'fixed', bottom:'28px', left:'50%',
      transform:'translateX(-50%) translateY(60px)',
      background:'#1a1a1a', color:'#fff', padding:'11px 22px',
      fontSize:'.72rem', letterSpacing:'.12em', textTransform:'uppercase',
      fontFamily:'"Manrope",sans-serif', transition:'transform .3s ease',
      zIndex:'9999', pointerEvents:'none', whiteSpace:'nowrap'
    });
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(el._t);
  el._t = setTimeout(() => el.style.transform = 'translateX(-50%) translateY(60px)', 2400);
}

// ── Carrito ────────────────────────────────────────────────────────
function updateCartBadge() {
  const n = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelector('.cart-count').textContent = n ? `(${n})` : '';
}

function addToCart(id, name, price, img) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, name, price, img, qty: 1 });
  save();
  updateCartBadge();
  toast(`${name} añadido`);
}

function removeFromCart(id) {
  const i = cart.findIndex(x => x.id === id);
  if (i !== -1) cart.splice(i, 1);
  save();
  updateCartBadge();
  renderCartDrawer();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  save();
  renderCartDrawer();
}

// ── Drawer del carrito ─────────────────────────────────────────────
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function renderCartDrawer() {
  const body  = document.getElementById('cartBody');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cart.length) {
    body.innerHTML = `<p style="padding:40px 24px;text-align:center;color:#999;
      font-size:.8rem;letter-spacing:.1em;text-transform:uppercase">Tu carrito está vacío</p>`;
    document.getElementById('cartTotal').textContent = '';
    return;
  }

  body.innerHTML = cart.map(i => `
    <div style="display:grid;grid-template-columns:72px 1fr auto;gap:14px;
                padding:16px 24px;border-bottom:1px solid #f0f0f0">
      <img src="${i.img}" style="width:72px;aspect-ratio:3/4;object-fit:cover;background:#f5f5f5">
      <div>
        <p style="font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;margin-bottom:10px">${i.name}</p>
        <div style="display:flex;align-items:center;gap:10px">
          <button onclick="changeQty(${i.id},-1)"
            style="width:22px;height:22px;border:1px solid #e5e5e5;background:none;cursor:pointer">−</button>
          <span style="font-size:.8rem">${i.qty}</span>
          <button onclick="changeQty(${i.id},+1)"
            style="width:22px;height:22px;border:1px solid #e5e5e5;background:none;cursor:pointer">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <p style="font-size:.8rem;margin-bottom:8px">${(i.price * i.qty).toFixed(2)} €</p>
        <button onclick="removeFromCart(${i.id})"
          style="background:none;border:none;cursor:pointer;font-size:.65rem;
                 letter-spacing:.1em;text-transform:uppercase;color:#999">Eliminar</button>
      </div>
    </div>
  `).join('');

  document.getElementById('cartTotal').textContent = `Total: ${total.toFixed(2)} €`;
}

// ── Wishlist ───────────────────────────────────────────────────────
function toggleWishlist(id, btn) {
  const idx = wishlist.indexOf(id);
  const path = btn.querySelector('path');
  if (idx === -1) {
    wishlist.push(id);
    path.setAttribute('fill', 'currentColor');
    toast('Guardado en favoritos ♥');
  } else {
    wishlist.splice(idx, 1);
    path.setAttribute('fill', 'none');
    toast('Eliminado de favoritos');
  }
  save();
}

// ── Render del grid de productos ───────────────────────────────────
function renderProducts(category) {
  activeCategory = category;
  const products = allProducts[category] || [];
  const grid = document.querySelector('.products-grid');

  grid.innerHTML = products.map(p => `
    <article class="product-card">
      <div class="product-image-wrapper">
        <img src="${p.image}" alt="${p.name}" class="product-image"
             onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop&q=80'">

        <button class="product-wishlist" onclick="toggleWishlist(${p.id}, this)">
          <svg width="16" height="16" viewBox="0 0 24 24"
               fill="${wishlist.includes(p.id) ? 'currentColor' : 'none'}"
               stroke="currentColor" stroke-width="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        <button class="add-cart-btn"
                onclick="addToCart(${p.id},'${p.name}',${p.price},'${p.image}')">
          Añadir al carrito
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">${p.price.toFixed(2)} €</p>
      </div>
    </article>
  `).join('');

  // Hover: mostrar botón "añadir"
  grid.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-cart-btn');
    card.addEventListener('mouseenter', () => btn.style.opacity = '1');
    card.addEventListener('mouseleave', () => btn.style.opacity = '0');
  });
}

// ── Nav del hero: cambio de imagen + categoría activa ──────────────
function initHeroNav() {
  const heroImg = document.getElementById('heroImage');

  // Mapa enlace → categoría del JSON
  const linkToCategory = {
    'novedades':         'bano',
    'metal-trend':       'muebles',
    'gym-collection':    'decoracion',
    'vincent-van-duysen':'dormitorio'
  };

  document.querySelectorAll('.hero-nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      // Cambiar imagen con fade
      heroImg.style.opacity = '0';
      setTimeout(() => { heroImg.src = link.dataset.image; heroImg.style.opacity = '1'; }, 200);

      // Marcar activo
      document.querySelectorAll('.hero-nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const key = link.getAttribute('href').replace('/', '');
      const cat = linkToCategory[key] || 'bano';
      renderProducts(cat);
      document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ── Header scroll ──────────────────────────────────────────────────
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ── Menú hamburguesa ──────────────────────────────────────────────
function initMenu() {
  const btn     = document.getElementById('hamburgerBtn');
  const menu    = document.getElementById('dropdownMenu');
  const overlay = document.getElementById('menuOverlay');

  const close = () => {
    menu.classList.remove('active');
    btn.classList.remove('active');
    overlay.classList.remove('show');
    overlay.classList.add('hidden');
    document.body.classList.remove('menu-open');
  };

  btn.addEventListener('click', () => {
    const open = !menu.classList.contains('active');
    open ? (menu.classList.add('active'), btn.classList.add('active'),
            overlay.classList.remove('hidden'), overlay.classList.add('show'),
            document.body.classList.add('menu-open'))
         : close();
  });

  overlay.addEventListener('click', close);

  // Los links del menú también cargan la categoría
  const menuToCategory = {
    '/bano':       'bano',
    '/decoracion': 'decoracion',
    '/dormitorio': 'dormitorio',
    '/muebles':    'muebles',
    '/fragancias': 'fragancias'
  };

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      const cat = menuToCategory[link.getAttribute('href')];
      if (cat) {
        e.preventDefault();
        close();
        renderProducts(cat);
        document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ── Modal de país ─────────────────────────────────────────────────
function initModal() {
  const modal = document.getElementById('countryModal');
  if (sessionStorage.getItem('zh_ok')) { modal.classList.add('hidden'); return; }

  modal.classList.remove('hidden');
  Object.assign(modal.style, { opacity:'1', pointerEvents:'all',
    display:'flex', alignItems:'center', justifyContent:'center' });

  const close = () => { modal.classList.add('hidden'); sessionStorage.setItem('zh_ok','1'); };
  document.getElementById('continueBtn').addEventListener('click', close);
  document.getElementById('modalClose').addEventListener('click',  close);
}

// ── Inyectar drawer del carrito ────────────────────────────────────
function injectCartDrawer() {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="cartOverlay" onclick="closeCartDrawer()"
      style="position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:1500;display:none"></div>

    <div id="cartDrawer"
      style="position:fixed;top:0;right:0;width:min(400px,100vw);height:100vh;
             background:#fff;z-index:1501;display:flex;flex-direction:column;
             transform:translateX(100%);transition:transform .35s ease;
             font-family:'Manrope',sans-serif">
      <div style="padding:20px 24px;border-bottom:1px solid #e5e5e5;
                  display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;
                     font-style:italic;font-weight:300">Tu carrito</span>
        <button onclick="closeCartDrawer()"
          style="background:none;border:none;cursor:pointer;font-size:1.1rem;opacity:.5">✕</button>
      </div>
      <div id="cartBody" style="flex:1;overflow-y:auto"></div>
      <div style="padding:20px 24px;border-top:1px solid #e5e5e5">
        <p id="cartTotal" style="font-size:.85rem;text-align:right;margin-bottom:14px"></p>
        <button onclick="toast('Redirigiendo al pago...')"
          style="width:100%;padding:13px;background:#1a1a1a;color:#fff;border:none;
                 font-family:'Manrope',sans-serif;font-size:.72rem;
                 letter-spacing:.15em;text-transform:uppercase;cursor:pointer">
          Finalizar compra
        </button>
      </div>
    </div>
  `);

  document.head.insertAdjacentHTML('beforeend', `<style>
    #cartOverlay.open { display:block !important }
    #cartDrawer.open  { transform:translateX(0) !important }
    .add-cart-btn {
      position:absolute;bottom:0;left:0;right:0;padding:10px;
      background:rgba(255,255,255,.92);border:none;cursor:pointer;
      font-family:'Manrope',sans-serif;font-size:.7rem;
      letter-spacing:.15em;text-transform:uppercase;
      opacity:0;transition:opacity .2s
    }
    .product-price {
      font-size:.78rem;color:#666;margin-top:4px
    }
  </style>`);
}

// ── Arranque ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar JSON
  try {
    const res = await fetch('./data/products.json');
    allProducts = await res.json();
  } catch {
    allProducts = {
      bano: [
        { id:101, name:'Toalla Algodón Blanco',   image:'./img/blanco.png',  price:25.99 },
        { id:102, name:'Toalla Jacquard Cuadros', image:'./img/cuadros.png', price:29.99 },
        { id:103, name:'Toalla Rizo Marrón',      image:'./img/marron.png',  price:35.99 },
        { id:104, name:'Toalla Algodón Verde',    image:'./img/verde.png',   price:27.99 }
      ]
    };
  }

  initModal();
  initHeader();
  initMenu();
  initHeroNav();
  injectCartDrawer();

  document.querySelector('.cart-icon').addEventListener('click', openCartDrawer);

  // Mostrar productos de baño por defecto (primera sección del hero)
  renderProducts('bano');

  updateCartBadge();
});