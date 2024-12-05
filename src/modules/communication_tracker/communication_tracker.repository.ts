import {
  CommunicationTrackerRepoCreateType,
  CommunicationTrackerRepoUpdateType,
  CommunicationTrackerType,
} from "../../@types/communication_tracker.type";
import { communicationTrackerModel } from "./communication_tracker.model";

/**
 * Create a new communicationTracker with the provided data.
 *
 * @param {CommunicationTrackerRepoCreateType} data - the data for creating the communicationTracker
 * @return {Promise<CommunicationTrackerType>} a promise that resolves to the newly created communicationTracker
 */
export async function createCommunicationTracker(
  data: CommunicationTrackerRepoCreateType
): Promise<CommunicationTrackerType | null> {
  return await communicationTrackerModel.store(data);
}

/**
 * Update communicationTracker information in the database.
 *
 * @param {UpdateCommunicationTrackerBody} data - the data to update the communicationTracker with
 * @param {number} id - the id of the communicationTracker to update
 * @return {Promise<CommunicationTrackerType>} the updated communicationTracker information
 */
export async function updateCommunicationTracker(
  data: CommunicationTrackerRepoUpdateType,
  id: number
): Promise<CommunicationTrackerType | null> {
  return await communicationTrackerModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CommunicationTrackerType[]>} the paginated communicationTracker data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<CommunicationTrackerType[]> {
  return await communicationTrackerModel.paginate({
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
 * @return {Promise<CommunicationTrackerType[]>} the paginated communicationTracker data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<CommunicationTrackerType[]> {
  return await communicationTrackerModel.all({
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
  return await communicationTrackerModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves communicationTracker data by the given ID.
 *
 * @param {number} id - The ID of the communicationTracker to retrieve
 * @return {Promise<CommunicationTrackerType|null>} The communicationTracker data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<CommunicationTrackerType | null> {
  return await communicationTrackerModel.findById(id);
}

/**
 * Removes a communicationTracker from the database by their ID.
 *
 * @param {number} id - the ID of the communicationTracker to be removed
 * @return {Promise<CommunicationTrackerType>} a promise that resolves once the communicationTracker is removed
 */
export async function remove(
  id: number
): Promise<CommunicationTrackerType | null> {
  return await communicationTrackerModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await communicationTrackerModel.deleteManyByIds(ids);
  return;
}
