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
import { MEJORES_CLIENTES } from "@/gql/querys/clientes";

const Topclientes = () => {
  const { data, loading, error } = useQuery(MEJORES_CLIENTES);

  let clienteGrafica = [];
  useEffect(() => {
    if (data !== undefined) {
      data.mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
          ...cliente.cliente[0],
          total: cliente.totalComprado,
        };
      });
    }
  }, [loading]);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Top Clientes</h1>
      {loading ? (
        <Spinner />
      ) : (
        <ResponsiveContainer className="max-h-[70%] max-w-[90%] mx-auto my-10">
          <BarChart
            width={500}
            height={300}
            data={clienteGrafica}
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

export default Topclientes;
