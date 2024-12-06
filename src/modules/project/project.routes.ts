import { FastifyInstance } from "fastify";
import {
  createProject,
  exportProjects,
  getProject,
  importProjects,
  listProjects,
  removeProject,
  removeMultipleProject,
  updateProject,
  getFoliosByProjectId,
  getTotalValuationByProjectId,
} from "./project.controller";
import { updateProjectBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createProjectBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function projectRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listProjects
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportProjects
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importProjects
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleProject
  );
  app.post(
    "/",
    {
      schema: { body: createProjectBodySchema },
      preHandler: app.verifyJwt,
    },
    createProject
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getProject
  );
  app.get(
    "/:id/folios",
    {
      schema: {
        querystring: getPaginationQuerySchema,
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getFoliosByProjectId
  );
  app.get(
    "/:id/total-valuation",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getTotalValuationByProjectId
  );
  app.put(
    "/:id",
    {
      schema: { body: updateProjectBodySchema, params: getIdParamSchema },
      preHandler: app.verifyJwt,
    },
    updateProject
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeProject
  );
}
