const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");
const pm = new ProductManager("./products.json");

router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products }); // Renderiza home.handlebars pasando los productos
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts"); // Renderiza la vista de sockets
});

module.exports = router;
