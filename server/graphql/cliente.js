import { gql } from "apollo-server";
import Cliente from "../models/Clientes.js";
import Pedido from "../models/Pedido.js";

export const typeDefsCliente = gql`
  type Cliente {
    id: ID
    nombre: String
    apellido: String
    empresa: String
    email: String
    telefono: String
    vendedor: ID
  }

  type TopCliente {
    totalComprado: Float
    cliente: [Cliente]
  }

  type ClienteEliminado {
    id: ID
    mensaje: String
  }

  input DataCliente {
    nombre: String!
    apellido: String!
    empresa: String!
    email: String!
    telefono: String
  }

  extend type Query {
    obtenerClientes: [Cliente]
    obtenerClientesVendedor: [Cliente]
    obtenerCliente(clienteId: ID!): Cliente
    mejoresClientes: [TopCliente]
  }

  type Mutation {
    nuevoCliente(dataClient: DataCliente): Cliente
    actualizarCliente(clienteId: ID!, dataClient: DataCliente): Cliente
    eliminarCliente(clienteId: ID!): ClienteEliminado
  }
`;

export const resolversCliente = {
  Query: {
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        const clientes = await Cliente.find({ vendedor: ctx.userId });
        return clientes;
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    obtenerCliente: async (_, { clienteId }, ctx) => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(clienteId)) {
          throw new Error("ID no válido");
        }
        const cliente = await Cliente.findById(clienteId);

        if (!cliente) throw new Error("Este cliente no esta registrado");

        if (cliente.vendedor.toString() !== ctx.userId) {
          throw new Error(
            "Solo puedes ver a los clientes que has dado de alta"
          );
        }
        return cliente;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    mejoresClientes: async () => {
      try {
        //*Los va a juntar por el cliente, en la tabla de Pedido tiene un campo llamado cliente los vamos a juntar por medio del cliente
        //* El siguiente campo es la operacion que realizara, le damos un nombre X que asi se llamara ese campo "totalComprado", despues la operacion que va a realizar que sera sumar el campo llamado $total de la tabla Pedido por cliente, verificara todos los pedidos de los clientes y los suma
        //*Despues vamos a hacer un $lookup que es parecido a un join o poppulate para que nos traiga la informacion del cliente
        const mejoresClientes = await Pedido.aggregate([
          { $match: { estado: "COMPLETADO" } }, //*Va a traer con todos los que tengan el estado completado
          { $group: { _id: "$cliente", totalComprado: { $sum: "$total" } } },
          {
            $lookup: {
              from: "clients", //*nombre de la tabla en plural ya que asi aparece el folder en mongodb-compas para que podamos traer los datos del vendedor
              localField: "_id", //*por que valor lo va a buscar en la tabla actual _id PEDIDO
              foreignField: "_id", //*por que valor lo va a buscar en la tabla foranea _id CLIENTE
              as: "cliente", //*con que nombre del objeto en el cual vendran los datos
            },
          },
          { $limit: 3 }, //*Los mejores 3
          { $sort: { totalComprado: -1 } }, //*lo va a ordenar del mas alto al mas bajo
        ]);
        return mejoresClientes;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    nuevoCliente: async (_, { dataClient }, ctx) => {
      const userId = ctx.userId;

      try {
        const clienteExistente = await Cliente.findOne({
          email: dataClient.email,
        });
        if (clienteExistente)
          throw new Error("Este cliente ya ha sido registrado");

        dataClient.vendedor = userId;
        const nuevoCliente = await Cliente.create(dataClient);
        return nuevoCliente;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    actualizarCliente: async (_, { clienteId, dataClient }, ctx) => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(clienteId)) {
          throw new Error("ID no válido");
        }

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) throw new Error("Este cliente no esta registrado");

        if (cliente.vendedor.toString() !== ctx.userId) {
          throw new Error(
            "Solo puedes editar a los clientes que has dado de alta"
          );
        }
        const clienteUpdate = Cliente.findByIdAndUpdate(
          { _id: clienteId },
          dataClient,
          { new: true }
        );
        return clienteUpdate;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    eliminarCliente: async (_, { clienteId }, ctx) => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(clienteId)) {
          throw new Error("ID  no válido");
        }

        const cliente = await Cliente.findById(clienteId);
        if (!cliente) throw new Error("Este cliente no esta registrado");

        if (cliente.vendedor.toString() !== ctx.userId) {
          throw new Error(
            "Solo puedes eliminar a los clientes que has dado de alta"
          );
        }

        await Cliente.findByIdAndDelete(clienteId);
        const response = {
          mensaje: "Cliente Eliminado",
          id: clienteId,
        };

        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};
