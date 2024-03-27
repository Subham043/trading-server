import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBody } from "./schemas/login.schema";
import { signin } from "./auth.services";
import env from "../../config/env";

export async function login(
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await signin(request.body);
  reply
    .code(200)
    .type("application/json")
    .setCookie("access_token", result.access_token, {
      domain: env.NODE_ENV === "production" ? env.MAIN_URL : "",
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    })
    .send({
      code: 200,
      success: true,
      message: "Login Successful",
      data: result,
    });
}
