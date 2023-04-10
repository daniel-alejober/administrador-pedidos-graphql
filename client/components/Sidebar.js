import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className="bg-gray-800 w-1/3 md:w-1/5 p-5 ">
      <div>
        <p className="text-white text-2xl">Admin Pedidos</p>
      </div>
      <nav className="mt-5 list-none">
        <li>
          <Link
            href="/"
            className={` mb-2 block text-lg font-bold ${
              router.pathname === "/" ? "text-blue-400" : "text-white"
            }`}
          >
            Clientes
          </Link>
        </li>
        <li>
          <Link
            href="/pedidos"
            className={` mb-2 block text-lg font-bold ${
              router.pathname === "/pedidos" ? "text-blue-400" : "text-white"
            }`}
          >
            Pedidos
          </Link>
        </li>
        <li>
          <Link
            href="/productos"
            className={` mb-2 block text-lg font-bold ${
              router.pathname === "/productos" ? "text-blue-400" : "text-white"
            }`}
          >
            Productos
          </Link>
        </li>
      </nav>

      <div className="sm:mt-10">
        <p className="text-white text-2xl">Otras Opciones</p>
      </div>

      <nav className="mt-5 list-none">
        <li>
          <Link
            href="/topvendedores"
            className={` mb-2 block text-lg font-bold ${
              router.pathname === "/topvendedores"
                ? "text-blue-400"
                : "text-white"
            }`}
          >
            Top Vendedores
          </Link>
        </li>
        <li>
          <Link
            href="/topclientes"
            className={` mb-2 block text-lg font-bold ${
              router.pathname === "/topclientes"
                ? "text-blue-400"
                : "text-white"
            }`}
          >
            Top Clientes
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
