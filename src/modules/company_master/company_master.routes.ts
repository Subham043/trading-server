import { FastifyInstance } from "fastify";
import {
  createCompanyMaster,
  exportCompanyMasters,
  getCompanyMaster,
  importCompanyMasters,
  listCompanyMasters,
  removeCompanyMaster,
  removeMultipleCompanyMaster,
  updateCompanyMaster,
} from "./company_master.controller";
import { updateCompanyMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createCompanyMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function companyMasterRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listCompanyMasters
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportCompanyMasters
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importCompanyMasters
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleCompanyMaster
  );
  app.post(
    "/",
    {
      schema: { body: createCompanyMasterBodySchema },
      preHandler: app.verifyJwt,
    },
    createCompanyMaster
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCompanyMaster
  );
  app.put(
    "/:id",
    {
      schema: { body: updateCompanyMasterBodySchema, params: getIdParamSchema },
      preHandler: app.verifyJwt,
    },
    updateCompanyMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeCompanyMaster
  );
}
