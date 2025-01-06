import { FastifyInstance } from "fastify";
import {
  createCertificate,
  exportCertificates,
  getCertificate,
  importCertificates,
  listAllCertificates,
  listCertificates,
  removeMultipleCertificates,
  removeCertificate,
  updateCertificate,
} from "./certificate.controller";
import { updateCertificateBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getFolioIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createCertificateBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function certificateRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllCertificates
  );
  app.get(
    "/list/:folioId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getFolioIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listCertificates
  );
  app.get(
    "/export/:folioId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getFolioIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportCertificates
  );
  app.post(
    "/create/:folioId",
    {
      schema: {
        body: createCertificateBodySchema,
        params: getFolioIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createCertificate
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importCertificates
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleCertificates
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getCertificate
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateCertificateBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateCertificate
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeCertificate
  );
}
