import React from "react";
import usePedido from "@/hooks/usePedido";
import ProductoResumen from "./ProductoResumen";

const ResumenPedido = () => {
  const { productos } = usePedido();

  return (
    <>
      <h1 className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Ajusta las cantidades del producto
      </h1>
      {productos.length > 0 ? (
        <>
          {productos.map((producto) => (
            <ProductoResumen key={producto.id} producto={producto} />
          ))}
        </>
      ) : (
        <p className="mt-5 text-sm font-bold">No hay productos seleccionados</p>
      )}
    </>
  );
};

export default ResumenPedido;
