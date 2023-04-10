import Link from "next/link";
import { useQuery } from "@apollo/client";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";
import TableProductos from "@/components/TableProductos";
import { OBTENER_PRODUCTOS } from "@/gql/querys/productos";

const Productos = () => {
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Productos</h1>
      <Link
        href="/nuevoproducto"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block mt-2"
      >
        Nuevo Producto
      </Link>
      {loading ? (
        <Spinner />
      ) : error !== undefined ? (
        <Alert msg={error.message} type="error" />
      ) : data.obtenerProductos.length === 0 ? (
        <Alert msg="No hay productos en este momento" type="info" />
      ) : (
        <div className="overflow-x-scroll">
          <TableProductos data={data.obtenerProductos} />
        </div>
      )}
    </Layout>
  );
};

export default Productos;
