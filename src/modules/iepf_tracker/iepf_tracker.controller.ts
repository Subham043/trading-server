import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  generateDoc,
  list,
  update,
} from "./iepf_tracker.services";
import {
  GetIdParam,
  GetIdsBody,
  GetProjectIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  IepfTrackerCreateType,
  IepfTrackerUpdateType,
} from "../../@types/iepf_tracker.type";
import {
  projectIdSchema,
} from "./schemas/create.schema";
import { updateIepfTrackerUniqueSchema } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";

export async function listIepfTracker(
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
    message: "Iepf Trackers Fetched",
    data: result,
  });
}

export async function exportIepfTracker(
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
      'attachment; filename="stage_trackers.xlsx"'
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
export async function getIepfTracker(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Iepf Tracker Fetched",
    data: result,
  });
}

export async function generateIepfTrackerDoc(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await generateDoc(request.params);
  return reply
    .header("Content-Disposition", 'attachment; filename="stage_trackers.xlsx"')
    .send(result.file);
}

/**
 * Creates a new shareCertificateMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the shareCertificateMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareCertificateMaster is successfully created
 */
export async function createIepfTracker(
  request: FastifyRequest<{
    Params: GetProjectIdParam;
    Body: IepfTrackerCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await projectIdSchema.parseAsync({
    projectId: request.params.projectId,
  });
  const result = await create(request.body, request.params.projectId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Iepf Tracker Created",
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
export async function updateIepfTracker(
  request: FastifyRequest<{
    Body: IepfTrackerUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateIepfTrackerUniqueSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Iepf Tracker Updated",
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
export async function removeIepfTracker(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Iepf Tracker Removed",
    data: result,
  });
}

export async function removeMultipleIepfTracker(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Iepf Trackers Removed",
  });
}
