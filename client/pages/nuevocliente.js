import React from "react";
import Layout from "@/components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useAlert } from "@/hooks/useAlert";
import Input from "@/components/Input";
import Alert from "@/components/Alert";
import { CREAR_NUEVO_CLIENTE } from "@/gql/mutations/clientes";
import { OBTENER_CLIENTES_VENDEDOR } from "@/gql/querys/clientes";

const Nuevocliente = () => {
  const { showAlert, show, type, message } = useAlert();
  const router = useRouter();
  //*Vamos a actualizar el cache para que se refresque el cache y asi aparezca el nuevo usuario,
  //*Pasamos un objeto donde le decimo que actulizaremos el cache, con lo que traiga la funcion "nuevoCliente"
  const [nuevoCliente] = useMutation(CREAR_NUEVO_CLIENTE, {
    update(cache, { data: { nuevoCliente } }) {
      //*pero hay varios objetos en el cache abrir la extension apollo para ver los nombre, que se llaman igual que los querys(metodos get) que tengamos pero NO es la funcion son los datos que ha traido esa funcion,

      const queryResult = cache.readQuery({
        query: OBTENER_CLIENTES_VENDEDOR,
      });

      //*Esto nos ayuda a validar si existe en cache obtenerClientesVendedor por si se refresca la pagina
      const clientes = queryResult?.obtenerClientesVendedor || [];

      //*Reescribimos los datos del cache con nombre obtenerClientesVendedor
      cache.writeQuery({
        query: OBTENER_CLIENTES_VENDEDOR, //*nombre de la consulta (query)
        data: {
          obtenerClientesVendedor: [...clientes, nuevoCliente],
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      empresa: "",
      telefono: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("El apellido es obligatorio"),
      email: Yup.string()
        .required("El email es obligatorio")
        .email("El email no es valido"),
      empresa: Yup.string().required("La empresa es obligatoria"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, empresa, telefono } = valores;
      try {
        const { data } = await nuevoCliente({
          variables: {
            dataClient: { nombre, apellido, email, empresa, telefono },
          },
        });

        showAlert(
          `El cliente ${data.nuevoCliente.nombre} ha sido registrado`,
          "success"
        );
        router.push("/");
      } catch (error) {
        showAlert(error.message, "error");
      }
    },
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold">Nuevo Cliente</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          {show && <Alert msg={message} type={type} />}
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <Input
              label="Nombre"
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Nombre del cliente"
              formik={formik}
            />

            <Input
              label="Apellido"
              id="apellido"
              type="text"
              name="apellido"
              placeholder="Apellido del cliente"
              formik={formik}
            />

            <Input
              label="Email"
              id="email"
              type="email"
              name="email"
              placeholder="Email del cliente"
              formik={formik}
            />
            <Input
              label="Empresa"
              id="empresa"
              type="text"
              name="empresa"
              placeholder="Empresa del cliente"
              formik={formik}
            />

            <Input
              label="Telefono"
              id="telefono"
              type="tel"
              name="telefono"
              placeholder="Telefono del cliente"
              formik={formik}
            />

            <input
              type="submit"
              value="Crear Cliente"
              className="bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase hover:bg-gray-900 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Nuevocliente;
