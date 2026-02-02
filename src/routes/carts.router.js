const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");

// Instanciamos el manager apuntando al JSON de la raíz
const cartManager = new CartManager("./carts.json");

// POST /api/carts/ - Crea un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: "success", message: "Carrito creado", cart: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/carts/:cid - Lista productos de un carrito específico
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({ status: "success", products: cart.products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/carts/:cid/product/:pid - Agrega un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ status: "error", message: "No se pudo actualizar el carrito" });
    }

    res.json({ status: "success", message: "Producto agregado", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
