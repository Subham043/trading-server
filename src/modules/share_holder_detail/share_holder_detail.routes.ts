import { FastifyInstance } from "fastify";
import {
  createShareHolderDetail,
  getShareHolderDetail,
  listShareHolderDetail,
  removeMultipleShareHolderDetail,
  removeShareHolderDetail,
  updateShareHolderDetail,
} from "./share_holder_detail.controller";
import { updateShareHolderDetailBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getShareHolderMasterIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createShareHolderDetailBodySchema } from "./schemas/create.schema";

export async function shareHolderDetailRoutes(app: FastifyInstance) {
  app.get(
    "/list/:shareHolderMasterId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getShareHolderMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listShareHolderDetail
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getShareHolderDetail
  );
  app.post(
    "/create/:shareHolderMasterId",
    {
      schema: {
        body: createShareHolderDetailBodySchema,
        params: getShareHolderMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createShareHolderDetail
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateShareHolderDetailBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateShareHolderDetail
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeShareHolderDetail
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleShareHolderDetail
  );
}
