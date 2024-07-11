import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  importExcel,
  list,
  listAll,
  update,
} from "./corporate_master.services";
import {
  GetCompanyIdParam,
  GetIdParam,
  GetIdsBody,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import { companyMasterIdSchema } from "./schemas/create.schema";
import {
  CorporateMasterCreateType,
  CorporateMasterUpdateType,
} from "../../@types/corporate_master.type";
import { updateCorporateMasterIdSchema } from "./schemas/update.schema";

export async function listCorporateMasters(
  request: FastifyRequest<{
    Params: GetCompanyIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.params.companyId, request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Masters Fetched",
    data: result,
  });
}

export async function listAllCorporateMasters(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Masters Fetched",
    data: result,
  });
}

export async function exportCorporateMasters(
  request: FastifyRequest<{
    Params: GetCompanyIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.params.companyId, request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="corporate_masteres.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a corporateMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched corporateMaster data
 */
export async function getCorporateMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Master Fetched",
    data: result,
  });
}

/**
 * Creates a new corporateMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the corporateMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the corporateMaster is successfully created
 */
export async function createCorporateMaster(
  request: FastifyRequest<{
    Params: GetCompanyIdParam;
    Body: CorporateMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await companyMasterIdSchema.parseAsync({
    companyMasterId: request.params.companyId,
  });
  const result = await create(request.body, request.params.companyId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Corporate Master Created",
    data: result,
  });
}

/**
 * Update corporateMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the corporateMaster is successfully updated
 */
export async function updateCorporateMaster(
  request: FastifyRequest<{
    Body: CorporateMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateCorporateMasterIdSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Master Updated",
    data: result,
  });
}

/**
 * Remove a corporateMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing corporateMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the corporateMaster
 */
export async function removeCorporateMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Master Removed",
    data: result,
  });
}

export async function removeMultipleCorporateMasters(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Masters Removed",
  });
}

export async function importCorporateMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Corporate Masters Imported",
    data: result,
  });
}
