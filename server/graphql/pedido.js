import { gql } from "apollo-server";
import Pedido from "../models/Pedido.js";
import Cliente from "../models/Clientes.js";
import Producto from "../models/Producto.js";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export const typeDefsPedido = gql`
  type Pedido {
    id: ID
    pedido: [PedidoGrupo]
    total: Float
    cliente: Cliente
    vendedor: ID
    estado: EstadoPedido
    creado: String
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
  }

  type PedidoEliminado {
    id: ID
    mensaje: String
  }

  input DataPedido {
    pedido: [PedidoProducto]
    total: Float
    cliente: ID
    estado: EstadoPedido
  }
  input PedidoProducto {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
  }

  #Solo aceptara esas 3 opciones
  enum EstadoPedido {
    PENDIENTE
    CANCELADO
    COMPLETADO
  }

  extend type Query {
    obtenerPedidos: [Pedido]
    obtenerPedido(pedidoId: ID!): Pedido
    obtenerPedidosVendedor: [Pedido]
    obtenerPedidosEstado(estadoPedido: String!): [Pedido]
  }

  type Mutation {
    nuevoPedido(dataPedido: DataPedido): Pedido
    actualizarPedido(pedidoId: ID!, dataPedido: DataPedido): Pedido
    eliminarPedido(pedidoId: ID!): PedidoEliminado
  }
  #Creamos una susbcripcion que regresara un pedido
  type Subscription {
    pedidoActualizado: Pedido!
  }
`;

export const resolversPedido = {
  Query: {
    obtenerPedidos: async () => {
      try {
        const pedidos = await Pedido.find({});
        return pedidos;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    obtenerPedidosVendedor: async (_, {}, ctx) => {
      try {
        const pedidos = await Pedido.find({ vendedor: ctx.userId }).populate(
          "cliente"
        );
        return pedidos;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    obtenerPedido: async (_, { pedidoId }, ctx) => {
      try {
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) throw new Error("Este pedido no existe");

        if (pedido.vendedor.toString() !== ctx.userId)
          throw new Error("Solo puedes ver los pedidos a tus clientes");

        return pedido;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    obtenerPedidosEstado: async (_, { estadoPedido }, ctx) => {
      try {
        const pedidos = await Pedido.find({
          vendedor: ctx.userId,
          estado: estadoPedido,
        });
        return pedidos;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    nuevoPedido: async (_, { dataPedido }, ctx) => {
      //*verificar si el cliente existe y si ese cliente pertenece a su vendedor

      try {
        const existeCliente = await Cliente.findById(dataPedido.cliente);
        if (!existeCliente) throw new Error("El cliente no existe");

        if (existeCliente.vendedor.toString() !== ctx.userId)
          throw new Error("Solo puedes crear pedidos a tus clientes");

        //*Resivar si hay productos en stock
        //*for await viene de node.js es asyncrono

        for await (const articulo of dataPedido.pedido) {
          const { id, cantidad } = articulo;

          const producto = await Producto.findById(id);
          if (!producto) throw new Error("ESte producto no existe");

          if (cantidad > producto.existencia) {
            throw new Error(
              `No hay suficiente cantidad del producto ${producto.nombre} en stock`
            );
          } else {
            producto.existencia = producto.existencia - cantidad;
            await producto.save();
          }
        }

        const finalDataPedido = { ...dataPedido, vendedor: ctx.userId };

        const nuevoPedido = await Pedido.create(finalDataPedido);
        return nuevoPedido;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    actualizarPedido: async (_, { pedidoId, dataPedido }, ctx) => {
      try {
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) throw new Error("Este pedido no existe");

        const cliente = await Cliente.findById(dataPedido.cliente);
        if (!cliente) throw new Error("Este cliente no existe");

        if (cliente.vendedor.toString() !== ctx.userId)
          throw new Error("Solo puedes modificar los pedidos a tus clientes");

        //*Resivar si hay productos en stock
        //*for await viene de node.js es asyncrono

        if (dataPedido.estado === "CANCELADO") {
          for await (const articulo of dataPedido.pedido) {
            const { id, cantidad } = articulo;

            const producto = await Producto.findById(id);
            if (!producto) throw new Error("Este producto no existe");

            if (cantidad > producto.existencia) {
              throw new Error(
                `No hay suficiente cantidad del producto ${producto.nombre} en stock`
              );
            }

            const oldItem = pedido.pedido.filter((oldI) => oldI.id === id);

            if (oldItem.length > 0) {
              if (oldItem[0].cantidad > cantidad) {
                const diferencia = oldItem[0].cantidad - cantidad;
                producto.existencia = producto.existencia + diferencia;
                await producto.save();
              } else {
                const diferencia = cantidad - oldItem[0].cantidad;
                producto.existencia = producto.existencia - diferencia;
                await producto.save();
              }
            } else {
              producto.existencia = producto.existencia - cantidad;
              await producto.save();
            }
          }
        }

        const noCantidadCero = dataPedido.pedido.filter(
          (item) => item.cantidad !== 0
        );

        dataPedido.pedido = noCantidadCero;

        const pedidoUpdate = Pedido.findByIdAndUpdate(
          {
            _id: pedidoId,
          },
          dataPedido,
          { new: true }
        );

        pubsub.publish("PEDIDO_ACTUALIZADO", {
          pedidoActualizado: pedidoUpdate,
        });

        return pedidoUpdate;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    eliminarPedido: async (_, { pedidoId }, ctx) => {
      try {
        const pedido = await Pedido.findById(pedidoId);
        if (!pedido) throw new Error("Este pedido no existe");

        if (pedido.vendedor.toString() !== ctx.userId)
          throw new Error("Solo puedes eliminar los pedidos a tus clientes");

        for await (const articulo of pedido.pedido) {
          const { id, cantidad } = articulo;
          const producto = await Producto.findById(id);
          if (!producto) throw new Error("Este producto no existe");

          producto.existencia = producto.existencia + cantidad;
          await producto.save();
        }

        await Pedido.findByIdAndDelete(pedidoId);
        const response = {
          mensaje: "Pedido Eliminado",
          id: pedidoId,
        };
        return response;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  //*va el nombre de la mutacion despues ponemos "subscribe" despues este metodo es obligatorio () => pubsub.asyncIterator()
  //*En el metodo  pubsub.asyncIterator("ACTUALIZAR_PEDIDO_ESTADO") se le pone un nombre cualquiera
  //! Le podemos pasa solo un string o un array de string ['PEDIDO_ACTUALIZADO','OTRA_COSA']
  Subscription: {
    pedidoActualizado: {
      subscribe: () => pubsub.asyncIterator("PEDIDO_ACTUALIZADO"),
    },
  },
};
