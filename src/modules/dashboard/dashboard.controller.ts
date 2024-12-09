import { FastifyReply, FastifyRequest } from "fastify";
import { stats } from "./dashboard.service";


export async function getStats(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = await stats();
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Stats Fetched",
    data: result,
  });
}