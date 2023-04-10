import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAlert } from "@/hooks/useAlert"; 
import Layout from "@/components/Layout";
import Alert from "@/components/Alert";
import Input from "@/components/Input";
import { NUEVO_PRODUCTO } from "@/gql/mutations/productos";
import { OBTENER_PRODUCTOS } from "@/gql/querys/productos";

const Nuevoproducto = () => {
  const router = useRouter();
  const { showAlert, show, type, message } = useAlert();
  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    update(cache, { data: { nuevoProducto } }) {
      const queryResult = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });

      const productos = queryResult?.obtenerProductos || [];

      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: [...productos, nuevoProducto],
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      precio: 0,
      existencia: 0,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      precio: Yup.number()
        .required("El precio es obligatorio")
        .min(1, "El precio debe ser igual o mayor a 1")
        .positive("No puedes ingresar valores negativos"),
      existencia: Yup.number()
        .required("La existencia es obligatoria")
        .positive("No puedes ingresar valores negativos")
        .integer("Solo numeros enteros")
        .min(1, "La cantidad debe ser igual o mayor a 1"),
    }),
    onSubmit: async (valores) => {
      const { nombre, precio, existencia } = valores;
      try {
        const { data } = await nuevoProducto({
          variables: {
            dataProduct: { nombre, precio, existencia },
          },
        });

        showAlert(
          `El producto ${data.nuevoProducto.nombre} ha sido registrado`,
          "success"
        );
        router.push("/productos");
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
              placeholder="Nombre del producto"
              formik={formik}
            />

            <Input
              label="Precio"
              id="precio"
              type="number"
              name="precio"
              placeholder="Precio del Producto"
              formik={formik}
            />
            <Input
              label="Existencia"
              id="existencia"
              type="number"
              name="existencia"
              placeholder="Existencia del Producto"
              formik={formik}
            />

            <input
              type="submit"
              value="Crear Producto"
              className="bg-gray-800 w-full mt-5 p-2 text-white rounded uppercase hover:bg-gray-900 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Nuevoproducto;
