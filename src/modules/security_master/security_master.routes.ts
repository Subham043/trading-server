import { FastifyInstance } from "fastify";
import {
  createSecurityMaster,
  exportSecurityMaster,
  getSecurityMaster,
  importSecurityMasters,
  listSecurityMaster,
  removeMultipleSecurityMaster,
  removeSecurityMaster,
  updateSecurityMaster,
} from "./security_master.controller";
import { updateSecurityMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createSecurityMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function securityMasterRoutes(app: FastifyInstance) {
  app.post(
    "/import",
    {
      schema: {
        body: postExcelBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    importSecurityMasters
  );
  app.get(
    "/",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listSecurityMaster
  );
  app.get(
    "/export",
    {
      schema: {
        querystring: getSearchQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    exportSecurityMaster
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getSecurityMaster
  );
  app.post(
    "/",
    {
      schema: {
        body: createSecurityMasterBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    createSecurityMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateSecurityMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateSecurityMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeSecurityMaster
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleSecurityMaster
  );
}
