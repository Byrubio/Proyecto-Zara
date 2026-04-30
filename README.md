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

### Backend
* PHP 8.2
* Laravel 12
* Composer

### Base de datos

* MySQL (gestionado con phpMyAdmin)
* XAMPP(entorno local)

### Herramientas de desarrollo
* Antigravity (agente de IA).
* SonarQube Cloud(análisis de calidad de código).

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
/proyecto
│
├── /css
├── /js
├── /images
├── index.html
├── banos.html
├── admin.html (opcional)
└── README.md
```
---
## Guía de Desarrollo - API de Productos
Esta sección detalla los paquetes utilizados y los puntos de acceso para interactuar con los datos.

##  Paquetes y Tecnologías Usadas

Se han utilizado las siguientes librerías de la comunidad Laravel para agilizar el desarrollo:

**Backend**
*   **Laravel 12:** Framework base del proyecto.
*   **PHP 8.2**
*   **Laravel Sanctum (v4.0):** Encargado de la seguridad y autenticación mediante tokens de los endpoints.
*   **Laravel Tinker:** Para la depuración y ejecución de código en tiempo real desde la consola.
**Herramientas de desarrollo**
*   **FakerPHP:** Para la generación de datos de prueba (seeders) en la base de datos.
*   **Laravel Pint:** formateo de código
*   **Laravel Pail:** monitorización de logs
*   **SonarQube Cloud:** análisis de calidad de código
*   **Antigravity:** asistente de IA para desarrollo

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
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd Proyecto-Zara
   ```
2. **Configuración automática:**
   Ejecuta este comando para configurar todo el sistema de golpe:
   ```bash
   composer run setup
   ```
3. **Iniciar el proyecto:**
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

* Base de datos real
* Sistema de pagos
* Autenticación avanzada

---

##  Autor

* Byrubio
* Dayren-z

---
