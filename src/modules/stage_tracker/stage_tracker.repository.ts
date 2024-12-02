import {
  StageTrackerRepoCreateType,
  StageTrackerRepoUpdateType,
  StageTrackerType,
} from "../../@types/stage_tracker.type";
import { stageTrackerModel } from "./stage_tracker.model";

/**
 * Create a new stageTracker with the provided data.
 *
 * @param {StageTrackerRepoCreateType} data - the data for creating the stageTracker
 * @return {Promise<StageTrackerType>} a promise that resolves to the newly created stageTracker
 */
export async function createStageTracker(
  data: StageTrackerRepoCreateType
): Promise<StageTrackerType | null> {
  return await stageTrackerModel.store(data);
}

/**
 * Update stageTracker information in the database.
 *
 * @param {UpdateStageTrackerBody} data - the data to update the stageTracker with
 * @param {number} id - the id of the stageTracker to update
 * @return {Promise<StageTrackerType>} the updated stageTracker information
 */
export async function updateStageTracker(
  data: StageTrackerRepoUpdateType,
  id: number
): Promise<StageTrackerType | null> {
  return await stageTrackerModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<StageTrackerType[]>} the paginated stageTracker data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<StageTrackerType[]> {
  return await stageTrackerModel.paginate({
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
 * @return {Promise<StageTrackerType[]>} the paginated stageTracker data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<StageTrackerType[]> {
  return await stageTrackerModel.all({
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
  return await stageTrackerModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves stageTracker data by the given ID.
 *
 * @param {number} id - The ID of the stageTracker to retrieve
 * @return {Promise<StageTrackerType|null>} The stageTracker data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<StageTrackerType | null> {
  return await stageTrackerModel.findById(id);
}

/**
 * Removes a stageTracker from the database by their ID.
 *
 * @param {number} id - the ID of the stageTracker to be removed
 * @return {Promise<StageTrackerType>} a promise that resolves once the stageTracker is removed
 */
export async function remove(
  id: number
): Promise<StageTrackerType | null> {
  return await stageTrackerModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await stageTrackerModel.deleteManyByIds(ids);
  return;
}
