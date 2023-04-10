import { gql } from "@apollo/client";

const NUEVO_PRODUCTO = gql`
  mutation NuevoProducto($dataProduct: DataProducto) {
    nuevoProducto(dataProduct: $dataProduct) {
      precio
      nombre
      id
      existencia
    }
  }
`;

const ELIMINAR_PRODUCTO = gql`
  mutation EliminarProducto($productoId: ID!) {
    eliminarProducto(productoId: $productoId) {
      mensaje
      id
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation ActualizarProducto($productoId: ID!, $dataProduct: DataProducto) {
    actualizarProducto(productoId: $productoId, dataProduct: $dataProduct) {
      precio
      nombre
      existencia
      id
    }
  }
`;

export { NUEVO_PRODUCTO, ELIMINAR_PRODUCTO, ACTUALIZAR_PRODUCTO };
