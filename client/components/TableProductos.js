import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ELIMINAR_PRODUCTO } from "@/gql/mutations/productos";
import { OBTENER_PRODUCTOS } from "@/gql/querys/productos";
import Router from "next/router";

const TableProductos = ({ data }) => {
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache, { data: { eliminarProducto } }) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      const actualizados = obtenerProductos.filter(
        (producto) => producto.id !== eliminarProducto.id
      );

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: actualizados,
        },
      });
    },
  });

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Deseas eliminar a este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarProducto({
            variables: {
              productoId: id,
            },
          });

          Swal.fire("Eliminado!", data.eliminarProducto.mensaje, "success");
        } catch (error) {
          console.log(error);
          Swal.fire("Oh no! Ocurrio un error", error.message, "error");
        }
      }
    });
  };

  const editarProducto = (id) => {
    Router.push({
      pathname: "/editarproducto/[id]", //*aqui siempre se va a llamar id, en el archivo que crear [userId].js tomara el nombre de userId
      query: { id },
    });
  };

  return (
    <table className="table-auto shadow-md mt-10 w-full w-lg">
      <thead className="bg-gray-800">
        <tr className="text-white">
          <th className="w-1/5 py-2">Nombre</th>
          <th className="w-1/5 py-2">Precio</th>
          <th className="w-1/5 py-2">Existencia</th>
          <th className="w-1/5 py-2">Eliminar</th>
          <th className="w-1/5 py-2">Editar</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {data.map((producto) => (
          <tr key={producto.id}>
            <td className="border px-4 py-2">{producto.nombre}</td>
            <td className="border px-4 py-2">$ {producto.precio} </td>
            <td className="border px-4 py-2">{producto.existencia} </td>
            <td className="border px-4 py-2">
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-full flex justify-center items-center gap-x-2"
                onClick={() => confirmarEliminacion(producto.id)}
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
                onClick={() => editarProducto(producto.id)}
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

export default TableProductos;
