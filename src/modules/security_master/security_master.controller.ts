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
} from "./security_master.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  SecurityMasterCreateType,
  SecurityMasterUpdateType,
} from "../../@types/security_master.type";
import { createSecurityMasterUniqueSchema } from "./schemas/create.schema";
import { updateSecurityMasterUniqueSchema } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listSecurityMaster(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Masters Fetched",
    data: result,
  });
}

export async function exportSecurityMaster(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="security_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a securityMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched securityMaster data
 */
export async function getSecurityMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Master Fetched",
    data: result,
  });
}

/**
 * Creates a new securityMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the securityMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the securityMaster is successfully created
 */
export async function createSecurityMaster(
  request: FastifyRequest<{
    Body: SecurityMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createSecurityMasterUniqueSchema.parseAsync({
    companyID: request.body.companyID,
  });
  const result = await create(request.body);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Security Master Created",
    data: result,
  });
}

/**
 * Update securityMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the securityMaster is successfully updated
 */
export async function updateSecurityMaster(
  request: FastifyRequest<{
    Body: SecurityMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateSecurityMasterUniqueSchema.parseAsync({
    id: request.params.id,
    companyID: request.body.companyID,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Master Updated",
    data: result,
  });
}

/**
 * Remove a securityMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing securityMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the securityMaster
 */
export async function removeSecurityMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Master Removed",
    data: result,
  });
}

export async function removeMultipleSecurityMaster(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Masters Removed",
  });
}

export async function importSecurityMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Masters Imported",
    data: result,
  });
}
