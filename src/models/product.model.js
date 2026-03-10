const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollection = "products"; // Nombre de la colección en la base de datos

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // unique para que no se repitan códigos
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
});

// Le inyectamos el plugin de paginación al esquema
productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;
