const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io"); // Importamos Socket.io
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router"); // El router de vistas que armamos antes
const ProductManager = require("./managers/ProductManager");

const app = express();
const PORT = 8080;
const pm = new ProductManager("./products.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // Muy importante para que el HTML lea tu JS del cliente

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Levantamos el servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor de GO Web Solutions en http://localhost:${PORT}`);
});

// Levantamos el servidor de Websockets adjunto al HTTP
const io = new Server(httpServer);

// Lógica de Sockets (El "cerebro" del tiempo real)
io.on("connection", async (socket) => {
  console.log("🟢 Nuevo cliente conectado");

  // 1. Cuando un cliente se conecta, le enviamos todos los productos actuales
  const products = await pm.getProducts();
  socket.emit("updateProducts", products);

  // 2. Escuchamos cuando el cliente envía un nuevo producto desde el formulario
  socket.on("addProduct", async (product) => {
    await pm.addProduct(product);
    // io.emit envía el mensaje a TODOS los clientes conectados para que actualicen su vista
    const updatedProducts = await pm.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  // 3. Escuchamos cuando el cliente quiere eliminar un producto
  socket.on("deleteProduct", async (id) => {
    await pm.deleteProduct(id);
    const updatedProducts = await pm.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});
