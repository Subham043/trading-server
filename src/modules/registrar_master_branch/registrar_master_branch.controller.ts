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
} from "./registrar_master_branch.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  RegistrarMasterIdParam,
  registrarMasterIdSchema,
} from "./schemas/create.schema";
import {
  RegistrarMasterBranchCreateType,
  RegistrarMasterBranchUpdateType,
} from "../../@types/registrar_master_branch.type";
import { updateRegistrarMasterBranchIdSchema } from "./schemas/update.schema";

export async function listRegistrarMasterBranches(
  request: FastifyRequest<{
    Params: RegistrarMasterIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.params.registrarMasterId, request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branches Fetched",
    data: result,
  });
}

export async function listAllRegistrarMasterBranches(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branches Fetched",
    data: result,
  });
}

export async function exportRegistrarMasterBranches(
  request: FastifyRequest<{
    Params: RegistrarMasterIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(
    request.params.registrarMasterId,
    request.query
  );
  return reply
    .header(
      "Content-Disposition",
      'attachment; filename="registrar_master_branches.xlsx"'
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
export async function getRegistrarMasterBranch(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branch Fetched",
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
export async function createRegistrarMasterBranch(
  request: FastifyRequest<{
    Params: RegistrarMasterIdParam;
    Body: RegistrarMasterBranchCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await registrarMasterIdSchema.parseAsync({
    registrarMasterId: request.params.registrarMasterId,
  });
  const result = await create(request.body, request.params.registrarMasterId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Registrar Master Branch Created",
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
export async function updateRegistrarMasterBranch(
  request: FastifyRequest<{
    Body: RegistrarMasterBranchUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateRegistrarMasterBranchIdSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branch Updated",
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
export async function removeRegistrarMasterBranch(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branch Removed",
    data: result,
  });
}

export async function removeMultipleRegistrarMasterBranches(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branches Removed",
  });
}

export async function importRegistrarMasterBranches(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Registrar Master Branches Imported",
    data: result,
  });
}
