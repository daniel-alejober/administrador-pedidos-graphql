import mongoose from "mongoose";

const ClientesSchema = mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    empresa: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    telefono: { type: String, trim: true },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamp: true }
);

const Cliente = mongoose.model("Client", ClientesSchema);
export default Cliente;
