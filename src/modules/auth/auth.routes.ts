import { FastifyInstance } from "fastify";
import { loginBodySchema } from "./schemas/login.schema";
import { login } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", { schema: { body: loginBodySchema } }, login);
}
