import {
  FastifyBaseLogger,
  FastifyError,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  FastifyTypeProviderDefault,
  RawServerDefault,
  preHandlerHookHandler,
} from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { UnauthorizedError } from "./exceptions";
import { AuthType } from "../@types/user.type";
import { getById } from "../modules/user/user.repository";
import { ZodError } from "zod";

export type PreHandlerHookDecoratorType = preHandlerHookHandler<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  unknown,
  FastifySchema,
  FastifyTypeProviderDefault,
  FastifyBaseLogger
>;

export const ServerErrorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.server.log.error(error);
  if (error instanceof ZodError) {
    return reply.status(422).type("application/json").send({
      statusCode: 422,
      success: false,
      message: "Bad Request",
      formErrors: error.formErrors.fieldErrors,
    });
  }
  return reply
    .status(error.statusCode || 500)
    .type("application/json")
    .send({
      ...error,
      message: error.message || "Internal Server Error",
      statusCode: error.statusCode || 500,
      success: false,
    });
};

export const verifyJwtDecorator = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: FastifyError) => void
) => {
  try {
    const authHeader = request.headers.authorization ?? undefined;
    const authCookie = request.cookies.access_token ?? undefined;
    if (authHeader || authCookie) {
      const token =
        authCookie || (authHeader ? authHeader.replace("Bearer ", "") : "");
      const user = request.server.jwt.verify<AuthType>(token);
      if (user) {
        const verifyUser = await getById(user.id);
        if (verifyUser) {
          request.user = { ...user, ...verifyUser };
          request.authenticatedUser = {
            ...user,
            ...verifyUser,
            access_token: token,
          };
          return;
          // done(); // pass an error if the authentication fails
        }
        throw new UnauthorizedError();
      } else {
        throw new UnauthorizedError();
      }
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    throw new UnauthorizedError();
  }
};
