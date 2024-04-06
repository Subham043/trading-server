import { FastifyInstance } from "fastify";
import {
  createCompanyMaster,
  getCompanyMaster,
  listCompanyMasters,
  removeCompanyMaster,
  updateCompanyMaster,
} from "./company_master.controller";
import { updateCompanyMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import { getIdParamSchema } from "../../common/schemas/id_param.schema";
import { createCompanyMasterBodySchema } from "./schemas/create.schema";

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
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCompanyMaster
  );
  app.post(
    "/",
    {
      schema: { body: createCompanyMasterBodySchema },
      preHandler: app.verifyJwt,
    },
    createCompanyMaster
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
