import mongoose from "mongoose";

const conectarDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Conectado a Mongo");
  } catch (error) {
    console.log(error);
    process.exit(1); // detener la app
  }
};

export default conectarDB;
