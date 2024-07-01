import { FastifyInstance } from "fastify";
import {
  createShareCertificateMaster,
  exportShareCertificateMaster,
  getShareCertificateMaster,
  importShareCertificateMasters,
  listShareCertificateMaster,
  removeMultipleShareCertificateMaster,
  removeShareCertificateMaster,
  updateShareCertificateMaster,
} from "./share_certificate_master.controller";
import { updateShareCertificateMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createShareCertificateMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function shareCertificateMasterRoutes(app: FastifyInstance) {
  app.post(
    "/import",
    {
      schema: {
        body: postExcelBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    importShareCertificateMasters
  );
  app.get(
    "/",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listShareCertificateMaster
  );
  app.get(
    "/export",
    {
      schema: {
        querystring: getSearchQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    exportShareCertificateMaster
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getShareCertificateMaster
  );
  app.post(
    "/",
    {
      schema: {
        body: createShareCertificateMasterBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    createShareCertificateMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateShareCertificateMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateShareCertificateMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeShareCertificateMaster
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleShareCertificateMaster
  );
}
