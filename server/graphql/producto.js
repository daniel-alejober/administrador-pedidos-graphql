import { gql } from "apollo-server";
import Producto from "../models/Producto.js";

export const typeDefsProducto = gql`
  type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
  }

  type ResponseProducto {
    id: ID!
    mensaje: String!
  }

  input DataProducto {
    nombre: String!
    existencia: Int!
    precio: Float!
  }

  type Query {
    obtenerProductos: [Producto]
    obtenerProducto(productoId: ID!): Producto
    buscarProducto(textoBusqueda: String!): [Producto]
  }

  type Mutation {
    nuevoProducto(dataProduct: DataProducto): Producto
    actualizarProducto(productoId: ID!, dataProduct: DataProducto): Producto
    eliminarProducto(productoId: ID!): ResponseProducto
  }
`;

export const resolversProducto = {
  Query: {
    obtenerProductos: async () => {
      try {
        const productos = Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { productoId }) => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(productoId)) {
          throw new Error("ID de producto no válido");
        }
        const producto = await Producto.findById(productoId);

        if (!producto) throw new Error("Este producto no existe");

        return producto;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    buscarProducto: async (_, { textoBusqueda }) => {
      //*va a buscar por medio de un texto
      try {
        const productos = await Producto.find({
          $text: { $search: textoBusqueda },
        }).limit(10);
        return productos;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    nuevoProducto: async (_, { dataProduct }) => {
      try {
        const producto = Producto.create(dataProduct);
        return producto;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { productoId, dataProduct }) => {
      if (!/^[0-9a-fA-F]{24}$/.test(productoId)) {
        throw new Error("ID de producto no válido");
      }
      let producto = await Producto.findById(productoId);

      if (!producto) throw new Error("Este producto no existe");

      producto = await Producto.findOneAndUpdate(
        {
          _id: productoId,
        },
        dataProduct,
        { new: true }
      );
      return producto;
    },
    eliminarProducto: async (_, { productoId }) => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(productoId)) {
          throw new Error("ID de producto no válido");
        }
        const producto = await Producto.findById(productoId);

        if (!producto) throw new Error("Este producto no existe");

        await Producto.findByIdAndDelete({ _id: productoId });
        const respuesta = {
          id: productoId,
          mensaje: "Producto Eliminado",
        };
        return respuesta;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
