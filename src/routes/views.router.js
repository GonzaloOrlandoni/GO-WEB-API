const express = require("express");
const router = express.Router();
const Product = require("../models/product.model"); // Importamos modelo de Productos
const Cart = require("../models/cart.model"); // Importamos modelo de Carritos

// 1. Vista principal de productos con Paginación
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // ¡OJO ACÁ!: El "lean: true" es un truco fundamental.
    // Convierte los documentos de Mongo a objetos puros de JS para que Handlebars los pueda leer sin chistar.
    const result = await Product.paginate({}, { page, limit, lean: true });

    res.render("home", {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista de productos");
  }
});

// 2. Vista de un carrito específico (Nueva vista pedida en la rúbrica)
router.get("/carts/:cid", async (req, res) => {
  try {
    // Usamos populate para traer los datos del producto y lean() para Handlebars
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();

    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send("Error al cargar la vista del carrito");
  }
});

module.exports = router;
