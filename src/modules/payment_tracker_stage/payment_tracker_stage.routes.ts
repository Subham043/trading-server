import { FastifyInstance } from "fastify";
import {
  createPaymentTrackerStage,
  exportPaymentTrackerStages,
  getPaymentTrackerStage,
  listAllPaymentTrackerStages,
  listPaymentTrackerStages,
  removeMultiplePaymentTrackerStages,
  removePaymentTrackerStage,
  updatePaymentTrackerStage,
} from "./payment_tracker_stage.controller";
import { updatePaymentTrackerStageBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getPaymentTrackerIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createPaymentTrackerStageBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function paymentTrackerStageRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllPaymentTrackerStages
  );
  app.get(
    "/list/:paymentTrackerId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getPaymentTrackerIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listPaymentTrackerStages
  );
  app.get(
    "/export/:paymentTrackerId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getPaymentTrackerIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportPaymentTrackerStages
  );
  app.post(
    "/create/:paymentTrackerId",
    {
      schema: {
        body: createPaymentTrackerStageBodySchema,
        params: getPaymentTrackerIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createPaymentTrackerStage
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultiplePaymentTrackerStages
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getPaymentTrackerStage
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updatePaymentTrackerStageBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updatePaymentTrackerStage
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removePaymentTrackerStage
  );
}
