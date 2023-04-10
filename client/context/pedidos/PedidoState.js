import React, { useReducer, createContext } from "react";
import PedidoReducer from "./PedidoReducer";

import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  VERIFICAR_CLIENTES,
  ACTUALIZAR_TOTAL,
} from "@/types";

const PedidoContext = createContext();

const PedidoProvider = ({ children }) => {
  //State Global
  const initialState = {
    clientes: [],
    cliente: {},
    productos: [],
    totalPagar: 0,
  };

  //*state => initial state
  //*dispatch => funcion que ejecutara las funciones como en redux
  //*Toma dos vamoles el primero es el reducer, archivo donde se ejecutan las funciones
  const [state, dispatch] = useReducer(PedidoReducer, initialState);

  const checkClientes = (clientes) => {
    dispatch({
      type: VERIFICAR_CLIENTES,
      payload: {
        clientes,
      },
    });
  };

  const clienteSeleccionado = (cliente) => {
    dispatch({
      type: SELECCIONAR_CLIENTE,
      payload: cliente,
    });
  };

  const productosSeleccionados = (productosS) => {
    let nuevoState;
    if (state.productos.length > 0) {
      nuevoState = productosS.map((producto) => {
        //*regresa el objeto
        const nuevoObjeto = state.productos.find(
          (productoState) => productoState.id === producto.id
        );
        return { ...producto, ...nuevoObjeto };
      });
    } else {
      nuevoState = productosS;
    }

    dispatch({
      type: SELECCIONAR_PRODUCTO,
      payload: nuevoState,
    });
  };

  const cantidadProductos = (nuevoProducto) => {
    dispatch({
      type: CANTIDAD_PRODUCTOS,
      payload: nuevoProducto,
    });
  };

  const actualizarTotal = () => {
    dispatch({
      type: ACTUALIZAR_TOTAL,
    });
  };

  return (
    <PedidoContext.Provider
      value={{
        cliente: state.cliente,
        clientes: state.clientes,
        productos: state.productos,
        totalPagar: state.totalPagar,
        clienteSeleccionado,
        checkClientes,
        productosSeleccionados,
        cantidadProductos,
        actualizarTotal,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export { PedidoProvider };
export default PedidoContext;
