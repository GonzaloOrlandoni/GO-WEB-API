# GO Web Solutions API - Entrega Final 🚀

Este es el backend profesional de e-commerce desarrollado para el curso de Programación Backend en Coderhouse. En esta etapa final, el sistema migró de una persistencia local a una base de datos en la nube, profesionalizando la gestión de productos y carritos.

## 🛠️ Tecnologías y Herramientas

- **Node.js & Express**: Servidor base.
- **MongoDB Atlas**: Sistema de persistencia principal en la nube.
- **Mongoose**: Modelado de datos y esquemas.
- **Mongoose-Paginate-V2**: Motor de paginación para productos.
- **Express-Handlebars**: Motor de plantillas para el frontend.
- **Socket.io**: Comunicación en tiempo real para el catálogo.
- **Thunder Client**: Testeo de API y endpoints.

## 📌 Funcionalidades Destacadas

### 📦 Gestión de Productos

- **Paginación Avanzada**: El endpoint `GET /api/products` soporta `limit`, `page`, `query` (filtro por categoría/stock) y `sort` (precio asc/desc).
- **Formato de Respuesta**: Cumple con el estándar de éxito/error y metadatos de navegación (prevLink, nextLink, etc.).

### 🛒 Gestión de Carritos

- **Persistencia Real**: Carritos almacenados en la base de datos con referencia a productos.
- **Populate**: Al solicitar un carrito, se desglosa la información completa de cada producto asociado.
- **Endpoints Completos**: Soporte para vaciar carrito, actualizar cantidades específicas y actualizar el arreglo completo de productos.

### 🛡️ Seguridad y Estabilidad

- **Validaciones**: Control de campos obligatorios en la creación de productos.
- **Manejo de Errores**: Implementación de bloques `try/catch` en todos los servicios para garantizar la estabilidad del servidor.

## 🚀 Instrucciones de Uso

1. **Instalación**: Clonar el repositorio y ejecutar `npm install`.
2. **Base de Datos**: El proyecto ya cuenta con una conexión configurada a un cluster de MongoDB Atlas.
3. **Inicio**: Ejecutar `npm run dev` para iniciar el servidor en `http://localhost:8080`.

## 🔗 Vistas Principales

- **Catálogo Paginado**: Navegar a `http://localhost:8080/` para ver productos con navegación entre páginas.
- **Vista de Carrito**: Acceder a `http://localhost:8080/carts/:cid` para visualizar los productos agregados mediante el sistema de _populate_.
- **API Endpoints**: Acceso completo a `/api/products` y `/api/carts` para pruebas mediante Thunder Client o Postman.

---

**Desarrollado por Gonzalo Orlandoni - GO Web Solutions**
