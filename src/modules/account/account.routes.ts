import { FastifyInstance } from "fastify";
import { getProfile, updateProfile } from "./account.controller";
import { updateProfileJsonSchema } from "./schemas/profile.schema";

export async function accountRoutes(app: FastifyInstance) {
  app.get("/profile", { preHandler: app.verifyJwt }, getProfile);
  app.put(
    "/profile",
    { schema: updateProfileJsonSchema, preHandler: app.verifyJwt },
    updateProfile
  );
}
