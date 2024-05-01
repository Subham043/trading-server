import { FastifyInstance } from "fastify";
import {
  createRegistrarMaster,
  exportRegistrarMasters,
  getRegistrarMaster,
  importRegistrarMasters,
  listRegistrarMasters,
  removeMultipleRegistrarMaster,
  removeRegistrarMaster,
  updateRegistrarMaster,
} from "./registrar_master.controller";
import { updateRegistrarMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createRegistrarMasterBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function registrarMasterRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listRegistrarMasters
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportRegistrarMasters
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importRegistrarMasters
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleRegistrarMaster
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getRegistrarMaster
  );
  app.post(
    "/",
    {
      schema: { body: createRegistrarMasterBodySchema },
      preHandler: app.verifyJwt,
    },
    createRegistrarMaster
  );
  app.put(
    "/:id",
    {
      schema: {
        body: updateRegistrarMasterBodySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    updateRegistrarMaster
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeRegistrarMaster
  );
}
