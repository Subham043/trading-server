import { FastifyInstance } from "fastify";
import {
  createNameChangeMaster,
  exportNameChangeMaster,
  exportNameChangeMasterWithCompany,
  getNameChangeMaster,
  getNameChangeMasterLatestByCompanyId,
  importNameChangeMasters,
  listNameChangeMaster,
  listNameChangeMasterWithCompany,
  removeNameChangeMaster,
  updateNameChangeMaster,
} from "./name_change_master.controller";
import { updateNameChangeMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getCompanyIdAndIdParamSchema,
  getCompanyIdParamSchema,
  getIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createNameChangeMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function nameChangeMasterRoutes(app: FastifyInstance) {
  app.get(
    "/company",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listNameChangeMasterWithCompany
  );
  app.post(
    "/import",
    {
      schema: {
        body: postExcelBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    importNameChangeMasters
  );
  app.get(
    "/company/export",
    {
      schema: {
        querystring: getSearchQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    exportNameChangeMasterWithCompany
  );
  app.get(
    "/company/:companyId",
    {
      schema: {
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getNameChangeMasterLatestByCompanyId
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
    listNameChangeMaster
  );
  app.get(
    "/list/export/:companyId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportNameChangeMaster
  );
  app.get(
    "/view/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getNameChangeMaster
  );
  app.post(
    "/create/:companyId",
    {
      schema: {
        body: createNameChangeMasterBodySchema,
        params: getCompanyIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createNameChangeMaster
  );
  app.put(
    "/update/:id/:companyId",
    {
      schema: {
        body: updateNameChangeMasterBodySchema,
        params: getCompanyIdAndIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateNameChangeMaster
  );
  app.delete(
    "/delete/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeNameChangeMaster
  );
}
