const socket = io();

const productForm = document.getElementById("productForm");
const productsList = document.getElementById("productsList");

// Escuchar cuando el servidor manda la lista actualizada
socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <strong>${product.title}</strong> - $${product.price}
            <em>(Stock: ${product.stock})</em>
            <button onclick="deleteProduct(${product.id})">❌ Eliminar</button>
        `;
    productsList.appendChild(li);
  });
});

// Enviar nuevo producto por Sockets
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    category: document.getElementById("category").value,
  };

  socket.emit("addProduct", newProduct);
  productForm.reset();
});

// Eliminar producto por Sockets
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
