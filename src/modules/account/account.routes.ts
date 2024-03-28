import { FastifyInstance } from "fastify";
import { getProfile, updateProfile } from "./account.controller";
import { updateProfileBodySchema } from "./schemas/profile.schema";

export async function accountRoutes(app: FastifyInstance) {
  app.get("/profile", { preHandler: app.verifyJwt }, getProfile);
  app.put(
    "/profile",
    { schema: { body: updateProfileBodySchema }, preHandler: app.verifyJwt },
    updateProfile
  );
}
