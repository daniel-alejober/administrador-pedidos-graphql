import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

//*aqui estamos modificando los headers para agregar nuestro propio header donde ira el token
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// const wsLink = new WebSocketLink(

// )

export const client = new ApolloClient({
  connectToDevTools: true, //*conectar a la extencion de googlecrhome opcional
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),

  // link: new HttpLink({ uri: "http://localhost:4000/" }) se usa cuando no se necesita autenticacion,
});
