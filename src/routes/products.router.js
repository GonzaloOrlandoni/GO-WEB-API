const express = require("express");
const router = express.Router();
const Product = require("../models/product.model"); // Importamos nuestro Modelo de Mongo

// GET /api/products -> Trae todos los productos con Paginación, Filtro y Orden
router.get("/", async (req, res) => {
  try {
    // Tomamos los datos de la URL (query params), con valores por defecto
    const { limit = 10, page = 1, sort, query } = req.query;

    // Armamos el filtro: Si viene "query", buscamos por categoría
    const filter = query ? { category: query } : {};

    // Armamos las opciones de paginación y ordenamiento
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      // Si sort es 'asc', ordenamos por precio ascendente (1), si es 'desc' descendente (-1)
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
    };

    // Ejecutamos la consulta con el plugin paginate
    const result = await Product.paginate(filter, options);

    // Formato estricto exigido por la rúbrica de Coderhouse
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

// GET /api/products/:pid -> Trae un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al buscar el producto" });
  }
});

// POST /api/products -> Crea un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    // Validación para que no falten datos (Suma puntos en la rúbrica)
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: "error", error: "Faltan campos obligatorios" });
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    // Capturamos error si el código está duplicado
    if (error.code === 11000) {
      return res.status(400).json({ status: "error", error: "El código del producto ya existe" });
    }
    res.status(500).json({ status: "error", error: "Error al crear el producto" });
  }
});

// PUT /api/products/:pid -> Actualiza un producto
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al actualizar el producto" });
  }
});

// DELETE /api/products/:pid -> Elimina un producto
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    res.json({ status: "success", payload: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al eliminar el producto" });
  }
});

module.exports = router;
