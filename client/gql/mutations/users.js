import { gql } from "@apollo/client";

const NUEVA_CUENTA = gql`
  mutation NuevoUsuario($dataUser: CrearUsuario) {
    nuevoUsuario(dataUser: $dataUser) {
      nombre
      id
      email
      creado
      apellido
    }
  }
`;

const AUTENTICAR_USUARIO = gql`
  mutation AutenticarUsuario($dataUser: LoginUser) {
    autenticarUsuario(dataUser: $dataUser) {
      token
    }
  }
`;

export { NUEVA_CUENTA, AUTENTICAR_USUARIO };
