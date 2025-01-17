import { FastifyInstance } from "fastify";
import {
  createSurety,
  exportSurety,
  generateSuretyDoc,
  getSurety,
  listSurety,
  removeMultipleSurety,
  removeSurety,
  updateSurety,
} from "./surety.controller";
import { updateSuretyBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createSuretyBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function suretyRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listSurety
  );
  app.get(
    "/export/:projectId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportSurety
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getSurety
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createSuretyBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createSurety
  );
  app.get(
    "/generate-docs/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    generateSuretyDoc
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateSuretyBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateSurety
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeSurety
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleSurety
  );
}
