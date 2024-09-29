import { FastifyInstance } from "fastify";
import { getUuidParamSchema } from "../../common/schemas/uuid_param.schema";
import {
  downloadFailedExcelByFileName,
  downloadFailedExcelById,
  listFailedExcels,
  sendImageStream,
} from "./upload.controller";
import { getIdParamSchema } from "../../common/schemas/id_param.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";

export async function uploadRoutes(app: FastifyInstance) {
  app.get(
    "/failed-excel/download-via-name/:id",
    {
      schema: {
        params: getUuidParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    downloadFailedExcelByFileName
  );
  app.get(
    "/failed-excel/download-via-id/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    downloadFailedExcelById
  );
  app.get(
    "/failed-excel/list",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listFailedExcels
  );
  app.get(
    "/images/:id",
    {
      schema: {
        params: getUuidParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    sendImageStream
  );
}
