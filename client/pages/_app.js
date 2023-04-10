import { ApolloProvider } from "@apollo/client";
import { client } from "../config/apollo";
import { PedidoProvider } from "@/context/pedidos/PedidoState";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <PedidoProvider>
        <Component {...pageProps} />
      </PedidoProvider>
    </ApolloProvider>
  );
}

//*Configuracion react main.jsx se envuelve la app en un provider que da apollo client

// import { ApolloProvider } from "@apollo/client";
// import {client} from '../config/apollo'
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ApolloProvider client={client}>
//           <App />
//     </ApolloProvider>
//   </React.StrictMode>,
// )
