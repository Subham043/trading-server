import {
  PaymentTrackerStageType,
  PaymentTrackerStageUpdateType,
  PaymentTrackerStageCreateType,
} from "../../@types/payment_tracker_stage.type";
import { paymentTrackerStagesModel } from "./payment_tracker_stage.model";

/**
 * Create a new paymentTrackerStage with the provided data.
 *
 * @param {InferInsertModel<typeof paymentTrackerStage>} data - the data for creating the paymentTrackerStage
 * @return {Promise<PaymentTrackerStageType>} a promise that resolves to the newly created paymentTrackerStage
 */
export async function createPaymentTrackerStage(
  data: PaymentTrackerStageCreateType & { paymentTrackerId: number }
): Promise<PaymentTrackerStageType> {
  return await paymentTrackerStagesModel.store(data);
}

/**
 * Update paymentTrackerStage information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the paymentTrackerStage with
 * @param {number} id - the id of the paymentTrackerStage to update
 * @return {Promise<PaymentTrackerStageType>} the updated paymentTrackerStage information
 */
export async function updatePaymentTrackerStage(
  data: PaymentTrackerStageUpdateType,
  id: number
): Promise<PaymentTrackerStageType> {
  return await paymentTrackerStagesModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<PaymentTrackerStageType[]>} the paginated paymentTrackerStage data as a promise
 */
export async function paginate(
  paymentTrackerId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<PaymentTrackerStageType[]> {
  return await paymentTrackerStagesModel.paginate({
    limit,
    offset,
    paymentTrackerId,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<PaymentTrackerStageType[]>} the paginated paymentTrackerStage data as a promise
 */
export async function getAll(
  paymentTrackerId: number,
  search?: string
): Promise<PaymentTrackerStageType[]> {
  return await paymentTrackerStagesModel.all({
    paymentTrackerId,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  paymentTrackerId: number,
  search?: string
): Promise<number> {
  return await paymentTrackerStagesModel.totalCount({
    paymentTrackerId,
    search,
  });
}

/**
 * Retrieves paymentTrackerStage data by the given ID.
 *
 * @param {number} id - The ID of the paymentTrackerStage to retrieve
 * @return {Promise<PaymentTrackerStageType|null>} The paymentTrackerStage data if found, otherwise null
 */
export async function getById(id: number): Promise<PaymentTrackerStageType | null> {
  return await paymentTrackerStagesModel.findById(id);
}

/**
 * Retrieves paymentTrackerStage information by paymentTrackerId from the database.
 *
 * @param {number} paymentTrackerId - The paymentTrackerId of the paymentTrackerStage to retrieve
 * @return {Promise<PaymentTrackerStageType | null>} The paymentTrackerStage information if found, otherwise null
 */
export async function getByPaymentTrackerId(
  paymentTrackerId: number
): Promise<{
  id: number;
  paymentTrackerID: number | null;
  createdAt: Date;
} | null> {
  return await paymentTrackerStagesModel.findByPaymentTrackerId(paymentTrackerId);
}

/**
 * Removes a paymentTrackerStage from the database by their ID.
 *
 * @param {number} id - the ID of the paymentTrackerStage to be removed
 * @return {Promise<PaymentTrackerStageType>} a promise that resolves once the paymentTrackerStage is removed
 */
export async function remove(id: number): Promise<PaymentTrackerStageType> {
  return await paymentTrackerStagesModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await paymentTrackerStagesModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<PaymentTrackerStageType[]> {
  return await paymentTrackerStagesModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await paymentTrackerStagesModel.totalCount({
    search,
  });
}
