import mongoose from "mongoose";

const UsuarioSchema = mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  creado: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", UsuarioSchema);
export default User;
