# GO Web Solutions API - 2° Pre-Entrega

Servidor de e-commerce desarrollado para el curso de Backend de Coderhouse. En esta segunda entrega se integró un motor de plantillas y comunicación en tiempo real.

## 🛠️ Tecnologías Utilizadas

- Node.js & Express
- FileSystem (Persistencia en archivos JSON)
- Express-Handlebars (Motor de plantillas)
- Socket.io (Websockets para tiempo real)

## 🚀 Instrucciones de Instalación

1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar todas las dependencias.
3. Iniciar el servidor con `npm run dev` o `npm start`.
4. El servidor correrá en `http://localhost:8080`.

## 📌 Vistas y Endpoints para probar

- **Catálogo Estático:** Navegar a `http://localhost:8080/` para ver la lista de productos renderizada con Handlebars.
- **Administrador en Tiempo Real:** Navegar a `http://localhost:8080/realtimeproducts`. Aquí podrás agregar o eliminar productos y ver cómo la lista se actualiza instantáneamente en todos los clientes conectados gracias a websockets.
- **API Endpoints:** Se mantienen funcionales las rutas base `/api/products` y `/api/carts`.
