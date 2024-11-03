import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  findById,
  findInfoById,
  generateDoc,
  list,
  update,
  updateTransposition,
} from "./share_holder_master.services";
import {
  GetIdParam,
  GetIdsBody,
  GetProjectIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  ShareHolderMasterCreateType,
  ShareHolderMasterUpdateType,
} from "../../@types/share_holder_master.type";
import {
  projectIdSchema,
} from "./schemas/create.schema";
import fs from "fs";
import path from "path";

export async function listShareHolderMaster(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query, request.params.projectId);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Masters Fetched",
    data: result,
  });
}

/**
 * Retrieves a shareHolderMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched shareHolderMaster data
 */
export async function getShareHolderMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Master Fetched",
    data: result,
  });
}

export async function getShareHolderMasterInfo(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findInfoById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Master Fetched",
    data: result,
  });
}

/**
 * Creates a new shareHolderMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the shareHolderMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareHolderMaster is successfully created
 */
export async function createShareHolderMaster(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Body: ShareHolderMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await projectIdSchema.parseAsync({
    projectId: request.params.projectId,
  });
  const result = await create(request.body, request.params.projectId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Share Holder Master Created",
    data: result,
  });
}

/**
 * Update shareHolderMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareHolderMaster is successfully updated
 */
export async function updateShareHolderMaster(
  request: FastifyRequest<{
    Body: ShareHolderMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Master Updated",
    data: result,
  });
}

export async function updateShareHolderMasterTransposition(
  request: FastifyRequest<{
    Body: { transpositionOrder: string };
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await updateTransposition(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Master Updated",
    data: result,
  });
}

/**
 * Remove a shareHolderMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing shareHolderMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the shareHolderMaster
 */
export async function removeShareHolderMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Master Removed",
    data: result,
  });
}

export async function removeMultipleShareHolderMaster(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Holder Masters Removed",
  });
}

export async function generateShareHolderMasterDoc(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await generateDoc(request.params);
  const filePath = path.resolve(__dirname, result);
  const fileStream = fs.createReadStream(filePath);
  return reply
    .header("Content-Disposition", 'attachment; filename="docs.zip"')
    .send(fileStream)
}