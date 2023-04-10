import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ACTUALIZAR_PEDIDO_ESTADO } from "@/gql/mutations/pedido";
import { ELIMINAR_PEDIDO } from "@/gql/mutations/pedido";
import { OBTENER_PEDIDOS } from "@/gql/querys/pedidos";
import Swal from "sweetalert2";

const TablePedidos = ({ data }) => {
  const {
    cliente: { nombre, apellido, email, telefono },
    estado,
    pedido,
    total,
    id,
  } = data;

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState("");
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO_ESTADO);
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache, { data: { eliminarPedido } }) {
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      const actualizados = obtenerPedidosVendedor.filter(
        (pedido) => pedido.id !== eliminarPedido.id
      );
      //*Esta linea si pone para evitar unos warnings
      cache.evict({ fieldName: "obtenerPedidosVendedor", broadcast: false });

      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: actualizados,
        },
      });
    },
  });

  useEffect(() => {
    if (estadoPedido) setEstadoPedido(estadoPedido);
    clasePedido();
  }, [estadoPedido]);

  //Modifica color pedido por estado
  const clasePedido = () => {
    if (estadoPedido === "PENDIENTE") setClase("border-yellow-500");
    else if (estadoPedido === "COMPLETADO") setClase("border-green-500");
    else setClase("border-red-800");
  };

  const actualizarEstadoPedido = async (estado) => {
    let cleanDataP = [];
    const { __typename, ...resto } = pedido[0];

    cleanDataP.push(resto);

    try {
      const response = await actualizarPedido({
        variables: {
          pedidoId: id,
          dataPedido: {
            total,
            pedido: cleanDataP,
            estado,
            cliente: data.cliente.id,
          },
        },
      });
      const respuestaEstado = response.data.actualizarPedido.estado;
      setEstadoPedido(respuestaEstado);
    } catch (error) {
      console.log(error.message);
    }
  };

  const confirmarEliminacion = (id) => {
    Swal.fire({
      title: "¿Deseas eliminar a este pedido?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarPedido({
            variables: {
              pedidoId: id,
            },
          });

          Swal.fire("Eliminado!", data.eliminarPedido.mensaje, "success");
        } catch (error) {
          console.log(error);
          Swal.fire("Oh no! Ocurrio un error", error.message, "error");
        }
      }
    });
  };

  return (
    <div
      className={` ${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-md`}
    >
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {nombre} {apellido}
        </p>

        {email && (
          <p className="flex items-center my-2">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            {email}
          </p>
        )}

        {telefono && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            {telefono}
          </p>
        )}

        <h2 className="text-gray-800">Estado Pedido:</h2>
        <select
          className="mt-2 apperance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-sm font-bold"
          value={estadoPedido}
          onChange={(e) => actualizarEstadoPedido(e.target.value)}
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
        {pedido.map((producto) => (
          <div key={producto.id} className="mt-4">
            <p className="text-sm text-gray-600">Producto: {producto.nombre}</p>
            <p className="text-sm text-gray-600">
              Cantidad: {producto.cantidad}
            </p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">Total a pagar: ${total}</p>

        <button
          onClick={() => confirmarEliminacion(id)}
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-3 py-1.5 mt-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Eliminar Pedido
        </button>
      </div>
    </div>
  );
};

export default TablePedidos;
