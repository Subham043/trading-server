import { FastifyInstance } from "fastify";
import { getStats } from "./dashboard.controller";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    "/stats",
    {
      preHandler: app.verifyJwt,
    },
    getStats
  );
}
