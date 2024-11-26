import { FastifyReply, FastifyRequest } from "fastify";
import {
  create,
  destroy,
  destroyMultiple,
  exportExcel,
  findById,
  list,
  listAll,
  update,
} from "./payment_tracker_stage.services";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  paymentTrackerIdParam,
  paymentTrackerIdSchema,
} from "./schemas/create.schema";
import { PaymentTrackerStageCreateType, PaymentTrackerStageUpdateType } from "../../@types/payment_tracker_stage.type";
import { updatePaymentTrackerStageIdSchema } from "./schemas/update.schema";

export async function listPaymentTrackerStages(
  request: FastifyRequest<{
    Params: paymentTrackerIdParam;
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await list(request.params.paymentTrackerId, request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStages Fetched",
    data: result,
  });
}

export async function listAllPaymentTrackerStages(
  request: FastifyRequest<{
    Querystring: GetPaginationQuery;
  }>,
  reply: FastifyReply
) {
  const result = await listAll(request.query);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStages Fetched",
    data: result,
  });
}

export async function exportPaymentTrackerStages(
  request: FastifyRequest<{
    Params: paymentTrackerIdParam;
    Querystring: GetSearchQuery;
  }>,
  reply: FastifyReply
) {
  const result = await exportExcel(
    request.params.paymentTrackerId,
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
export async function getPaymentTrackerStage(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await findById(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStage Fetched",
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
export async function createPaymentTrackerStage(
  request: FastifyRequest<{
    Params: paymentTrackerIdParam;
    Body: PaymentTrackerStageCreateType;
  }>,
  reply: FastifyReply
): Promise<void> {
  await paymentTrackerIdSchema.parseAsync({
    paymentTrackerId: request.params.paymentTrackerId,
  });
  const result = await create(request.body, request.params.paymentTrackerId);
  return reply.code(201).type("application/json").send({
    code: 201,
    success: true,
    message: "PaymentTrackerStage Created",
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
export async function updatePaymentTrackerStage(
  request: FastifyRequest<{
    Body: PaymentTrackerStageUpdateType;
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  await updatePaymentTrackerStageIdSchema.parseAsync({
    id: request.params.id,
  });
  const result = await update(request.body, request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStage Updated",
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
export async function removePaymentTrackerStage(
  request: FastifyRequest<{
    Params: GetIdParam;
  }>,
  reply: FastifyReply
): Promise<void> {
  const result = await destroy(request.params);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStage Removed",
    data: result,
  });
}

export async function removeMultiplePaymentTrackerStages(
  request: FastifyRequest<{
    Body: GetIdsBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  await destroyMultiple(request.body);
  return reply.code(200).type("application/json").send({
    code: 200,
    success: true,
    message: "PaymentTrackerStages Removed",
  });
}
