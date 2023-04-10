import { gql } from "@apollo/client";

const OBTENER_CLIENTES_VENDEDOR = gql`
  query ObtenerClientesVendedor {
    obtenerClientesVendedor {
      apellido
      email
      id
      telefono
      nombre
      empresa
    }
  }
`;

const OBTENER_CLIENTE_ID = gql`
  query ObtenerCliente($clienteId: ID!) {
    obtenerCliente(clienteId: $clienteId) {
      vendedor
      telefono
      nombre
      id
      empresa
      email
      apellido
    }
  }
`;

const MEJORES_CLIENTES = gql`
  query MejoresClientes {
    mejoresClientes {
      cliente {
        nombre
        apellido
      }
      totalComprado
    }
  }
`;

export { OBTENER_CLIENTES_VENDEDOR, OBTENER_CLIENTE_ID,MEJORES_CLIENTES };
