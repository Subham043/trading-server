import { FastifyInstance } from "fastify";
import {
  createPaymentTracker,
  exportPaymentTracker,
  getPaymentTracker,
  listPaymentTracker,
  removeMultiplePaymentTracker,
  removePaymentTracker,
  updatePaymentTracker,
} from "./payment_tracker.controller";
import { updatePaymentTrackerBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createPaymentTrackerBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function paymentTrackerRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listPaymentTracker
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
    exportPaymentTracker
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getPaymentTracker
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createPaymentTrackerBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createPaymentTracker
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updatePaymentTrackerBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updatePaymentTracker
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removePaymentTracker
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultiplePaymentTracker
  );
}
