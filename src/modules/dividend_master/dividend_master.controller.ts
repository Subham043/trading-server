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
} from "./dividend_master.services";
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
  DividendMasterCreateType,
  DividendMasterUpdateType,
} from "../../@types/dividend_master.type";
import { updateDividendMasterIdSchema } from "./schemas/update.schema";

export async function listDividendMasters(
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
    message: "Dividend Masters Fetched",
    data: result,
  });
}

export async function listAllDividendMasters(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Masters Fetched",
    data: result,
  });
}

export async function exportDividendMasters(
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
      'attachment; filename="dividend_masteres.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a dividendMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched dividendMaster data
 */
export async function getDividendMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Master Fetched",
    data: result,
  });
}

/**
 * Creates a new dividendMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the dividendMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the dividendMaster is successfully created
 */
export async function createDividendMaster(
  request: FastifyRequest<{
    Params: GetCompanyIdParam;
    Body: DividendMasterCreateType;
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
    message: "Dividend Master Created",
    data: result,
  });
}

/**
 * Update dividendMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the dividendMaster is successfully updated
 */
export async function updateDividendMaster(
  request: FastifyRequest<{
    Body: DividendMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateDividendMasterIdSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Master Updated",
    data: result,
  });
}

/**
 * Remove a dividendMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing dividendMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the dividendMaster
 */
export async function removeDividendMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Master Removed",
    data: result,
  });
}

export async function removeMultipleDividendMasters(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Masters Removed",
  });
}

export async function importDividendMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Dividend Masters Imported",
    data: result,
  });
}
