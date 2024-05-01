import { FastifyInstance } from "fastify";
import {
  createRegistrarMasterBranch,
  exportRegistrarMasterBranches,
  getRegistrarMasterBranch,
  importRegistrarMasterBranches,
  listAllRegistrarMasterBranches,
  listRegistrarMasterBranches,
  removeMultipleRegistrarMasterBranches,
  removeRegistrarMasterBranch,
  updateRegistrarMasterBranch,
} from "./registrar_master_branch.controller";
import { updateRegistrarMasterBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
  getRegistrarMasterIdParamSchema,
} from "../../common/schemas/id_param.schema";
import { createRegistrarMasterBranchBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function registrarMasterBranchRoutes(app: FastifyInstance) {
  app.get(
    "/list-all",
    {
      schema: {
        querystring: getPaginationQuerySchema,
      },
      preHandler: app.verifyJwt,
    },
    listAllRegistrarMasterBranches
  );
  app.get(
    "/list/:registrarMasterId",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getRegistrarMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    listRegistrarMasterBranches
  );
  app.get(
    "/export/:registrarMasterId",
    {
      schema: {
        querystring: getSearchQuerySchema,
        params: getRegistrarMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    exportRegistrarMasterBranches
  );
  app.post(
    "/create/:registrarMasterId",
    {
      schema: {
        body: createRegistrarMasterBranchBodySchema,
        params: getRegistrarMasterIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    createRegistrarMasterBranch
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importRegistrarMasterBranches
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleRegistrarMasterBranches
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getRegistrarMasterBranch
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
    updateRegistrarMasterBranch
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeRegistrarMasterBranch
  );
}
