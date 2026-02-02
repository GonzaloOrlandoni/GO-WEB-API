const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

// Instanciamos el manager para productos
const productManager = new ProductManager("./products.json");

// GET /api/products/ - Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/products/:pid - Traer producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST /api/products/ - Agregar nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    // Validación de campos obligatorios según enunciado
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    const newProduct = await productManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT /api/products/:pid - Actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    // El ID no debe actualizarse nunca
    delete updateData.id;

    const updatedProduct = await productManager.updateProduct(pid, updateData);
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE /api/products/:pid - Eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    res.json({ status: "success", message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
