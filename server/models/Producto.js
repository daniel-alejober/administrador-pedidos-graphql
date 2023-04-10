import mongoose from "mongoose";

const ProductosSchema = mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    existencia: { type: Number, required: true },
    precio: { type: Number, required: true },
  },
  { timestamp: true }
);

//*Creamos un index para poder consultar los productos por el nombre
// ProductosSchema.index({ nombre: "text" });

const Producto = mongoose.model("Product", ProductosSchema);
export default Producto;
