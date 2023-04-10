import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAlert } from "@/hooks/useAlert";
import { OBTENER_PRODUCTO } from "@/gql/querys/productos";
import { ACTUALIZAR_PRODUCTO } from "@/gql/mutations/productos";
import Layout from "@/components/Layout";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";

const EditarProducto = () => {
  const { showAlert, show, type, message } = useAlert();
  const router = useRouter();
  const {
    query: { productoId },
  } = router;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {
      productoId,
    },
  });
  //*En la parte de edicion se actualiza solo el cache
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .min(1, "El precio debe ser igual o mayor a 1")
      .positive("No puedes ingresar valores negativos"),
  });

  const actualizarInfoProducto = async (data) => {
    const { nombre, existencia, precio } = data;
    try {
      await actualizarProducto({
        variables: {
          productoId,
          dataProduct: {
            nombre,
            existencia,
            precio,
          },
        },
      });
      showAlert("Producto Actualizado", "success");
      router.push("/productos");
    } catch (error) {
      showAlert(error.message);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-bold"> Editar Producto</h1>
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
              initialValues={data.obtenerProducto}
              enableReinitialize
              onSubmit={(valores) => {
                actualizarInfoProducto(valores);
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
                      placeholder="Nombre del producto"
                      formik={props}
                    />

                    <Input
                      label="Precio"
                      id="precio"
                      type="number"
                      name="precio"
                      placeholder="Precio del Producto"
                      formik={props}
                    />

                    <Input
                      label="Existencia"
                      id="existencia"
                      type="number"
                      name="existencia"
                      placeholder="Existencia del Producto"
                      formik={props}
                    />

                    <input
                      type="submit"
                      value="Actualizar Producto"
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

export default EditarProducto;
