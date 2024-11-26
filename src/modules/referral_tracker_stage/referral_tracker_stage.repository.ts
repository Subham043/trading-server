import {
  ReferralTrackerStageType,
  ReferralTrackerStageUpdateType,
  ReferralTrackerStageCreateType,
} from "../../@types/referral_tracker_stage.type";
import { referralTrackerStagesModel } from "./referral_tracker_stage.model";

/**
 * Create a new paymentTrackerStage with the provided data.
 *
 * @param {InferInsertModel<typeof paymentTrackerStage>} data - the data for creating the paymentTrackerStage
 * @return {Promise<ReferralTrackerStageType>} a promise that resolves to the newly created paymentTrackerStage
 */
export async function createReferralTrackerStage(
  data: ReferralTrackerStageCreateType & { paymentTrackerId: number }
): Promise<ReferralTrackerStageType> {
  return await referralTrackerStagesModel.store(data);
}

/**
 * Update paymentTrackerStage information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the paymentTrackerStage with
 * @param {number} id - the id of the paymentTrackerStage to update
 * @return {Promise<ReferralTrackerStageType>} the updated paymentTrackerStage information
 */
export async function updateReferralTrackerStage(
  data: ReferralTrackerStageUpdateType,
  id: number
): Promise<ReferralTrackerStageType> {
  return await referralTrackerStagesModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<ReferralTrackerStageType[]>} the paginated paymentTrackerStage data as a promise
 */
export async function paginate(
  paymentTrackerId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<ReferralTrackerStageType[]> {
  return await referralTrackerStagesModel.paginate({
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
 * @return {Promise<ReferralTrackerStageType[]>} the paginated paymentTrackerStage data as a promise
 */
export async function getAll(
  paymentTrackerId: number,
  search?: string
): Promise<ReferralTrackerStageType[]> {
  return await referralTrackerStagesModel.all({
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
  return await referralTrackerStagesModel.totalCount({
    paymentTrackerId,
    search,
  });
}

/**
 * Retrieves paymentTrackerStage data by the given ID.
 *
 * @param {number} id - The ID of the paymentTrackerStage to retrieve
 * @return {Promise<ReferralTrackerStageType|null>} The paymentTrackerStage data if found, otherwise null
 */
export async function getById(id: number): Promise<ReferralTrackerStageType | null> {
  return await referralTrackerStagesModel.findById(id);
}

/**
 * Retrieves paymentTrackerStage information by paymentTrackerId from the database.
 *
 * @param {number} paymentTrackerId - The paymentTrackerId of the paymentTrackerStage to retrieve
 * @return {Promise<ReferralTrackerStageType | null>} The paymentTrackerStage information if found, otherwise null
 */
export async function getByReferralTrackerId(
  paymentTrackerId: number
): Promise<{
  id: number;
  paymentTrackerID: number | null;
  createdAt: Date;
} | null> {
  return await referralTrackerStagesModel.findByReferralTrackerId(paymentTrackerId);
}

/**
 * Removes a paymentTrackerStage from the database by their ID.
 *
 * @param {number} id - the ID of the paymentTrackerStage to be removed
 * @return {Promise<ReferralTrackerStageType>} a promise that resolves once the paymentTrackerStage is removed
 */
export async function remove(id: number): Promise<ReferralTrackerStageType> {
  return await referralTrackerStagesModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await referralTrackerStagesModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<ReferralTrackerStageType[]> {
  return await referralTrackerStagesModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await referralTrackerStagesModel.totalCount({
    search,
  });
}
