import { gql } from "@apollo/client";

const OBTENER_PRODUCTOS = gql`
  query ObtenerProductos {
    obtenerProductos {
      precio
      nombre
      id
      existencia
    }
  }
`;

const OBTENER_PRODUCTO = gql`
  query ObtenerProducto($productoId: ID!) {
    obtenerProducto(productoId: $productoId) {
      precio
      nombre
      id
      existencia
    }
  }
`;

export { OBTENER_PRODUCTOS, OBTENER_PRODUCTO };
