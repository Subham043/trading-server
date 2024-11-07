import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  getCorporateMaster,
  getDividendMaster,
  importExcel,
  list,
  listAll,
  update,
} from "./folio.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  ShareCertificateMasterIdParam,
  shareCertificateIdSchema,
} from "./schemas/create.schema";
import { FolioCreateType, FolioUpdateType } from "../../@types/folio.type";
import { updateFolioIdSchema } from "./schemas/update.schema";

export async function listFolios(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.params.shareCertificateId, request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folios Fetched",
    data: result,
  });
}

export async function listAllFolios(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folios Fetched",
    data: result,
  });
}

export async function exportFolios(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(
    request.params.shareCertificateId,
    request.query
  );
  return reply
    .header("Content-Disposition", 'attachment; filename="folios.xlsx"')
    .send(result.file);
}

/**
 * Retrieves a folio based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched folio data
 */
export async function getFolio(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folio Fetched",
    data: result,
  });
}

export async function listCorporateMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await getCorporateMaster(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folio Fetched",
    data: result,
  });
}

export async function listDividendMaster(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await getDividendMaster(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folio Fetched",
    data: result,
  });
}

/**
 * Creates a new folio using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the folio information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the folio is successfully created
 */
export async function createFolio(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Body: FolioCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await shareCertificateIdSchema.parseAsync({
    shareCertificateId: request.params.shareCertificateId,
    shareholderName1ID: request.body.shareholderName1ID,
    shareholderName2ID: request.body.shareholderName2ID,
    shareholderName3ID: request.body.shareholderName3ID,
    endorsementShareholderName1ID: request.body.endorsementShareholderName1ID,
    endorsementShareholderName2ID: request.body.endorsementShareholderName2ID,
    endorsementShareholderName3ID: request.body.endorsementShareholderName3ID,
  });
  const result = await create(request.body, request.params.shareCertificateId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Folio Created",
    data: result,
  });
}

/**
 * Update folio information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the folio is successfully updated
 */
export async function updateFolio(
  request: FastifyRequest<{
    Body: FolioUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateFolioIdSchema.parseAsync({
    id: request.params.id,
    shareholderName1ID: request.body.shareholderName1ID,
    shareholderName2ID: request.body.shareholderName2ID,
    shareholderName3ID: request.body.shareholderName3ID,
    endorsementShareholderName1ID: request.body.endorsementShareholderName1ID,
    endorsementShareholderName2ID: request.body.endorsementShareholderName2ID,
    endorsementShareholderName3ID: request.body.endorsementShareholderName3ID,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folio Updated",
    data: result,
  });
}

/**
 * Remove a folio based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing folio parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the folio
 */
export async function removeFolio(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folio Removed",
    data: result,
  });
}

export async function removeMultipleFolios(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folios Removed",
  });
}

export async function importFolios(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Folios Imported",
    data: result,
  });
}
