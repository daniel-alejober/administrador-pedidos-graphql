import { gql } from "@apollo/client";

const OBTENER_USUARIO = gql`
  query ObtenerUsuario {
    obtenerUsuario {
      nombre
      apellido
    }
  }
`;

const MEJORES_VENDEDORES = gql`
  query MejoresVendedores {
    mejoresVendedores {
      vendedor {
        nombre
        apellido
      }
      totalVendido
    }
  }
`;

export { OBTENER_USUARIO, MEJORES_VENDEDORES };
