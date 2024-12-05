import { FastifyInstance } from "fastify";
import {
  createCommunicationTracker,
  exportCommunicationTracker,
  getCommunicationTracker,
  listCommunicationTracker,
  removeMultipleCommunicationTracker,
  removeCommunicationTracker,
  updateCommunicationTracker,
} from "./communication_tracker.controller";
import { updateCommunicationTrackerBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createCommunicationTrackerBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function communicationTrackerRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listCommunicationTracker
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
    exportCommunicationTracker
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCommunicationTracker
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createCommunicationTrackerBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createCommunicationTracker
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateCommunicationTrackerBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateCommunicationTracker
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeCommunicationTracker
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleCommunicationTracker
  );
}
