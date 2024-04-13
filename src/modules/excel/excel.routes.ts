import { FastifyInstance } from "fastify";
import { getUuidParamSchema } from "../../common/schemas/uuid_param.schema";
import { downloadFailedExcel } from "./excel.controller";

export async function excelRoutes(app: FastifyInstance) {
  app.get(
    "/failed/:id",
    {
      schema: {
        params: getUuidParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    downloadFailedExcel
  );
}
