import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import Alert from "@/components/Alert";
import { useMutation } from "@apollo/client";
import { AUTENTICAR_USUARIO } from "../gql/mutations/users";
import { useAlert } from "@/hooks/useAlert";
import Input from "@/components/Input";

const Login = () => {
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
  const { showAlert, show, type, message } = useAlert();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("El email es obligatorio")
        .email("El email no es valido"),
      password: Yup.string().required("El password es obligatorio"),
    }),
    onSubmit: async (valores) => {
      const { email, password } = valores;

      try {
        const { data } = await autenticarUsuario({
          variables: {
            dataUser: {
              email,
              password,
            },
          },
        });

        const { token } = data.autenticarUsuario;
        localStorage.setItem("token", token);
        showAlert("Bienvenido", "success");
        router.push("/");
      } catch (error) {
        showAlert(error.message, "error");
      }
    },
  });

  return (
    <Layout>
      <h1 className="text-center text-2xl text-white font-light">Login</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          {show && <Alert msg={message} type={type} />}
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
              value="Iniciar Sesión"
              className="bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase hover:bg-gray-900 cursor-pointer"
            />
          </form>
          <Link href="/nuevacuenta" className="text-white underline">
            Crear Cuenta
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
