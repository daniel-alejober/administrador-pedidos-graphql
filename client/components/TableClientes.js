import React from "react";
import Swal from "sweetalert2";
import { useMutation } from "@apollo/client";
import { ELIMINAR_CLIENTE } from "@/gql/mutations/clientes";
import { OBTENER_CLIENTES_VENDEDOR } from "@/gql/querys/clientes";
import Router from "next/router"; //*Nos permite pasar parametros en la url

const TableClientes = ({ data }) => {
  //*como estamos eliminando no se agrega nada al cache por eso no le pasamos nada como segundo parametro
  //*Reescribimos los datos del cache, le pasamos el query que es de donde sacaremos el usuario, y con un filter sacamos a ese usuario
  //*La data regresa el id que acabamos de eliminar para poder eliminarlo aqui
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
    update(cache, { data: { eliminarCliente } }) {
      //*obtener una copia de cache
      const { obtenerClientesVendedor } = cache.readQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
      });

      const actualizados = obtenerClientesVendedor.filter(
        (cliente) => cliente.id !== eliminarCliente.id
      );
      //*Esta linea si pone para evitar unos warnings
      cache.evict({ fieldName: "obtenerClientesVendedor", broadcast: false });
      cache.writeQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
        data: {
          obtenerClientesVendedor: actualizados,
        },
      });
    },
  });

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Deseas eliminar a este cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarCliente({
            variables: {
              clienteId: id,
            },
          });

          Swal.fire("Eliminado!", data.eliminarCliente.mensaje, "success");
        } catch (error) {
          console.log(error);
          Swal.fire("Oh no! Ocurrio un error", error.message, "error");
        }
      }
    });
  };

  const editarCliente = (id) => {
    Router.push({
      pathname: "/editarcliente/[id]", //*aqui siempre se va a llamar id, en el archivo que crear [userId].js tomara el nombre de userId
      query: { id },
    });
  };

  return (
    <table className="table-auto shadow-md mt-10 w-full w-lg">
      <thead className="bg-gray-800">
        <tr className="text-white">
          <th className="w-1/5 py-2">Nombre</th>
          <th className="w-1/5 py-2">Empresa</th>
          <th className="w-1/5 py-2">Email</th>
          <th className="w-1/5 py-2">Eliminar</th>
          <th className="w-1/5 py-2">Editar</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.map((cliente) => (
          <tr key={cliente.id}>
            <td className="border px-4 py-2">
              {cliente.nombre} {cliente.apellido}
            </td>
            <td className="border px-4 py-2">{cliente.empresa} </td>
            <td className="border px-4 py-2">{cliente.email} </td>
            <td className="border px-4 py-2">
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-full flex justify-center items-center gap-x-2"
                onClick={() => confirmarEliminacion(cliente.id)}
              >
                Eliminar{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </td>
            <td className="border px-4 py-2">
              <button
                type="button"
                className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-900 w-full flex justify-center items-center gap-x-2"
                onClick={() => editarCliente(cliente.id)}
              >
                Editar{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableClientes;
