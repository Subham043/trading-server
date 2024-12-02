import { FastifyInstance } from "fastify";
import {
  createStageName,
  exportStageNames,
  getStageName,
  listStageNames,
  removeStageName,
  removeMultipleStageName,
  updateStageName,
} from "./stageName.controller";
import { updateStageNameBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createStageNameBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function stageNameRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listStageNames
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportStageNames
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleStageName
  );
  app.post(
    "/",
    {
      schema: { body: createStageNameBodySchema },
      preHandler: app.verifyJwt,
    },
    createStageName
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getStageName
  );
  app.put(
    "/:id",
    {
      schema: { body: updateStageNameBodySchema, params: getIdParamSchema },
      preHandler: app.verifyJwt,
    },
    updateStageName
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeStageName
  );
}
