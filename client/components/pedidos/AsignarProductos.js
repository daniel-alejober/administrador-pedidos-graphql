import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Select from "react-select";
import usePedido from "@/hooks/usePedido";
import { OBTENER_PRODUCTOS } from "@/gql/querys/productos";
import Spinner from "../Spinner";

const AsignarProductos = () => {
  const [seleccionarProducs, setSeleccionarProducs] = useState([]);
  const { productosSeleccionados } = usePedido();

  const { data, loading } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    productosSeleccionados(seleccionarProducs);
  }, [seleccionarProducs]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <h1 className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        2.- Selecciona un producto o productos al pedido
      </h1>
      <Select
        className="flex-1"
        options={data.obtenerProductos}
        isMulti
        onChange={(opcion) => setSeleccionarProducs(opcion)}
        placeholder="Selecciona un producto"
        noOptionsMessage={() => "No tienes clientes por el momento"}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) =>
          `${options.nombre} - ${options.existencia} Disponibles.`
        }
      />
    </>
  );
};

export default AsignarProductos;
