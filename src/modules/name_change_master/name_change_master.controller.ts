import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  exportExcel,
  exportExcelCompany,
  findByCompanyId,
  findById,
  importExcel,
  list,
  listCompany,
  update,
} from "./name_change_master.services";
import {
  GetCompanyIdAndIdParam,
  GetCompanyIdParam,
  GetIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  NameChangeMasterCreateType,
  NameChangeMasterUpdateType,
} from "../../@types/name_change_master.type";
import { createNameChangeMasterUniqueSchema } from "./schemas/create.schema";
import { updateNameChangeMasterUniqueSchema } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listNameChangeMaster(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
    Params: GetCompanyIdParam;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Masters Fetched",
    data: result,
  });
}

export async function exportNameChangeMaster(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
    Params: GetCompanyIdParam;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query, request.params);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="name_change_masters.xlsx"'
    )
    .send(result.file);
}

export async function listNameChangeMasterWithCompany(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listCompany(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Masters Fetched",
    data: result,
  });
}

export async function exportNameChangeMasterWithCompany(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcelCompany(request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="name_change_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a nameChaneMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched nameChaneMaster data
 */
export async function getNameChangeMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Master Fetched",
    data: result,
  });
}

export async function getNameChangeMasterLatestByCompanyId(
  request: FastifyRequest<{
    Params: GetCompanyIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findByCompanyId(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Master Fetched",
    data: result,
  });
}

/**
 * Creates a new nameChaneMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the nameChaneMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the nameChaneMaster is successfully created
 */
export async function createNameChangeMaster(
  request: FastifyRequest<{
    Body: NameChangeMasterCreateType;
    Params: GetCompanyIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createNameChangeMasterUniqueSchema.parseAsync({
    companyId: request.params.companyId,
    NSE: request.body.NSE,
    BSE: request.body.BSE,
  });
  const result = await create(request.body, request.params.companyId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Name Change Master Created",
    data: result,
  });
}

/**
 * Update nameChaneMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the nameChaneMaster is successfully updated
 */
export async function updateNameChangeMaster(
  request: FastifyRequest<{
    Body: NameChangeMasterUpdateType;
    Params: GetCompanyIdAndIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateNameChangeMasterUniqueSchema.parseAsync({
    id: request.params.id,
    companyId: request.params.companyId,
    NSE: request.body.NSE,
    BSE: request.body.BSE,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Master Updated",
    data: result,
  });
}

/**
 * Remove a nameChaneMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing nameChaneMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the nameChaneMaster
 */
export async function removeNameChangeMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Master Removed",
    data: result,
  });
}

export async function importNameChangeMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Name Change Masters Imported",
    data: result,
  });
}
