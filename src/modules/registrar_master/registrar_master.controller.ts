import { FastifyReply, FastifyRequest } from "fastify";
import {
  companyMasterSelect,
  create,
  destroy,
  exportExcel,
  findById,
  importExcel,
  list,
  update,
} from "./registrar_master.services";
import { createRegistrarMasterUniqueSchema } from "./schemas/create.schema";
import { updateRegistrarMasterUniqueSchema } from "./schemas/update.schema";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  RegistrarMasterCreateType,
  RegistrarMasterUpdateType,
} from "../../@types/registrar_master.type";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listRegistrarMasters(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Masters Fetched",
    data: result,
  });
}

export async function exportRegistrarMasters(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="registrar_masters.xlsx"'
    )
    .send(result.file);
}

/**
 * Retrieves a registrarMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched registrarMaster data
 */
export async function getRegistrarMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Fetched",
    data: result,
  });
}

/**
 * Creates a new registrarMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the registrarMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the registrarMaster is successfully created
 */
export async function createRegistrarMaster(
  request: FastifyRequest<{
    Body: RegistrarMasterCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await createRegistrarMasterUniqueSchema.parseAsync({
    companyId: request.body.companyId,
  });
  const result = await create(request.body, request.authenticatedUser!.id);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Registrar Master Created",
    data: result,
  });
}

/**
 * Update registrarMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the registrarMaster is successfully updated
 */
export async function updateRegistrarMaster(
  request: FastifyRequest<{
    Body: RegistrarMasterUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateRegistrarMasterUniqueSchema.parseAsync({
    id: request.params.id,
    companyId: request.body.companyId,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Updated",
    data: result,
  });
}

/**
 * Remove a registrarMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing registrarMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the registrarMaster
 */
export async function removeRegistrarMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Removed",
    data: result,
  });
}

export async function importRegistrarMasters(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Masters Imported",
    data: result,
  });
}

export async function listCompanyMasterSelect(
  request: FastifyRequest<{
    Querystring: {
      companyId?: string;
    };
  }>,
  reply: FastifyReply
) {
  const query = request.query;
  const result = await companyMasterSelect(query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Masters Fetched",
    data: result,
  });
}
