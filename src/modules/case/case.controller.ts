import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  findById,
  findInfoById,
  // generateDoc,
  list,
  update,
} from "./case.services";
import {
  GetIdParam,
  GetIdsBody,
  GetShareCertificateMasterIdParam,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import {
  CaseRepoCreateType,
  CaseRepoUpdateType,
} from "../../@types/case.type";
import {
  shareCertificateIdSchema,
} from "./schemas/create.schema";
import { MultipartFile } from "../../@types/multipart_file.type";
// import fs from "fs";
// import path from "path";

export async function listCase(
  request: FastifyRequest<{
    Params: GetShareCertificateMasterIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query, request.params.shareCertificateId);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Cases Fetched",
    data: result,
  });
}

/**
 * Retrieves a shareHolderMaster based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched shareHolderMaster data
 */
export async function getCase(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Case Fetched",
    data: result,
  });
}

export async function getCaseInfo(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findInfoById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Case Fetched",
    data: result,
  });
}

/**
 * Creates a new shareHolderMaster using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the shareHolderMaster information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareHolderMaster is successfully created
 */
export async function createCase(
  request: FastifyRequest<{
    Params: GetShareCertificateMasterIdParam;
    Body: Omit<
      CaseRepoCreateType,
      "shareCertificateID" | "document" | "id" | "createdAt"
    > & {
      document?: MultipartFile | null | undefined;
    };
  }>,
  reply: FastifyReply
): Promise<void> {
  await shareCertificateIdSchema.parseAsync({
    shareCertificateId: request.params.shareCertificateId,
  });
  const result = await create(request.body, request.params.shareCertificateId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Case Created",
    data: result,
  });
}

/**
 * Update shareHolderMaster information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the shareHolderMaster is successfully updated
 */
export async function updateCase(
  request: FastifyRequest<{
    Body: CaseRepoUpdateType & {
      document?: MultipartFile | null | undefined;
    };
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Case Updated",
    data: result,
  });
}

/**
 * Remove a shareHolderMaster based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing shareHolderMaster parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the shareHolderMaster
 */
export async function removeCase(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Case Removed",
    data: result,
  });
}

export async function removeMultipleCase(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Cases Removed",
  });
}

// export async function generateCaseDoc(
//   request: FastifyRequest<{
//     Params: GetIdParam;
//   }>,
//   reply: FastifyReply
// ): Promise<void> {
//   const result = await generateDoc(request.params);
//   const filePath = path.resolve(__dirname, result);
//   const fileStream = fs.createReadStream(filePath);
//   return reply
//     .header("Content-Disposition", 'attachment; filename="docs.zip"')
//     .send(fileStream)
// }