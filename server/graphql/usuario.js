import { gql } from "apollo-server";
import Usuario from "../models/Usuario.js";
import Pedido from "../models/Pedido.js";
import bcrypt from "bcryptjs";
import { generarToken } from "../config/jwtUtils.js";

//*Podemos usar extend en extend type Query
export const typeDefsUsuario = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  type TopVendedor {
    totalVendido: Float
    vendedor: [Usuario]
  }

  input CrearUsuario {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  input LoginUser {
    email: String!
    password: String!
  }

  type Query {
    obtenerUsuario: Usuario
    mejoresVendedores: [TopVendedor]
  }

  type Mutation {
    nuevoUsuario(dataUser: CrearUsuario): Usuario
    autenticarUsuario(dataUser: LoginUser): Token
  }
`;

export const resolversUsuario = {
  Query: {
    obtenerUsuario: async (_, {}, ctx) => {
      try {
        const user = await Usuario.findById(ctx.userId);
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    mejoresVendedores: async () => {
      try {
        //*ahora en este caso los va a separar por el vendedor y no por el cliente, recuerda que en la tabla de Pedido hay un campo llamado vendedor
        const mejoresVendedores = await Pedido.aggregate([
          { $match: { estado: "COMPLETADO" } },
          { $group: { _id: "$vendedor", totalVendido: { $sum: "$total" } } },
          {
            $lookup: {
              from: "users", //*nombre de la tabla en plural ya que asi aparece el folder en mongodb-compas para que se traiga los datos de vendedor
              localField: "_id", //*por que valor lo va a buscar en la tabla actual _id PEDIDO
              foreignField: "_id", //*por que valor lo va a buscar en la tabla foranea _id CLIENTE
              as: "vendedor", //*con que nombre del objeto en el cual vendran los datos
            },
          },
          { $limit: 3 }, //*Los mejores 3
          { $sort: { totalComprado: -1 } },
        ]);
        return mejoresVendedores;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { dataUser }) => {
      const { email, password } = dataUser;

      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error("El usuario ya existe");
      }

      const salt = bcrypt.genSaltSync(10);
      dataUser.password = bcrypt.hashSync(password, salt);

      try {
        const usuario = Usuario.create(dataUser);
        return usuario;
      } catch (error) {
        console.log(error.message);
      }
    },
    autenticarUsuario: async (_, { dataUser }) => {
      const { email, password } = dataUser;

      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no esta registrado");
      }

      const desHashPass = bcrypt.compareSync(password, existeUsuario.password);
      if (!desHashPass) {
        throw new Error("La contraseña es incorrecta");
      }

      return {
        token: generarToken(existeUsuario.id),
      };
    },
  },
};
