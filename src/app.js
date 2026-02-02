const express = require("express");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();
const PORT = 8080;

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base según el enunciado
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("¡Servidor de GO Web Solutions funcionando!");
});
