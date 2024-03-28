import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateProfileBody } from "./schemas/profile.schema";
import { update, updateCurrentPassword } from "./account.services";
import { updateUserUniqueEmailSchema } from "../user/schemas/update.schema";
import {
  UpdatePasswordBody,
  verifyCurrentPasswordSchema,
} from "./schemas/password.schema";

export async function getProfile(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Profile Fetched",
    data: request.authenticatedUser,
  });
}

export async function updateProfile(
  request: FastifyRequest<{
    Body: UpdateProfileBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateUserUniqueEmailSchema.parseAsync({
    id: request.authenticatedUser!.id,
    email: request.body.email,
  });
  const result = await update(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Profile Updated",
    data: result,
  });
}

export async function updatePassword(
  request: FastifyRequest<{
    Body: UpdatePasswordBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await verifyCurrentPasswordSchema.parseAsync({
    id: request.authenticatedUser!.id,
    current_password: request.body.current_password,
  });
  await updateCurrentPassword(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Password Updated",
  });
}
