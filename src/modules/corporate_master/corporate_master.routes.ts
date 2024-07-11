import { FastifyInstance } from "fastify";
import {
  createCorporateMaster,
  exportCorporateMasters,
  getCorporateMaster,
  importCorporateMasters,
  listAllCorporateMasters,
  listCorporateMasters,
  removeMultipleCorporateMasters,
  removeCorporateMaster,
  updateCorporateMaster,
} from "./corporate_master.controller";
import { updateCorporateMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getCompanyIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createCorporateMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function corporateMasterRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllCorporateMasters
  );
  app.get(
    "/list/:companyId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listCorporateMasters
  );
  app.get(
    "/export/:companyId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportCorporateMasters
  );
  app.post(
    "/create/:companyId",
    {
      schema: {
        body: createCorporateMasterBodySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createCorporateMaster
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importCorporateMasters
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleCorporateMasters
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCorporateMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateCorporateMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateCorporateMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeCorporateMaster
  );
}
