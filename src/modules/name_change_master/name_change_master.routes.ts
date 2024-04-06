import { FastifyInstance } from "fastify";
import {
  createNameChangeMaster,
  getNameChangeMaster,
  getNameChangeMasterLatestByCompanyId,
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
