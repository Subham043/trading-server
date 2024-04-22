import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  exportExcel,
  findById,
  getPincodesSelect,
  list,
  update,
} from "./pincode.services";
import { CreatePincodeBody } from "./schemas/create.schema";
import { UpdatePincodeBody } from "./schemas/update.schema";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";

export async function listPincodes(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Pincodes Fetched",
    data: result,
  });
}

export async function exportPincodes(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(request.query);
  reply
    .header("Content-Disposition", 'attachment; filename="countries.xlsx"')
    .send(result.file);
}

/**
 * Retrieves a pincode based on the provided parameters.
 *
 * @param {FastifyRequest} request - the request object containing the parameters
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} a promise resolving to the fetched pincode data
 */
export async function getPincode(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Pincode Fetched",
    data: result,
  });
}

export async function getPincodeSelect(
  request: FastifyRequest<{
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await getPincodesSelect(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Pincode Fetched",
    data: result,
  });
}

/**
 * Creates a new pincode using the request body and sends back the result with a 201 status code.
 *
 * @param {FastifyRequest} request - the request object containing the pincode information
 * @param {FastifyReply} reply - the reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the pincode is successfully created
 */
export async function createPincode(
  request: FastifyRequest<{
    Body: CreatePincodeBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await create(request.body);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "Pincode Created",
    data: result,
  });
}

/**
 * Update pincode information based on the request body and parameters.
 *
 * @param {FastifyRequest} request - The request object containing the body and parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves when the pincode is successfully updated
 */
export async function updatePincode(
  request: FastifyRequest<{
    Body: UpdatePincodeBody;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Pincode Updated",
    data: result,
  });
}

/**
 * Remove a pincode based on the request parameter.
 *
 * @param {FastifyRequest<{ Params: GetIdParam }>} request - The request object containing pincode parameters
 * @param {FastifyReply} reply - The reply object for sending the response
 * @return {Promise<void>} A promise that resolves after removing the pincode
 */
export async function removePincode(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "Pincode Removed",
    data: result,
  });
}
