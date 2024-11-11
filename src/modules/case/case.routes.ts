import { FastifyInstance } from "fastify";
import {
  createCase,
  generateCaseDoc,
  getCase,
  getCaseInfo,
  listCase,
  removeMultipleCase,
  removeCase,
  updateCase,
} from "./case.controller";
import { updateCaseBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getShareCertificateMasterIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createCaseBodySchema } from "./schemas/create.schema";

export async function caseRoutes(app: FastifyInstance) {
  app.get(
    "/list/:shareCertificateId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listCase
  );
  app.get(
    "/info/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCaseInfo
  );
  app.get(
    "/generate-docs/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    generateCaseDoc
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCase
  );
  app.post(
    "/create/:shareCertificateId",
    {
      schema: {
        body: createCaseBodySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createCase
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateCaseBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateCase
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeCase
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleCase
  );
}
