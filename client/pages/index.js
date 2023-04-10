import Layout from "@/components/Layout";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTES_VENDEDOR } from "@/gql/querys/clientes";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import Alert from "@/components/Alert";
import TableClientes from "@/components/TableClientes";

export default function Home() {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_VENDEDOR);

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-bold">Clientes</h1>
        <Link
          href="/nuevocliente"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block mt-2"
        >
          Nuevo Cliente
        </Link>

        {error ? (
          <Alert msg="Error en el servidor" type="error" />
        ) : (
          <>
            {loading ? (
              <Spinner />
            ) : data.obtenerClientesVendedor.length === 0 ? (
              <Alert msg="No tienes clientes en este momento" type="info" />
            ) : (
              <div className="overflow-x-scroll">
                <TableClientes data={data.obtenerClientesVendedor} />
              </div>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
