import {
  IepfTrackerRepoCreateType,
  IepfTrackerRepoUpdateType,
  IepfTrackerType,
} from "../../@types/iepf_tracker.type";
import { iepfTrackerModel } from "./iepf_tracker.model";

/**
 * Create a new iepfTracker with the provided data.
 *
 * @param {IepfTrackerRepoCreateType} data - the data for creating the iepfTracker
 * @return {Promise<IepfTrackerType>} a promise that resolves to the newly created iepfTracker
 */
export async function createIepfTracker(
  data: IepfTrackerRepoCreateType
): Promise<IepfTrackerType | null> {
  return await iepfTrackerModel.store(data);
}

/**
 * Update iepfTracker information in the database.
 *
 * @param {UpdateIepfTrackerBody} data - the data to update the iepfTracker with
 * @param {number} id - the id of the iepfTracker to update
 * @return {Promise<IepfTrackerType>} the updated iepfTracker information
 */
export async function updateIepfTracker(
  data: IepfTrackerRepoUpdateType,
  id: number
): Promise<IepfTrackerType | null> {
  return await iepfTrackerModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<IepfTrackerType[]>} the paginated iepfTracker data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<IepfTrackerType[]> {
  return await iepfTrackerModel.paginate({
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
 * @return {Promise<IepfTrackerType[]>} the paginated iepfTracker data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<IepfTrackerType[]> {
  return await iepfTrackerModel.all({
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
  return await iepfTrackerModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves iepfTracker data by the given ID.
 *
 * @param {number} id - The ID of the iepfTracker to retrieve
 * @return {Promise<IepfTrackerType|null>} The iepfTracker data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<IepfTrackerType | null> {
  return await iepfTrackerModel.findById(id);
}

/**
 * Removes a iepfTracker from the database by their ID.
 *
 * @param {number} id - the ID of the iepfTracker to be removed
 * @return {Promise<IepfTrackerType>} a promise that resolves once the iepfTracker is removed
 */
export async function remove(
  id: number
): Promise<IepfTrackerType | null> {
  return await iepfTrackerModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await iepfTrackerModel.deleteManyByIds(ids);
  return;
}
