import { FastifyInstance } from "fastify";
import { loginBodySchema } from "./schemas/login.schema";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
} from "./auth.controller";
import { forgotPasswordBodySchema } from "./schemas/forgot_password.schema";
import { resetPasswordBodySchema } from "./schemas/reset_password.schema";
import { getKeyParamSchema } from "./schemas/key_param.schema";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", { schema: { body: loginBodySchema } }, login);
  app.post(
    "/forgot-password",
    { schema: { body: forgotPasswordBodySchema } },
    forgotPassword
  );
  app.post(
    "/reset-password/:key",
    { schema: { body: resetPasswordBodySchema, params: getKeyParamSchema } },
    resetPassword
  );
  app.get("/logout", { preHandler: app.verifyJwt }, logout);
}
