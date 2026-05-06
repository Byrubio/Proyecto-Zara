const API_URL = "http://127.0.0.1:8000/api";
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();
  initTabs();
  loadData();
  initUserModal();
  initCustomerModal();
  initProductModal();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

function checkAdminAccess() {
  const email = (localStorage.getItem("user_email") || "").toLowerCase();
  const isAdmin = localStorage.getItem("is_admin") === "true";

  // Permitir acceso si es admin en DB O si tiene el correo de la empresa
  if (!token || (!isAdmin && !email.endsWith("@zarahome.com"))) {
    // Usar Notyf si está disponible, si no alert normal
    if (typeof notyf !== "undefined") {
      notyf.error("Acceso denegado. Solo personal de @zarahome.com");
    } else {
      alert("Acceso denegado. Solo personal de @zarahome.com");
    }
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }
}

// UI Helper (reusing from app.js logic basically)
// Configurar Notyf
const notyf = new Notyf({
  position: { x: 'right', y: 'bottom' },
  duration: 3000,
  types: [
    {
      type: 'success',
      background: '#000',
      icon: false
    },
    {
      type: 'error',
      background: '#d9534f',
      icon: false
    }
  ]
});

// Wrapper para compatibilidad
function showToast(message, type = 'success') {
  if (type === 'success') {
    notyf.success(message);
  } else {
    notyf.error(message);
  }
}

function showConfirmCustom(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "custom-confirm-overlay";
    overlay.innerHTML = `
      <div class="custom-confirm-modal">
        <p class="confirm-text">${message}</p>
        <div class="confirm-buttons">
          <button class="confirm-btn confirm-btn-no" id="confirmNo">CANCELAR</button>
          <button class="confirm-btn confirm-btn-yes" id="confirmYes">ACEPTAR</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add("active"), 10);
    const cleanup = (result) => {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
      resolve(result);
    };
    overlay.querySelector("#confirmYes").onclick = () => cleanup(true);
    overlay.querySelector("#confirmNo").onclick = () => cleanup(false);
    overlay.onclick = (e) => { if (e.target === overlay) cleanup(false); };
  });
}


// ==== TABS LOGIC ====
function initTabs() {
  const tabs = document.querySelectorAll(".admin-nav-item");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      
      // Set active
      tab.classList.add("active");
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.add("active");
    });
  });
}

// ==== LOAD DATA ====
let rolesData = [];

async function loadData() {
  await fetchRoles();
  fetchUsers();
  fetchProducts();
  fetchOrders();
  fetchCustomers();
  fetchCategories();
}

async function f(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/admin/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.status === 401 || response.status === 403) {
    showToast("No tienes permisos de administrador.");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
    return null;
  }

  return response;
}

// ==== ROLES ====
async function fetchRoles() {
  const res = await f('roles');
  if (res && res.ok) {
    rolesData = await res.json();
    const select = document.getElementById("userRole");
    
    let html = '<option value="" disabled selected>Seleccionar rol...</option>';
    html += rolesData.map(r => {
      const displayName = r.name === 'admin' ? 'Administrador' : 
                          r.name === 'cliente' ? 'Cliente' : 
                          r.name.charAt(0).toUpperCase() + r.name.slice(1);
      return `<option value="${r.id}">${displayName}</option>`;
    }).join('');
    
    select.innerHTML = html;
  }
}

// ==== USERS ====
async function fetchUsers() {
  const res = await f('users');
  if (res && res.ok) {
    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = users.map(user => {
      const roleRaw = user.role ? user.role.name : 'N/A';
      const roleName = roleRaw === 'admin' ? 'Administrador' : 
                       roleRaw === 'cliente' ? 'Cliente' : roleRaw;
      
      return `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span class="status-badge status-${roleRaw.toLowerCase()}">${roleName}</span></td>
          <td>
            <button class="action-btn edit-user-btn" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}" data-role="${user.role_id}">Editar</button>
            <button class="action-btn delete-user-btn" data-id="${user.id}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");

    bindUserActions();
  }
}

// ==== PRODUCTS ====
async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`); // Products are public GET
  if (res && res.ok) {
    const products = await res.json();
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = products.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;" alt="${p.nombre}"></td>
        <td>${p.nombre}</td>
        <td>${Number(p.precio).toFixed(2)} €</td>
        <td>${p.category ? p.category.name : 'N/A'}</td>
        <td>
          <button class="action-btn edit-product-btn" 
            data-id="${p.id}" 
            data-nombre="${p.nombre}" 
            data-precio="${p.precio}" 
            data-imagen="${p.imagen || ''}" 
            data-category="${p.category_id || ''}">Editar</button>
          <button class="action-btn delete-product-btn" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    bindProductActions();
  }
}

async function fetchCategories() {
  const res = await f('categories');
  if (res && res.ok) {
    const categories = await res.json();
    const select = document.getElementById("productCategory");
    let html = '<option value="">Sin categoría</option>';
    html += categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    select.innerHTML = html;
  }
}

// ==== ORDERS ====
async function fetchOrders() {
  const res = await f('orders');
  if (res && res.ok) {
    const orders = await res.json();
    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = orders.map(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      const customerEmail = order.customer && order.customer.user ? order.customer.user.email : 'N/A';
      const items = order.items.map(i => `${i.quantity}x Prod #${i.product_id}`).join(", ");
      
      return `
        <tr>
          <td>#${order.id}</td>
          <td>${customerEmail}</td>
          <td>${date}</td>
          <td>${Number(order.total).toFixed(2)} €</td>
          <td>
            <select class="status-select" data-id="${order.id}">
              <option value="pending" ${order.status==='pending'?'selected':''}>Pendiente</option>
              <option value="processing" ${order.status==='processing'?'selected':''}>Procesando</option>
              <option value="shipped" ${order.status==='shipped'?'selected':''}>Enviado</option>
              <option value="delivered" ${order.status==='delivered'?'selected':''}>Entregado</option>
              <option value="cancelled" ${order.status==='cancelled'?'selected':''}>Cancelado</option>
            </select>
          </td>
          <td style="font-size:0.8em; color:#555; max-width:200px;">${items}</td>
          <td>
            <button class="action-btn delete-order-btn" data-id="${order.id}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");

    bindOrderActions();
  }
}

// ==== CUSTOMERS ====
async function fetchCustomers() {
  const res = await f('customers');
  if (res && res.ok) {
    const customers = await res.json();
    const tbody = document.getElementById("customersTableBody");
    tbody.innerHTML = customers.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.user ? c.user.email : 'N/A'}</td>
        <td>${c.phone || '-'}</td>
        <td>${c.address || '-'}</td>
        <td>
          <button class="action-btn edit-customer-btn" data-id="${c.id}" data-phone="${c.phone || ''}" data-address="${c.address || ''}">Editar</button>
        </td>
      </tr>
    `).join("");

    bindCustomerActions();
  }
}

// ==== ACTIONS & MODALS ====
const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");

function initUserModal() {
  document.getElementById("createUserBtn").addEventListener("click", () => {
    userForm.reset();
    document.getElementById("userId").value = "";
    document.getElementById("userEmail").disabled = false;
    document.getElementById("userPassword").required = true;
    userModal.classList.add("active");
  });

  document.getElementById("closeUserModal").addEventListener("click", () => {
    userModal.classList.remove("active");
  });

  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("userId").value;
    const isEditing = !!id;

    const payload = {
      role_id: document.getElementById("userRole").value
    };

    if (!isEditing) {
      payload.name = document.getElementById("userName").value;
      payload.email = document.getElementById("userEmail").value;
      payload.password = document.getElementById("userPassword").value;
    }

    const endpoint = isEditing ? `users/${id}` : `users`;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await f(endpoint, {
      method: method,
      body: JSON.stringify(payload)
    });

    if (res && res.ok) {
      showToast(`Usuario ${isEditing ? 'actualizado' : 'creado'} con éxito`);
      userModal.classList.remove("active");
      fetchUsers();
    } else if (res) {
      const data = await res.json();
      showToast("Error: " + (data.message || ''));
    }
  });
}

function bindUserActions() {
  document.querySelectorAll(".edit-user-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const { id, name, email, role } = e.target.dataset;
      document.getElementById("userId").value = id;
      document.getElementById("userName").value = name;
      document.getElementById("userEmail").value = email;
      document.getElementById("userEmail").disabled = true; // prevent email edit for simplicity
      document.getElementById("userPassword").required = false;
      document.getElementById("userRole").value = role;
      userModal.classList.add("active");
    });
  });

  document.querySelectorAll(".delete-user-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const confirmed = await showConfirmCustom("¿Seguro que deseas eliminar a este usuario?");
      if (confirmed) {
        const id = e.target.dataset.id;
        const res = await f(`users/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
          showToast("Usuario eliminado");
          fetchUsers();
        } else if (res) {
          const data = await res.json();
          showToast("Error: " + data.message);
        }
      }
    });
  });
}

function bindOrderActions() {
  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      
      const res = await f(`orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      if (res && res.ok) {
        showToast("Estado actualizado");
      } else {
        showToast("Error al actualizar");
        fetchOrders(); // revert UI
      }
    });
  });

  document.querySelectorAll(".delete-order-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const confirmed = await showConfirmCustom("¿Seguro que deseas eliminar este pedido?");
      if (confirmed) {
        const id = e.target.dataset.id;
        const res = await f(`orders/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
          showToast("Pedido eliminado");
          fetchOrders();
        } else {
          showToast("Error al eliminar pedido");
        }
      }
    });
  });
}

// ==== CUSTOMER MODAL ====
const customerModal = document.getElementById("customerModal");
const customerForm = document.getElementById("customerForm");

function initCustomerModal() {
  document.getElementById("closeCustomerModal").addEventListener("click", () => {
    customerModal.classList.remove("active");
  });

  customerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const phone = document.getElementById("customerPhone").value;
    const address = document.getElementById("customerAddress").value;

    const res = await f(`customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ phone, address })
    });

    if (res && res.ok) {
      showToast("Cliente actualizado");
      customerModal.classList.remove("active");
      fetchCustomers();
    } else {
      showToast("Error al actualizar cliente");
    }
  });
}

function bindCustomerActions() {
  document.querySelectorAll(".edit-customer-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const { id, phone, address } = e.target.dataset;
      document.getElementById("customerId").value = id;
      document.getElementById("customerPhone").value = phone;
      document.getElementById("customerAddress").value = address;
      customerModal.classList.add("active");
    });
  });
}

// ==== PRODUCT MODAL & ACTIONS ====
const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");

function initProductModal() {
  document.getElementById("createProductBtn").addEventListener("click", () => {
    productForm.reset();
    document.getElementById("productId").value = "";
    productModal.classList.add("active");
  });

  document.getElementById("closeProductModal").addEventListener("click", () => {
    productModal.classList.remove("active");
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const isEditing = !!id;

    const payload = {
      nombre: document.getElementById("productName").value,
      precio: document.getElementById("productPrice").value,
      imagen: document.getElementById("productImage").value,
      category_id: document.getElementById("productCategory").value || null
    };

    const endpoint = isEditing ? `products/${id}` : `products`;
    const method = isEditing ? 'PUT' : 'POST';

    const res = await f(endpoint, {
      method: method,
      body: JSON.stringify(payload)
    });

    if (res && res.ok) {
      showToast(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito`);
      productModal.classList.remove("active");
      fetchProducts();
    } else if (res) {
      const data = await res.json();
      showToast("Error: " + (data.message || 'Error al guardar producto'));
    }
  });
}

function bindProductActions() {
  document.querySelectorAll(".edit-product-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const { id, nombre, precio, imagen, category } = e.target.dataset;
      document.getElementById("productId").value = id;
      document.getElementById("productName").value = nombre;
      document.getElementById("productPrice").value = precio;
      document.getElementById("productImage").value = imagen;
      document.getElementById("productCategory").value = category;
      productModal.classList.add("active");
    });
  });

  document.querySelectorAll(".delete-product-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const confirmed = await showConfirmCustom("¿Seguro que deseas eliminar este producto?");
      if (confirmed) {
        const id = e.target.dataset.id;
        const res = await f(`products/${id}`, { method: 'DELETE' });
        if (res && res.ok) {
          showToast("Producto eliminado");
          fetchProducts();
        } else if (res) {
          const data = await res.json();
          showToast("Error: " + data.message);
        }
      }
    });
  });
}
