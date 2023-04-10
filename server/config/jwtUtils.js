import jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server";

const generarToken = (data) => {
  return jwt.sign({ data }, process.env.PALBRA_SECRETA_JWT, {
    expiresIn: "1d",
  });
};

const verificarToken = (token) => {
  try {
    if (token) {
      const dataToken = jwt.verify(
        token.replace("Bearer", "").trim(),
        process.env.PALBRA_SECRETA_JWT
      );

      // const dataToken = jwt.verify(
      //   token.substring(7),  Bearer = 6 el espacio vacio 7 => Bearer ey15ssje7edbd
      //   process.env.PALBRA_SECRETA_JWT
      // );

      const userId = dataToken.data;
      return userId;
    }
    return null; //*retorna null si no se le proporciona un token
  } catch (error) {
    if (error.name === "TokenExpiredError")
      throw new Error("Este token ha expirado");
    else throw new Error("Token no valido");
  }
};

export { generarToken, verificarToken };
