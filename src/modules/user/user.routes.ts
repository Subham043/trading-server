import { FastifyInstance } from "fastify";
import {
  createUser,
  exportUsers,
  getUser,
  importUsers,
  listUsers,
  removeMultipleUser,
  removeUser,
  updateUser,
} from "./user.controller";
import { updateUserBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import {
  getIdParamSchema,
  getIdsBodySchema,
} from "../../common/schemas/id_param.schema";
import { createUserBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";
import { postExcelBodySchema } from "../../common/schemas/excel.schema";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: { querystring: getPaginationQuerySchema },
      preHandler: app.verifyJwt,
    },
    listUsers
  );
  app.get(
    "/export",
    {
      schema: { querystring: getSearchQuerySchema },
      preHandler: app.verifyJwt,
    },
    exportUsers
  );
  app.post(
    "/import",
    {
      schema: { body: postExcelBodySchema },
      preHandler: app.verifyJwt,
    },
    importUsers
  );
  app.post(
    "/delete-multiple",
    {
      schema: {
        body: getIdsBodySchema,
      },
      preHandler: app.verifyJwt,
    },
    removeMultipleUser
  );
  app.get(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    getUser
  );
  app.post(
    "/",
    {
      schema: { body: createUserBodySchema },
      preHandler: app.verifyJwt,
    },
    createUser
  );
  app.put(
    "/:id",
    {
      schema: { body: updateUserBodySchema, params: getIdParamSchema },
      preHandler: app.verifyJwt,
    },
    updateUser
  );
  app.delete(
    "/:id",
    {
      schema: {
        params: getIdParamSchema,
      },
      preHandler: app.verifyJwt,
    },
    removeUser
  );
}
