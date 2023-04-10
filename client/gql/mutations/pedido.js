import { gql } from "@apollo/client";

const AGREGAR_PEDIDO = gql`
  mutation NuevoPedido($dataPedido: DataPedido) {
    nuevoPedido(dataPedido: $dataPedido) {
      id
    }
  }
`;

const ACTUALIZAR_PEDIDO_ESTADO = gql`
  mutation ActualizarPedido($pedidoId: ID!, $dataPedido: DataPedido) {
    actualizarPedido(pedidoId: $pedidoId, dataPedido: $dataPedido) {
      estado
    }
  }
`;

const ELIMINAR_PEDIDO = gql`
  mutation EliminarPedido($pedidoId: ID!) {
    eliminarPedido(pedidoId: $pedidoId) {
      mensaje
      id
    }
  }
`;

export { AGREGAR_PEDIDO, ACTUALIZAR_PEDIDO_ESTADO, ELIMINAR_PEDIDO };
