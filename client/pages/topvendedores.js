import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { MEJORES_VENDEDORES } from "@/gql/querys/users";

const Topvendedores = () => {
  //*startPolling traera los datos cada vez que haya un cambio en la base de datos
  //*stopPolling detiene para que no se ejecute todo el rato

  const { data, loading, error } = useQuery(MEJORES_VENDEDORES);

  console.log(data, loading);

  let vendedorGrafica = [];
  useEffect(() => {
    if (data !== undefined) {
      data.mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
          ...vendedor.vendedor[0],
          total: vendedor.totalVendido,
        };
      });
      console.log(vendedorGrafica);
    }
  }, [loading]);

  //*consultara la db en 1 segundo
  // useEffect(() => {
  //   startPolling(1000);
  //   return () => {
  //     stopPolling();
  //   };
  // }, [startPolling, stopPolling]);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Top Vendedores</h1>
      {loading ? (
        <Spinner />
      ) : (
        <ResponsiveContainer className="max-h-[70%] max-w-[90%] mx-auto my-10">
          <BarChart
            width={500}
            height={300}
            data={vendedorGrafica}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Layout>
  );
};

export default Topvendedores;
