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
  GetProjectIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  ShareHolderDetailRepoUpdateType,
} from "../../@types/share_holder_detail.type";
import {
  projectIdSchema,
} from "./schemas/create.schema";
import { MultipartFile } from "../../@types/multipart_file.type";

export async function listShareHolderDetail(
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
 * Retrieves a project based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched project data
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
 * Creates a new project using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the project information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the project is successfully created
 */
export async function createShareHolderDetail(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Body: Omit<
      ShareHolderDetailRepoUpdateType,
      "projectID" | "document" | "id" | "createdAt"
    > & {
      document?: MultipartFile | null | undefined;
    };
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
 * Update project information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the project is successfully updated
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
 * Remove a project based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing project parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the project
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
