import { useContext } from "react";
import PedidoContext from "@/context/pedidos/PedidoState";

const usePedido = () => {
  return useContext(PedidoContext);
};
export default usePedido;
