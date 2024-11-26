import {
  PaymentTrackerRepoCreateType,
  PaymentTrackerRepoUpdateType,
  PaymentTrackerType,
} from "../../@types/payment_tracker.type";
import { paymentTrackerModel } from "./payment_tracker.model";

/**
 * Create a new paymentTracker with the provided data.
 *
 * @param {PaymentTrackerRepoCreateType} data - the data for creating the paymentTracker
 * @return {Promise<PaymentTrackerType>} a promise that resolves to the newly created paymentTracker
 */
export async function createPaymentTracker(
  data: PaymentTrackerRepoCreateType
): Promise<PaymentTrackerType | null> {
  return await paymentTrackerModel.store(data);
}

/**
 * Update paymentTracker information in the database.
 *
 * @param {UpdatePaymentTrackerBody} data - the data to update the paymentTracker with
 * @param {number} id - the id of the paymentTracker to update
 * @return {Promise<PaymentTrackerType>} the updated paymentTracker information
 */
export async function updatePaymentTracker(
  data: PaymentTrackerRepoUpdateType,
  id: number
): Promise<PaymentTrackerType | null> {
  return await paymentTrackerModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<PaymentTrackerType[]>} the paginated paymentTracker data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<PaymentTrackerType[]> {
  return await paymentTrackerModel.paginate({
    limit,
    offset,
    projectID,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<PaymentTrackerType[]>} the paginated paymentTracker data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<PaymentTrackerType[]> {
  return await paymentTrackerModel.all({
    projectID,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  projectID: number,
  search?: string
): Promise<number> {
  return await paymentTrackerModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves paymentTracker data by the given ID.
 *
 * @param {number} id - The ID of the paymentTracker to retrieve
 * @return {Promise<PaymentTrackerType|null>} The paymentTracker data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<PaymentTrackerType | null> {
  return await paymentTrackerModel.findById(id);
}

/**
 * Removes a paymentTracker from the database by their ID.
 *
 * @param {number} id - the ID of the paymentTracker to be removed
 * @return {Promise<PaymentTrackerType>} a promise that resolves once the paymentTracker is removed
 */
export async function remove(
  id: number
): Promise<PaymentTrackerType | null> {
  return await paymentTrackerModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await paymentTrackerModel.deleteManyByIds(ids);
  return;
}
