import { gql } from "@apollo/client";

const OBTENER_PEDIDOS = gql`
  query ObtenerPedidosVendedor {
    obtenerPedidosVendedor {
      creado
      estado
      id
      total
      cliente {
        nombre
        id
        email
        apellido
        telefono
      }
      pedido {
        precio
        nombre
        id
        cantidad
      }
    }
  }
`;

export { OBTENER_PEDIDOS };
