import {
  count,
  countAll,
  createPaymentTrackerStage,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updatePaymentTrackerStage,
} from "./payment_tracker_stage.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  PaymentTrackerStageCreateType,
  PaymentTrackerStageType,
  PaymentTrackerStageUpdateType,
} from "../../@types/payment_tracker_stage.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
} from "../../utils/excel";
import {
  ExcelPaymentTrackerStageesColumns,
  PaymentTrackerStageExportExcelData,
} from "./payment_tracker_stage.model";

/**
 * Create a new paymentTrackerStage with the provided paymentTrackerStage information.
 *
 * @param {PaymentTrackerStageCreateType} paymentTrackerStage - the paymentTrackerStage information
 * @return {Promise<PaymentTrackerStageType>} a promise that resolves with the created paymentTrackerStage data
 */
export async function create(
  data: PaymentTrackerStageCreateType,
  paymentTrackerId: number
): Promise<PaymentTrackerStageType> {
  return await createPaymentTrackerStage({ ...data, paymentTrackerId });
}

/**
 * Update PaymentTrackerStageType information.
 *
 * @param {CreatePaymentTrackerStageBody} PaymentTrackerStageType - the PaymentTrackerStageType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the PaymentTrackerStageType to be updated
 * @return {Promise<PaymentTrackerStageType>} the updated PaymentTrackerStageType information
 */
export async function update(
  data: PaymentTrackerStageUpdateType,
  param: GetIdParam
): Promise<PaymentTrackerStageType> {
  return await updatePaymentTrackerStage(data, param.id);
}

/**
 * Find a paymentTrackerStage by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the paymentTrackerStage
 * @return {Promise<PaymentTrackerStageType>} the paymentTrackerStage found by ID
 */
export async function findById(params: GetIdParam): Promise<PaymentTrackerStageType> {
  const { id } = params;

  const paymentTrackerStage = await getById(id);
  if (!paymentTrackerStage) {
    throw new NotFoundError();
  }
  return paymentTrackerStage;
}

/**
 * Find paymentTrackerStage by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the paymentTrackerStage
 * @return {Promise<{paymentTrackerStage:PaymentTrackerStageType[]} & PaginationType>} the paymentTrackerStage found by ID
 */
export async function list(
  paymentTrackerId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    paymentTrackerStage: PaymentTrackerStageType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const paymentTrackerStage = await paginate(
    paymentTrackerId,
    limit,
    offset,
    querystring.search
  );
  const paymentTrackerStageCount = await count(paymentTrackerId, querystring.search);
  return {
    paymentTrackerStage,
    ...getPaginationKeys({
      count: paymentTrackerStageCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    paymentTrackerStage: PaymentTrackerStageType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const paymentTrackerStage = await paginateAll(limit, offset, querystring.search);
  const paymentTrackerStageCount = await countAll(querystring.search);
  return {
    paymentTrackerStage,
    ...getPaginationKeys({
      count: paymentTrackerStageCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export paymentTrackerStage by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the paymentTrackerStage
 * @return {Promise<{file: ExcelBuffer}>} the paymentTrackerStage found by ID
 */
export async function exportExcel(
  paymentTrackerId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const paymentTrackerStages = await getAll(paymentTrackerId, querystring.search);

  const excelData = paymentTrackerStages.map((paymentTrackerStage) => {
    return {
      id: paymentTrackerStage.id,
      amount: paymentTrackerStage.amount,
      status: paymentTrackerStage.status,
      createdAt: paymentTrackerStage.createdAt,
      paymentTrackerID: paymentTrackerStage.paymentTrackerID,
    };
  });

  const buffer = await generateExcel<PaymentTrackerStageExportExcelData>(
    "PaymentTrackerStages",
    ExcelPaymentTrackerStageesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a paymentTrackerStage based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the paymentTrackerStage
 * @return {Promise<PaymentTrackerStageType>} the destroyed paymentTrackerStage
 */
export async function destroy(params: GetIdParam): Promise<PaymentTrackerStageType> {
  const { id } = params;

  const paymentTrackerStage = await findById(params);
  await remove(id);
  return paymentTrackerStage;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}