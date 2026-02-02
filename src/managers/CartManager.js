const fs = require("fs");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Lee los carritos desde el archivo JSON
  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error al leer carritos:", error);
      return [];
    }
  }

  // Crea un carrito nuevo con ID autogenerado
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1, // Generación simple de ID
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return newCart;
  }

  // Obtiene un carrito específico por su ID
  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id === parseInt(id));
  }

  // Agrega un producto al carrito (Lógica de quantity)
  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === parseInt(cid));

    if (cartIndex === -1) return null;

    const productIndex = carts[cartIndex].products.findIndex((p) => p.product === parseInt(pid));

    if (productIndex !== -1) {
      // Si el producto ya existe, aumenta la cantidad
      carts[cartIndex].products[productIndex].quantity++;
    } else {
      // Si es nuevo, lo agrega con quantity 1
      carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return carts[cartIndex];
  }
}

module.exports = CartManager;
