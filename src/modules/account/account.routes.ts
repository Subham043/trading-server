import { FastifyInstance } from "fastify";
import { getProfile } from "./account.controller";

export async function accountRoutes(app: FastifyInstance) {
  app.get("/profile", { preHandler: app.verifyJwt }, getProfile);
}
