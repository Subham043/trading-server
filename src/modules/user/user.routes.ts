import { FastifyInstance } from "fastify";
import {
  createUser,
  exportUsers,
  getUser,
  listUsers,
  removeUser,
  updateUser,
} from "./user.controller";
import { updateUserBodySchema } from "./schemas/update.schema";
import { getPaginationQuerySchema } from "../../common/schemas/pagination_query.schema";
import { getIdParamSchema } from "../../common/schemas/id_param.schema";
import { createUserBodySchema } from "./schemas/create.schema";
import { getSearchQuerySchema } from "../../common/schemas/search_query.schema";

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
