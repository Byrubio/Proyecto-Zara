   # Zara Home - Proyecto Web - Clon

##  Descripción
Este proyecto consiste en el desarrollo de una página web inspirada en Zara Home, integrando tanto frontend como backend.

Incluye funcionalidades propias de un e-commerce moderno como visualización de productos, carrito de compra, buscador, sistema de autenticación y conexión con una API.

El objetivo ha sido simular un entorno real de desarrollo web completo (full-stack).


---

##  Tecnologías utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* Notyf (Librería para feedback de usuario y micro-interacciones)

### Backend
* PHP 8.2
* Laravel 12
* Composer

### Base de datos

* MySQL (gestionado con phpMyAdmin)
* XAMPP(entorno local)

### Herramientas de desarrollo

*   **SonarQube Cloud:** análisis de calidad de código
*   **Antigravity:** asistente de IA para desarrollo

---

##  Funcionalidades

*  Página principal con navegación
*  Carrito de compra dinámico
*  Buscador de productos
*  Sistema de favoritos
*  Página de productos (Baño)
*  Cambio de vistas (2, 3 y 4 columnas)
*  Sistema de autenticación (Login/Register).
*  Selección de región (modal)
*  Gestión de productos (CRUD) mediante API.
*  Panel de administración (gestión de productos)

---

  ## Estructura del proyecto

```
/api-products
/css
/data
/img
/js
README.md
admin.html
banos.html
dashboard.html
index.html

```
---
## Guía de Desarrollo - API de Productos
Esta sección describe cómo funciona la API del proyecto y los puntos de acceso disponibles para interactuar con los datos.

##  Arquitectura de la API
La API está construida sobre Laravel 12 y expone endpoints REST para:

---

##  Definición de Endpoints (API)

Todos los endpoints de la API están prefijados con `/api`. Las respuestas se entregan siempre en formato JSON.

---

###  Autenticación

| Método | Endpoint | Acción | Descripción |
|:--- |:--- |:--- |:--- |
| `POST` | `/api/register` | `register` | Registro de nuevos usuarios. |
| `POST` | `/api/login` | `login` | Inicio de sesión y entrega de Token. |
| `POST` | `/api/logout` | `logout` | Cierre de sesión (revocación de Token). |
| `GET` | `/api/user` | `auth:sanctum` | Obtiene el perfil del usuario autenticado. |

###  Gestión de Productos (CRUD)

| Método | Endpoint | Acción | Descripción |
|:--- |:--- |:--- |:--- |
| `GET` | `/api/products` | `index` | Listar todos los productos. |
| `POST` | `/api/products` | `store` | Crear un nuevo producto. |
| `GET` | `/api/products/{product}` | `show` | Ver detalle de un producto específico. |
| `PUT/PATCH` | `/api/products/{product}` | `update` | Editar un producto existente. |
| `DELETE` | `/api/products/{product}` | `destroy` | Eliminar un producto. |

> **Nota:** Los endpoints de creación, edición y borrado requieren que se envíe el `Bearer Token` obtenido en el login en las cabeceras de la petición.

---
##  Instalación y uso

### Requisitos:
* XAMPP (Apache + MySQL)
* PHP 8.2+ y Composer

### Pasos:
1.  Crea una base de datos en blanco en phpMyAdmin
2.  Renombra el archivo .env.example a .env y configura las credenciales de tu base de datos (DB_DATABASE, DB_USERNAME, etc.).
3. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Byrubio/Proyecto-Zara.git
   cd Proyecto-Zara
   ```
4. **Configuración automática:**
   Ejecuta este comando para configurar todo el sistema de golpe:
   ```bash
   composer run setup
   ```
5. **Iniciar el proyecto:**
   Para arrancar tanto el servidor de Laravel como el de Vite (frontend):
   ```bash
   composer run dev
   ```



---
## Análisis de código
Se ha utilizado SonarQube Cloud para:

* Detectar errores
* Mejorar calidad del código
* Aplicar buenas prácticas
---

##  Capturas 

![Página principal](https://github.com/user-attachments/assets/d49be0fc-d44a-416d-ad41-803162f8b8ed)


---

##  Objetivos de aprendizaje
* Desarrollo Full Stack
* Integración Frontend - Backend
* Uso de APIs REST
* Gestión de base de datos
* Diseño de interfaces tipo e-commerce

---

##  Mejoras futuras

* Página de detalle de producto
* Sistema de pagos
* Autenticación avanzada(roles,permisos,recuperación de contraseña)
* Panel de administración completo (categorías, usuarios, pedidos)
* Filtros avanzados (precio, color, tamaño)
* Optimización responsive para más dispositivos
* Mejora del rendimiento y carga de imágenes

---

##  Autor

* Byrubio
* Dayren-z

---
