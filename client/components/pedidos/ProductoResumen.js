import React, { useState, useEffect } from "react";
import usePedido from "@/hooks/usePedido";

const ProductoResumen = ({ producto }) => {
  const { cantidadProductos, actualizarTotal } = usePedido();
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{producto.nombre}</p>
        <p className="font-bold">$ {producto.precio}</p>
      </div>
      <input
        className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        type="number"
        min={1}
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
      />
    </div>
  );
};

export default ProductoResumen;
