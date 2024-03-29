import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBody } from "./schemas/login.schema";
import { forgot_password, reset_password, signin } from "./auth.services";
import env from "../../config/env";
import {
  ForgotPasswordBody,
  emailExistSchema,
} from "./schemas/forgot_password.schema";
import { ResetPasswordBody } from "./schemas/reset_password.schema";
import { GetKeyParam } from "./schemas/key_param.schema";

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
    .setCookie(env.APP_NAME + "_Auth", result.access_token, {
      domain: env.NODE_ENV === "production" ? env.MAIN_URL : "",
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })
    .send({
      code: 200,
      success: true,
      message: "Login Successful",
      data: result,
    });
}

export async function forgotPassword(
  request: FastifyRequest<{
    Body: ForgotPasswordBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await emailExistSchema.parseAsync(request.body.email);
  await forgot_password(request.body);
  reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "We have sent a password reset link to your email",
  });
}

export async function resetPassword(
  request: FastifyRequest<{
    Body: ResetPasswordBody;
    Params: GetKeyParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await reset_password(request.body, request.params.key);
  reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Password Reset Successful",
    data: result,
  });
}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  reply
    .code(200)
    .type("application/json")
    .setCookie(env.APP_NAME + "_Auth", "", {
      domain: env.NODE_ENV === "production" ? env.MAIN_URL : "",
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })
    .send({
      code: 200,
      success: true,
      message: "Logged Out Successfully",
    });
}
