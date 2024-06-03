import { FastifyInstance } from "fastify";
import {
  createSecurityTypeMaster,
  exportSecurityTypeMaster,
  getSecurityTypeMaster,
  importSecurityTypeMasters,
  listSecurityTypeMaster,
  removeMultipleSecurityTypeMaster,
  removeSecurityTypeMaster,
  updateSecurityTypeMaster,
} from "./security_type_master.controller";
import { updateSecurityTypeMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createSecurityTypeMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function securityTypeMasterRoutes(app: FastifyInstance) {
  app.post(
    "/import",
    {
      schema: {
        body: postExcelBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    importSecurityTypeMasters
  );
  app.get(
    "/",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listSecurityTypeMaster
  );
  app.get(
    "/export",
    {
      schema: {
        querystring: getSearchQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    exportSecurityTypeMaster
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getSecurityTypeMaster
  );
  app.post(
    "/",
    {
      schema: {
        body: createSecurityTypeMasterBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    createSecurityTypeMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateSecurityTypeMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateSecurityTypeMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeSecurityTypeMaster
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleSecurityTypeMaster
  );
}
