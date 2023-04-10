import mongoose from "mongoose";

const PedidosSchema = mongoose.Schema({
  pedido: { type: [], required: true },
  total: { type: Number, required: true },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  estado: {
    type: String,
    default: "PENDIENTE",
  },
  creado: {
    type: String,
    default: Date.now(),
  },
});

const Pedido = mongoose.model("Order", PedidosSchema);
export default Pedido;
