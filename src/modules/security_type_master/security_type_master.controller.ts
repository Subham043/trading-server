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
} from "./security_type_master.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  SecurityTypeMasterCreateType,
  SecurityTypeMasterUpdateType,
} from "../../@types/security_type_master.type";
import { createSecurityTypeMasterUniqueSchema } from "./schemas/create.schema";
import { updateSecurityTypeMasterUniqueSchema } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listSecurityTypeMaster(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Masters Fetched",
    data: result,
  });
}

export async function exportSecurityTypeMaster(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="security_type_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a securityTypeMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched securityTypeMaster data
 */
export async function getSecurityTypeMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Master Fetched",
    data: result,
  });
}

/**
 * Creates a new securityTypeMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the securityTypeMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the securityTypeMaster is successfully created
 */
export async function createSecurityTypeMaster(
  request: FastifyRequest<{
    Body: SecurityTypeMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createSecurityTypeMasterUniqueSchema.parseAsync({
    companyID: request.body.companyID,
  });
  const result = await create(request.body);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Security Type Master Created",
    data: result,
  });
}

/**
 * Update securityTypeMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the securityTypeMaster is successfully updated
 */
export async function updateSecurityTypeMaster(
  request: FastifyRequest<{
    Body: SecurityTypeMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateSecurityTypeMasterUniqueSchema.parseAsync({
    id: request.params.id,
    companyID: request.body.companyID,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Master Updated",
    data: result,
  });
}

/**
 * Remove a securityTypeMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing securityTypeMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the securityTypeMaster
 */
export async function removeSecurityTypeMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Master Removed",
    data: result,
  });
}

export async function removeMultipleSecurityTypeMaster(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Masters Removed",
  });
}

export async function importSecurityTypeMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Security Type Masters Imported",
    data: result,
  });
}
