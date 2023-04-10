import React from "react";
import usePedido from "@/hooks/usePedido";

const Total = () => {
  const { totalPagar } = usePedido();
  return (
    <div className="flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-300">
      <h2 className="text-gray-800 text-lg">Total a pagar</h2>
      <p className="text-gray-800 mt-0 font-bold">$ {totalPagar}</p>
    </div>
  );
};

export default Total;
