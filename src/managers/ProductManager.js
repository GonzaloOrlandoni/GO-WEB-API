const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      return [];
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      ...product,
      status: product.status ?? true, // Si no viene, es true por defecto
    };

    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
    return newProduct;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id === parseInt(id));
  }

  async updateProduct(id, updateData) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) return null;

    // Mezclamos los datos viejos con los nuevos, pero mantenemos el ID original
    products[index] = { ...products[index], ...updateData, id: products[index].id };

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) return false;

    const filteredProducts = products.filter((p) => p.id !== parseInt(id));
    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, "\t"));
    return true;
  }
}

module.exports = ProductManager;
