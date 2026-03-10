const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose"); // 👈 NUEVO: Importamos Mongoose
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const ProductManager = require("./managers/ProductManager");

const app = express();
const PORT = 8080;

// Temporal: Mantenemos el manager viejo hasta crear los Modelos de Mongo
const pm = new ProductManager("./products.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// ☁️ NUEVO: Conexión a MongoDB Atlas (GO Web Solutions)
const MONGO_URL =
  "mongodb+srv://gonzaloorlandoni1_db_user:aTf79v9cdX1xVwQv@cluster0.xtzcabl.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("🟢 Base de datos conectada con éxito a GO Web Solutions"))
  .catch((error) => console.error("🔴 Error en la conexión a la base de datos:", error));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Levantamos el servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Servidor de GO Web Solutions corriendo en http://localhost:${PORT}`);
});

// Levantamos el servidor de Websockets adjunto al HTTP
const io = new Server(httpServer);

// Lógica de Sockets (En el próximo paso lo pasaremos a MongoDB)
io.on("connection", async (socket) => {
  console.log("🟢 Nuevo cliente conectado vía Socket");

  const products = await pm.getProducts();
  socket.emit("updateProducts", products);

  socket.on("addProduct", async (product) => {
    await pm.addProduct(product);
    const updatedProducts = await pm.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (id) => {
    await pm.deleteProduct(id);
    const updatedProducts = await pm.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});
