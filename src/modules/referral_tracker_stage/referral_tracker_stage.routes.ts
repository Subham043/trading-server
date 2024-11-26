import { FastifyInstance } from "fastify";
import {
  createReferralTrackerStage,
  exportReferralTrackerStages,
  getReferralTrackerStage,
  listAllReferralTrackerStages,
  listReferralTrackerStages,
  removeMultipleReferralTrackerStages,
  removeReferralTrackerStage,
  updateReferralTrackerStage,
} from "./referral_tracker_stage.controller";
import { updateReferralTrackerStageBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getShareCertificateMasterIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createReferralTrackerStageBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

export async function referralTrackerStageRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllReferralTrackerStages
  );
  app.get(
    "/list/:paymentTrackerId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listReferralTrackerStages
  );
  app.get(
    "/export/:paymentTrackerId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportReferralTrackerStages
  );
  app.post(
    "/create/:paymentTrackerId",
    {
      schema: {
        body: createReferralTrackerStageBodySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createReferralTrackerStage
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleReferralTrackerStages
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getReferralTrackerStage
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateReferralTrackerStageBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateReferralTrackerStage
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeReferralTrackerStage
  );
}
