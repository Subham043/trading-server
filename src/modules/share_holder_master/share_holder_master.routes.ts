import { FastifyInstance } from "fastify";
import {
  createShareHolderMaster,
  getShareHolderMaster,
  getShareHolderMasterInfo,
  listShareHolderMaster,
  removeMultipleShareHolderMaster,
  removeShareHolderMaster,
  updateShareHolderMaster,
} from "./share_holder_master.controller";
import { updateShareHolderMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getProjectIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createShareHolderMasterBodySchema } from "./schemas/create.schema";

export async function shareHolderMasterRoutes(app: FastifyInstance) {
  app.get(
    "/list/:projectId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listShareHolderMaster
  );
  app.get(
    "/info/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getShareHolderMasterInfo
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getShareHolderMaster
  );
  app.post(
    "/create/:projectId",
    {
      schema: {
        body: createShareHolderMasterBodySchema,
        params: getProjectIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createShareHolderMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateShareHolderMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateShareHolderMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeShareHolderMaster
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleShareHolderMaster
  );
}
