import { FastifyInstance } from "fastify";
import {
  createPincode,
  exportPincodes,
  getPincode,
  getPincodeSelect,
  listPincodes,
  removeMultiplePincode,
  removePincode,
  updatePincode,
} from "./pincode.controller";
import { updatePincodeBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createPincodeBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function pincodeRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listPincodes
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportPincodes
  );
  app.get(
    "/select",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    getPincodeSelect
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultiplePincode
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getPincode
  );
  app.post(
    "/",
    {
      schema: { body: createPincodeBodySchema },
      preHandler: app.verifyJwt,
    },
    createPincode
  );
  app.put(
    "/:id",
    {
      schema: { body: updatePincodeBodySchema, params: getIdParamSchema },
      preHandler: app.verifyJwt,
    },
    updatePincode
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removePincode
  );
}
