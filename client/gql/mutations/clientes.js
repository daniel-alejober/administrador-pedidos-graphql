import { gql } from "@apollo/client";

const CREAR_NUEVO_CLIENTE = gql`
  mutation NuevoCliente($dataClient: DataCliente) {
    nuevoCliente(dataClient: $dataClient) {
      vendedor
      telefono
      nombre
      empresa
      email
      apellido
      id
    }
  }
`;

const ELIMINAR_CLIENTE = gql`
  mutation EliminarCliente($clienteId: ID!) {
    eliminarCliente(clienteId: $clienteId) {
      id
      mensaje
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
  mutation ActualizarCliente($clienteId: ID!, $dataClient: DataCliente) {
    actualizarCliente(clienteId: $clienteId, dataClient: $dataClient) {
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

export { CREAR_NUEVO_CLIENTE, ELIMINAR_CLIENTE, ACTUALIZAR_CLIENTE };
