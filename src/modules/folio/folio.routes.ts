import { FastifyInstance } from "fastify";
import {
  createFolio,
  exportFolios,
  getFolio,
  importFolios,
  listAllFolios,
  listFolios,
  removeMultipleFolios,
  removeFolio,
  updateFolio,
  listCorporateMaster,
  listDividendMaster,
  listCorporateMasterRights,
} from "./folio.controller";
import { updateFolioBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getShareCertificateMasterIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createFolioBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function folioRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllFolios
  );
  app.get(
    "/list/:shareCertificateId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listFolios
  );
  app.get(
    "/export/:shareCertificateId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportFolios
  );
  app.post(
    "/create/:shareCertificateId",
    {
      schema: {
        body: createFolioBodySchema,
        params: getShareCertificateMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createFolio
  );
  app.get(
    "/list-corporate-master/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listCorporateMaster
  );
  app.get(
    "/list-corporate-master/:id/rights",
    {
      schema: {
        params: getIdParamSchema,
        querystring: getSearchQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listCorporateMasterRights
  );
  app.get(
    "/list-dividend-master/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listDividendMaster
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importFolios
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleFolios
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getFolio
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateFolioBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateFolio
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeFolio
  );
}
