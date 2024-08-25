import { FastifyInstance } from "fastify";
import {
  createDividendMaster,
  exportDividendMasters,
  getDividendMaster,
  importDividendMasters,
  listAllDividendMasters,
  listDividendMasters,
  removeMultipleDividendMasters,
  removeDividendMaster,
  updateDividendMaster,
} from "./dividend_master.controller";
import { updateDividendMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getCompanyIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createDividendMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function dividendMasterRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllDividendMasters
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
    listDividendMasters
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
    exportDividendMasters
  );
  app.post(
    "/create/:companyId",
    {
      schema: {
        body: createDividendMasterBodySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createDividendMaster
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importDividendMasters
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleDividendMasters
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getDividendMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateDividendMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateDividendMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeDividendMaster
  );
}
