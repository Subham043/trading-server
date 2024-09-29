import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  findById,
  list,
  update,
} from "./share_holder_detail.services";
import {
  GetIdParam,
  GetIdsBody,
  GetShareHolderMasterIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  ShareHolderDetailRepoUpdateType,
} from "../../@types/share_holder_detail.type";
import {
  shareHolderMasterIdSchema,
} from "./schemas/create.schema";
import { MultipartFile } from "../../@types/multipart_file.type";

export async function listShareHolderDetail(
  request: FastifyRequest<{
    Params: GetShareHolderMasterIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query, request.params.shareHolderMasterId);
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
export async function getShareHolderDetail(
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

/**
 * Creates a new shareHolderMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the shareHolderMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareHolderMaster is successfully created
 */
export async function createShareHolderDetail(
  request: FastifyRequest<{
    Params: GetShareHolderMasterIdParam;
    Body: Omit<
      ShareHolderDetailRepoUpdateType,
      "shareHolderMasterID" | "document" | "id" | "createdAt"
    > & {
      document?: MultipartFile | null | undefined;
    };
  }>,
  reply: FastifyReply
): Promise<void> {
  await shareHolderMasterIdSchema.parseAsync({
    shareHolderMasterId: request.params.shareHolderMasterId,
  });
  const result = await create(request.body, request.params.shareHolderMasterId);
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
export async function updateShareHolderDetail(
  request: FastifyRequest<{
    Body: ShareHolderDetailRepoUpdateType & {
      document?: MultipartFile | null | undefined;
    };
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

/**
 * Remove a shareHolderMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing shareHolderMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the shareHolderMaster
 */
export async function removeShareHolderDetail(
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

export async function removeMultipleShareHolderDetail(
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
