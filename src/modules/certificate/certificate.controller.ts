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
} from "./certificate.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  ShareCertificateMasterIdParam,
  folioIdSchema,
} from "./schemas/create.schema";
import { CertificateCreateType, CertificateUpdateType } from "../../@types/certificate.type";
import { updateCertificateIdSchema } from "./schemas/update.schema";

export async function listCertificates(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.params.folioId, request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificates Fetched",
    data: result,
  });
}

export async function listAllCertificates(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificates Fetched",
    data: result,
  });
}

export async function exportCertificates(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(
    request.params.folioId,
    request.query
  );
  return reply
    .header("Content-Disposition", 'attachment; filename="certificates.xlsx"')
    .send(result.file);
}

/**
 * Retrieves a folio based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched folio data
 */
export async function getCertificate(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificate Fetched",
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
export async function createCertificate(
  request: FastifyRequest<{
    Params: ShareCertificateMasterIdParam;
    Body: CertificateCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await folioIdSchema.parseAsync({
    folioId: request.params.folioId,
  });
  const result = await create(request.body, request.params.folioId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Certificate Created",
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
export async function updateCertificate(
  request: FastifyRequest<{
    Body: CertificateUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updateCertificateIdSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificate Updated",
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
export async function removeCertificate(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificate Removed",
    data: result,
  });
}

export async function removeMultipleCertificates(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificates Removed",
  });
}

export async function importCertificates(
  request: FastifyRequest<{
    Body: PostExcelBody;
  }>,
  reply: FastifyReply
) {
  const result = await importExcel(request.body, request.authenticatedUser!.id);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Certificates Imported",
    data: result,
  });
}
