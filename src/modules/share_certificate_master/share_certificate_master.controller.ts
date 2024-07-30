import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  importExcel,
  list,
  update,
} from "./share_certificate_master.services";
import {
  GetIdParam,
  GetIdsBody,
  GetProjectIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  ShareCertificateMasterCreateType,
  ShareCertificateMasterUpdateType,
} from "../../@types/share_certificate_master.type";
import {
  createShareCertificateMasterUniqueSchema,
  projectIdSchema,
} from "./schemas/create.schema";
import { updateShareCertificateMasterUniqueSchema } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listShareCertificateMaster(
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
    message: "Share Certificate Masters Fetched",
    data: result,
  });
}

export async function exportShareCertificateMaster(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query, request.params.projectId);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="share_certificate_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a shareCertificateMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched shareCertificateMaster data
 */
export async function getShareCertificateMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Certificate Master Fetched",
    data: result,
  });
}

/**
 * Creates a new shareCertificateMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the shareCertificateMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareCertificateMaster is successfully created
 */
export async function createShareCertificateMaster(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Body: ShareCertificateMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createShareCertificateMasterUniqueSchema.parseAsync({
    companyID: request.body.companyID,
  });
  await projectIdSchema.parseAsync({
    projectId: request.params.projectId,
  });
  const result = await create(request.body, request.params.projectId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Share Certificate Master Created",
    data: result,
  });
}

/**
 * Update shareCertificateMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareCertificateMaster is successfully updated
 */
export async function updateShareCertificateMaster(
  request: FastifyRequest<{
    Body: ShareCertificateMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateShareCertificateMasterUniqueSchema.parseAsync({
    id: request.params.id,
    companyID: request.body.companyID,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Certificate Master Updated",
    data: result,
  });
}

/**
 * Remove a shareCertificateMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing shareCertificateMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the shareCertificateMaster
 */
export async function removeShareCertificateMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Certificate Master Removed",
    data: result,
  });
}

export async function removeMultipleShareCertificateMaster(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Certificate Masters Removed",
  });
}

export async function importShareCertificateMasters(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  await projectIdSchema.parseAsync({
    projectId: request.params.projectId,
  });
  const result = await importExcel(
    request.body,
    request.authenticatedUser!.id,
    request.params.projectId
  );
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Share Certificate Masters Imported",
    data: result,
  });
}
