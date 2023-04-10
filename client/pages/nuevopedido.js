import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { OBTENER_CLIENTES_VENDEDOR } from "@/gql/querys/clientes";
import { OBTENER_PEDIDOS } from "@/gql/querys/pedidos";
import { AGREGAR_PEDIDO } from "@/gql/mutations/pedido";
import usePedido from "@/hooks/usePedido";
import { useAlert } from "@/hooks/useAlert";
import Layout from "@/components/Layout";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import AsignarCliente from "@/components/pedidos/AsignarCliente";
import AsignarProductos from "@/components/pedidos/AsignarProductos";
import ResumenPedido from "@/components/pedidos/ResumenPedido";
import Total from "@/components/pedidos/Total";

const Nuevopedido = () => {
  const { checkClientes, cliente, totalPagar, productos } = usePedido();
  const { showAlert, show, type, message } = useAlert();
  const router = useRouter();
  const { data, loading } = useQuery(OBTENER_CLIENTES_VENDEDOR);
  const [nuevoPedido] = useMutation(AGREGAR_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      const queryResult = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      const pedidos = queryResult?.obtenerPedidosVendedor || [];

      cache.writeQuery({
        query: OBTENER_PEDIDOS, //*nombre de la consulta (query)
        data: {
          obtenerPedidosVendedor: [...pedidos, nuevoPedido],
        },
      });
    },
  });

  useEffect(() => {
    if (data !== undefined) checkClientes(data.obtenerClientesVendedor);
  }, [loading]);

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      totalPagar === 0 ||
      Object.keys(cliente).length === 0
      ? " opacity-50 cursor-not-allowed "
      : "";
  };

  const agregarNuevoPedido = async () => {
    const { id } = cliente;

    //*solo dejar valores a producto, hacermos una destructuracion,quitamos existencia, __typename
    const pedido = productos.map(
      ({ existencia, __typename, ...producto }) => producto
    );

    try {
      await nuevoPedido({
        variables: {
          dataPedido: {
            cliente: id,
            total: totalPagar,
            pedido,
          },
        },
      });
      showAlert("Pedido Registrado Correctamente", "success");
      router.push("/pedidos");
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Nuevo Pedido</h1>
      <div className="flex justify-center mt-5">
        {loading ? (
          <Spinner />
        ) : data.obtenerClientesVendedor.length === 0 ? (
          <Alert msg="No tienes clientes por el momento" type="info" />
        ) : (
          <div className="w-full max-w-lg">
            {show && <Alert msg={message} type={type} />}
            <AsignarCliente />
            <AsignarProductos />
            <ResumenPedido />
            <Total />
            <button
              type="button"
              className={`bg-gray-800 w-full mt-5 p-2 text-white font-bold hover:bg-gray-900 ${validarPedido()}`}
              onClick={agregarNuevoPedido}
            >
              Registrar Pedido
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Nuevopedido;
