import { ApolloServer } from "apollo-server";
import conectarDB from "./config/db.js";
import { typeDefs, resolvers } from "./graphql/schema.js";
import * as dotenv from "dotenv";
import { verificarToken } from "./config/jwtUtils.js";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let userId = null;
    const token = req.headers["authorization"];

    if (token) {
      userId = verificarToken(token);

      if (!userId) {
        return {
          statusCode: 401,
          errorMessage: "Token inválido o ha expirado",
        };
      }
    }

    return { userId };
  },
});

const startServer = async () => {
  try {
    await conectarDB(process.env.URL_MONGODB);

    const { url } = await server.listen();
    console.log(`Server funciona ${url}`);
  } catch (error) {
    console.log(error);
  }
};

startServer();
