import { FastifyReply, FastifyRequest } from "fastify";

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
