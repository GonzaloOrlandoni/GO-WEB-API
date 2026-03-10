const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model"); // Importamos el Modelo de Carrito

// POST /api/carts -> Crea un carrito nuevo vacío
router.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al crear el carrito" });
  }
});

// GET /api/carts/:cid -> Trae un carrito con sus productos completos (POPULATE)
router.get("/:cid", async (req, res) => {
  try {
    // El populate hace la magia de traer los datos del producto referenciado
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al obtener el carrito" });
  }
});

// POST /api/carts/:cid/product/:pid -> Agrega un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    // Buscamos si el producto ya está en el carrito
    const productIndex = cart.products.findIndex((p) => p.product.toString() === req.params.pid);

    if (productIndex !== -1) {
      // Si ya existe, le sumamos 1 a la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si no existe, lo agregamos con cantidad 1
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al agregar producto al carrito" });
  }
});

// DELETE /api/carts/:cid/products/:pid -> Elimina un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    // Filtramos para dejar todos los productos MENOS el que queremos eliminar
    cart.products = cart.products.filter((p) => p.product.toString() !== req.params.pid);
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al eliminar producto del carrito" });
  }
});

// PUT /api/carts/:cid -> Actualiza todo el carrito con un arreglo de productos nuevo
router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body }, { new: true });
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al actualizar el carrito" });
  }
});

// PUT /api/carts/:cid/products/:pid -> Actualiza SÓLO la cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex((p) => p.product.toString() === req.params.pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity; // Pisamos la cantidad con la que viene del body
      await cart.save();
      res.json({ status: "success", payload: cart });
    } else {
      res.status(404).json({ status: "error", error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al actualizar la cantidad" });
  }
});

// DELETE /api/carts/:cid -> Vacía el carrito por completo
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: [] }, { new: true });
    if (!cart) return res.status(404).json({ status: "error", error: "Carrito no encontrado" });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al vaciar el carrito" });
  }
});

module.exports = router;
