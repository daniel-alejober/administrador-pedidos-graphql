import React, { useEffect, useState } from "react";
import { OBTENER_USUARIO } from "@/gql/querys/users";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  const [nombreUser, setNombreUser] = useState("");
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const { data, loading } = useQuery(OBTENER_USUARIO, {
    onError: cerrarSesion,
  });
  useEffect(() => {
    if (data !== undefined && data.obtenerUsuario !== null) {
      setNombreUser(data.obtenerUsuario);
    }
  }, [loading]);

  return (
    <div className="flex justify-between items-center ">
      <p className="mr-2 text-lg">
        Hola{" "}
        {loading ? null : nombreUser ? (
          <span className=" font-bold">
            {nombreUser.nombre} {nombreUser.apellido}
          </span>
        ) : null}
      </p>
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={cerrarSesion}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
