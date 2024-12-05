import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  findFoliosByProjectId,
  importExcel,
  list,
  update,
} from "./project.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  ProjectCreateType,
  ProjectUpdateType,
} from "../../@types/project.type";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";

export async function listProjects(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Projects Fetched",
    data: result,
  });
}

export async function exportProjects(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  return reply
    .header("Content-Disposition", 'attachment; filename="projects.xlsx"')
    .send(result.file);
}

/**
 * Retrieves a companyMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched companyMaster data
 */
export async function getProject(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Project Fetched",
    data: result,
  });
}

export async function getFoliosByProjectId(
  request: FastifyRequest<{
    Params: GetIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findFoliosByProjectId(request.query, request.params.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folios Fetched",
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
export async function createProject(
  request: FastifyRequest<{
    Body: ProjectCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await create(request.body, request.authenticatedUser!.id);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Project Created",
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
export async function updateProject(
  request: FastifyRequest<{
    Body: ProjectUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Project Updated",
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
export async function removeProject(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Project Removed",
    data: result,
  });
}

export async function removeMultipleProject(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Projects Removed",
  });
}

export async function importProjects(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Projects Imported",
    data: result,
  });
}
