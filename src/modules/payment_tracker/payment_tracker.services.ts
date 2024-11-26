import {
  count,
  createPaymentTracker,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updatePaymentTracker,
} from "./payment_tracker.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  PaymentTrackerCreateType,
  PaymentTrackerType,
  PaymentTrackerUpdateType,
} from "../../@types/payment_tracker.type";
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
  ExcelPaymentTrackersColumns,
} from "./payment_tracker.model";

/**
 * Create a new paymentTracker with the provided paymentTracker information.
 *
 * @param {PaymentTrackerCreateType} paymentTracker - the paymentTracker information
 * @return {Promise<PaymentTrackerType>} a promise that resolves with the created paymentTracker data
 */
export async function create(
  data: PaymentTrackerCreateType,
  projectID: number
): Promise<PaymentTrackerType | null> {
  return await createPaymentTracker({
    ...data,
    projectID,
  });
}

/**
 * Update PaymentTrackerType information.
 *
 * @param {CreatePaymentTrackerBody} PaymentTrackerType - the PaymentTrackerType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the PaymentTrackerType to be updated
 * @return {Promise<PaymentTrackerType>} the updated PaymentTrackerType information
 */
export async function update(
  data: PaymentTrackerUpdateType,
  param: GetIdParam
): Promise<PaymentTrackerType | null> {
  return await updatePaymentTracker(data, param.id);
}

/**
 * Find a paymentTracker by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the paymentTracker
 * @return {Promise<PaymentTrackerType>} the paymentTracker found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<PaymentTrackerType> {
  const { id } = params;

  const paymentTracker = await getById(id);
  if (!paymentTracker) {
    throw new NotFoundError();
  }
  return paymentTracker;
}

/**
 * Find paymentTracker by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the paymentTracker
 * @return {Promise<{paymentTracker:PaymentTrackerType[]} & PaginationType>} the paymentTracker found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    paymentTracker: PaymentTrackerType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const paymentTracker = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const paymentTrackerCount = await count(
    projectID,
    querystring.search
  );
  return {
    paymentTracker,
    ...getPaginationKeys({
      count: paymentTrackerCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export paymentTracker by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the paymentTracker
 * @return {Promise<{file: ExcelBuffer}>} the paymentTracker found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const paymentTrackers = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<PaymentTrackerType>(
    "Payment Trackers",
    ExcelPaymentTrackersColumns,
    paymentTrackers
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a paymentTracker based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the paymentTracker
 * @return {Promise<PaymentTrackerType>} the destroyed paymentTracker
 */
export async function destroy(
  params: GetIdParam
): Promise<PaymentTrackerType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
