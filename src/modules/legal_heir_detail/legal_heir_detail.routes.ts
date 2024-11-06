import { FastifyInstance } from "fastify";
import {
  createLegalHeirDetail,
  getLegalHeirDetail,
  listLegalHeirDetail,
  removeMultipleLegalHeirDetail,
  removeLegalHeirDetail,
  updateLegalHeirDetail,
} from "./legal_heir_detail.controller";
import { updateLegalHeirDetailBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createLegalHeirDetailBodySchema } from "./schemas/create.schema";

export async function legalHeirDetailRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listLegalHeirDetail
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getLegalHeirDetail
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createLegalHeirDetailBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createLegalHeirDetail
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateLegalHeirDetailBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateLegalHeirDetail
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeLegalHeirDetail
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleLegalHeirDetail
  );
}
