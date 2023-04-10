import { useState, useEffect } from "react";
import usePedido from "@/hooks/usePedido";
import Select from "react-select";

const AsignarCliente = () => {
  const [cliente, setCliente] = useState({});
  const { clienteSeleccionado, clientes } = usePedido();

  useEffect(() => {
    clienteSeleccionado(cliente);
  }, [cliente]);

  return (
    <>
      <h1 className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        1.- Asigna un cliente al pedido
      </h1>
      <Select
        options={clientes}
        onChange={(opcion) => setCliente(opcion)}
        placeholder="Selecciona un cliente"
        noOptionsMessage={() => "No tienes clientes por el momento"}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) => options.nombre}
      />
    </>
  );
};

export default AsignarCliente;
