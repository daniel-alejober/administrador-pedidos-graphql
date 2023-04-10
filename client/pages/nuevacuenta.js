import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Alert from "@/components/Alert";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { NUEVA_CUENTA } from "../gql/mutations/users";
import Link from "next/link";
import { useAlert } from "@/hooks/useAlert";
import Input from "@/components/Input";

const Nuevacuenta = () => {
  //*Regresa la funcion que le pasamos
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
  const { showAlert, show, type, message } = useAlert();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("El apellido es obligatorio"),
      email: Yup.string()
        .required("El email es obligatorio")
        .email("El email no es valido"),
      password: Yup.string()
        .required("El password es obligatorio")
        .min(6, "El password debe ser de minimo 6 caracteres"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, email, password } = valores;
      try {
        //*solo regresa {data} cuando es exitoso
        const { data } = await nuevoUsuario({
          variables: {
            dataUser: {
              nombre,
              apellido,
              email,
              password,
            },
          },
        });

        showAlert(
          `El usuario(a) ${data.nuevoUsuario.nombre} fue creado correctamente`,
          "success"
        );

        router.push("/login");
      } catch (error) {
        showAlert(error.message, "error");
      }
    },
  });

  return (
    <Layout>
      <h1 className="text-center text-2xl text-white font-light">
        Crear Nueva Cuenta
      </h1>

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
              placeholder="Nombre Usuario"
              formik={formik}
            />

            <Input
              label="Apellido"
              id="apellido"
              type="text"
              name="apellido"
              placeholder="Apellido Usuario"
              formik={formik}
            />

            <Input
              label="Email"
              id="email"
              type="email"
              name="email"
              placeholder="Email Usuario"
              formik={formik}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              formik={formik}
            />
            <input
              type="submit"
              value="Crear Cuenta"
              className="bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase hover:bg-gray-900 cursor-pointer"
            />
          </form>
          <Link href="/login" className="text-white underline">
            Iniciar Sesion
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Nuevacuenta;
