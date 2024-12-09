import { FastifyInstance } from "fastify";
import {
  createIepfTracker,
  exportIepfTracker,
  getIepfTracker,
  listIepfTracker,
  removeMultipleIepfTracker,
  removeIepfTracker,
  updateIepfTracker,
  generateIepfTrackerDoc,
} from "./iepf_tracker.controller";
import { updateIepfTrackerBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createIepfTrackerBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function iepfTrackerRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listIepfTracker
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
    exportIepfTracker
  );
  app.get(
    "/generate-docs/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    generateIepfTrackerDoc
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getIepfTracker
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createIepfTrackerBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createIepfTracker
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateIepfTrackerBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateIepfTracker
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeIepfTracker
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleIepfTracker
  );
}
