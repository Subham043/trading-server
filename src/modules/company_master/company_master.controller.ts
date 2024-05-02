import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  importExcel,
  importUpdateExcel,
  list,
  update,
} from "./company_master.services";
import { createCompanyMasterUniqueSchema } from "./schemas/create.schema";
import { updateCompanyMasterUniqueSchema } from "./schemas/update.schema";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  CompanyMasterCreateType,
  CompanyMasterUpdateType,
} from "../../@types/company_master.type";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listCompanyMasters(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Masters Fetched",
    data: result,
  });
}

export async function exportCompanyMasters(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="company_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a companyMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched companyMaster data
 */
export async function getCompanyMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Master Fetched",
    data: result,
  });
}

/**
 * Creates a new companyMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the companyMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the companyMaster is successfully created
 */
export async function createCompanyMaster(
  request: FastifyRequest<{
    Body: CompanyMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createCompanyMasterUniqueSchema.parseAsync({
    CIN: request.body.CIN,
    ISIN: request.body.ISIN,
    NSE: request.body.NSE,
    BSE: request.body.BSE,
    registrarMasterBranchId: request.body.registrarMasterBranchId,
  });
  const result = await create(request.body, request.authenticatedUser!.id);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Company Master Created",
    data: result,
  });
}

/**
 * Update companyMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the companyMaster is successfully updated
 */
export async function updateCompanyMaster(
  request: FastifyRequest<{
    Body: CompanyMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateCompanyMasterUniqueSchema.parseAsync({
    id: request.params.id,
    CIN: request.body.CIN,
    ISIN: request.body.ISIN,
    NSE: request.body.NSE,
    BSE: request.body.BSE,
    registrarMasterBranchId: request.body.registrarMasterBranchId,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Master Updated",
    data: result,
  });
}

/**
 * Remove a companyMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing companyMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the companyMaster
 */
export async function removeCompanyMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Master Removed",
    data: result,
  });
}

export async function removeMultipleCompanyMaster(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Masters Removed",
  });
}

export async function importCompanyMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Masters Imported",
    data: result,
  });
}

export async function importCompanyMastersUpdate(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importUpdateExcel(
    request.body,
    request.authenticatedUser!.id
  );
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Company Masters Imported",
    data: result,
  });
}
