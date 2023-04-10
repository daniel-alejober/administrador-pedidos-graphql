import { typeDefsProducto, resolversProducto } from "./producto.js";
import { typeDefsUsuario, resolversUsuario } from "./usuario.js";
import { typeDefsCliente, resolversCliente } from "./cliente.js";
import { typeDefsPedido, resolversPedido } from "./pedido.js";
import { gql } from "apollo-server";

//*Sirve para poder usar tipos de un archivo a otro, en los querys agregar extend type Query {}
const rootTypeDefs = gql`
  type Query {
    _: String
  }
`;

export const resolvers = [
  resolversProducto,
  resolversUsuario,
  resolversCliente,
  resolversPedido,
];
export const typeDefs = [
  rootTypeDefs,
  typeDefsProducto,
  typeDefsUsuario,
  typeDefsCliente,
  typeDefsPedido,
];
