import { FastifyInstance } from "fastify";
import {
  createUser,
  getUser,
  listUsers,
  removeUser,
  updateUser,
} from "./user.controller";
import { createUserJsonSchema } from "./schemas/create.schema";
import { updateUserJsonSchema } from "./schemas/update.schema";
import { getPaginationQueryJsonSchema } from "../../common/schemas/pagination_query.schema";
import { getIdJsonSchema } from "../../common/schemas/id_param.schema";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    { schema: getPaginationQueryJsonSchema, preHandler: app.verifyJwt },
    listUsers
  );
  app.get(
    "/:id",
    { schema: getIdJsonSchema, preHandler: app.verifyJwt },
    getUser
  );
  app.post(
    "/",
    { schema: createUserJsonSchema, preHandler: app.verifyJwt },
    createUser
  );
  app.put(
    "/:id",
    { schema: updateUserJsonSchema, preHandler: app.verifyJwt },
    updateUser
  );
  app.delete(
    "/:id",
    { schema: getIdJsonSchema, preHandler: app.verifyJwt },
    removeUser
  );
}
