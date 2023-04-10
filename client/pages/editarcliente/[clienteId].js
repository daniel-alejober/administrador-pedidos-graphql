import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAlert } from "@/hooks/useAlert";
import Alert from "@/components/Alert";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";
import { OBTENER_CLIENTE_ID } from "@/gql/querys/clientes";
import { ACTUALIZAR_CLIENTE } from "@/gql/mutations/clientes";

const EditarCliente = () => {
  const router = useRouter();
  const {
    query: { clienteId },
  } = router;
  const { showAlert, show, type, message } = useAlert();

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string()
      .required("El email es obligatorio")
      .email("El email no es valido"),
    empresa: Yup.string().required("La empresa es obligatoria"),
  });

  const { data, loading, error } = useQuery(OBTENER_CLIENTE_ID, {
    variables: { clienteId },
  });

  //*En la parte de edicion se actualiza solo el cache
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

  const actualizarInfoCliente = async (data) => {
    const { nombre, apellido, email, empresa, telefono } = data;
    try {
      await actualizarCliente({
        variables: {
          clienteId,
          dataClient: {
            nombre,
            apellido,
            email,
            empresa,
            telefono,
          },
        },
      });
      showAlert("Cliente Actualizado", "success");
      router.push("/");
    } catch (error) {
      showAlert(error.message, "error");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold"> Editar Cliente</h1>
      <div className="flex justify-center mt-5">
        {loading ? (
          <Spinner />
        ) : error !== undefined ? (
          <Alert msg={error.message} type="error" />
        ) : (
          <div className="w-full max-w-sm">
            {show && <Alert msg={message} type={type} />}
            <Formik
              validationSchema={validationSchema}
              initialValues={data.obtenerCliente}
              enableReinitialize
              onSubmit={(valores) => {
                actualizarInfoCliente(valores);
              }}
            >
              {(props) => {
                return (
                  <form
                    className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={props.handleSubmit}
                  >
                    <Input
                      label="Nombre"
                      id="nombre"
                      type="text"
                      name="nombre"
                      placeholder="Nombre del cliente"
                      formik={props}
                    />

                    <Input
                      label="Apellido"
                      id="apellido"
                      type="text"
                      name="apellido"
                      placeholder="Apellido del cliente"
                      formik={props}
                    />

                    <Input
                      label="Email"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email del cliente"
                      formik={props}
                    />
                    <Input
                      label="Empresa"
                      id="empresa"
                      type="text"
                      name="empresa"
                      placeholder="Empresa del cliente"
                      formik={props}
                    />

                    <Input
                      label="Telefono"
                      id="telefono"
                      type="tel"
                      name="telefono"
                      placeholder="Telefono del cliente"
                      formik={props}
                    />

                    <input
                      type="submit"
                      value="Actualizar Cliente"
                      className="bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase hover:bg-gray-900 cursor-pointer"
                    />
                  </form>
                );
              }}
            </Formik>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditarCliente;
