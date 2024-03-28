import { FastifyInstance } from "fastify";
import {
  getProfile,
  updatePassword,
  updateProfile,
} from "./account.controller";
import { updateProfileBodySchema } from "./schemas/profile.schema";
import { updatePasswordBodySchema } from "./schemas/password.schema";

export async function accountRoutes(app: FastifyInstance) {
  app.get("/profile", { preHandler: app.verifyJwt }, getProfile);
  app.put(
    "/profile",
    { schema: { body: updateProfileBodySchema }, preHandler: app.verifyJwt },
    updateProfile
  );
  app.put(
    "/password",
    { schema: { body: updatePasswordBodySchema }, preHandler: app.verifyJwt },
    updatePassword
  );
}
