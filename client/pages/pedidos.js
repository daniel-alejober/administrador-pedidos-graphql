import Link from "next/link";
import { useQuery } from "@apollo/client";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";
import TablePedidos from "@/components/TablePedidos";
import { OBTENER_PEDIDOS } from "@/gql/querys/pedidos";

const Pedidos = () => {
  const { loading, data, error } = useQuery(OBTENER_PEDIDOS);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Pedidos</h1>
      <Link
        href="/nuevopedido"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block mt-2"
      >
        Nuevo Pedido
      </Link>
      {loading ? (
        <Spinner />
      ) : error !== undefined ? (
        <Alert msg={error.message} type="error" />
      ) : data.obtenerPedidosVendedor.length === 0 ? (
        <Alert msg="No hay pedidos en este momento" type="info" />
      ) : (
        data.obtenerPedidosVendedor.map((pedido) => (
          <TablePedidos key={pedido.id} data={pedido} />
        ))
      )}
    </Layout>
  );
};

export default Pedidos;
