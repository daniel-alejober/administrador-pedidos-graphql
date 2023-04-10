import {
  SELECCIONAR_CLIENTE,
  SELECCIONAR_PRODUCTO,
  CANTIDAD_PRODUCTOS,
  VERIFICAR_CLIENTES,
  ACTUALIZAR_TOTAL,
} from "@/types";

//*el state es el state inicial que le pasamos a
//* const [state, dispatch] = useReducer(PedidoReducer, initialState);
//* en el action vienen todo lo que le pasamos al dispatch
export default (state, action) => {
  switch (action.type) {
    case VERIFICAR_CLIENTES:
      return {
        ...state,
        clientes: action.payload.clientes,
      };

    case SELECCIONAR_CLIENTE:
      return {
        ...state,
        cliente: action.payload,
      };

    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        productos: action.payload,
      };

    case CANTIDAD_PRODUCTOS: {
      return {
        ...state,
        productos: state.productos.map((producto) =>
          producto.id === action.payload.id ? action.payload : producto
        ),
      };
    }

    case ACTUALIZAR_TOTAL: {
      return {
        ...state,
        totalPagar: state.productos.reduce(
          (nuevoTotal, producto) =>
            (nuevoTotal += producto.cantidad * producto.precio),
          0
        ),
      };
    }

    default:
      return state;
  }
};
