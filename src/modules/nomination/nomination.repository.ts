import {
  NominationRepoCreateType,
  NominationRepoUpdateType,
  NominationType,
} from "../../@types/nomination.type";
import { nominationModel } from "./nomination.model";

/**
 * Create a new nomination with the provided data.
 *
 * @param {NominationRepoCreateType} data - the data for creating the nomination
 * @return {Promise<NominationType>} a promise that resolves to the newly created nomination
 */
export async function createNomination(
  data: NominationRepoCreateType
): Promise<NominationType | null> {
  return await nominationModel.store(data);
}

/**
 * Update nomination information in the database.
 *
 * @param {UpdateNominationBody} data - the data to update the nomination with
 * @param {number} id - the id of the nomination to update
 * @return {Promise<NominationType>} the updated nomination information
 */
export async function updateNomination(
  data: NominationRepoUpdateType,
  id: number
): Promise<NominationType | null> {
  return await nominationModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<NominationType[]>} the paginated nomination data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<NominationType[]> {
  return await nominationModel.paginate({
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
 * @return {Promise<NominationType[]>} the paginated nomination data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<NominationType[]> {
  return await nominationModel.all({
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
  return await nominationModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves nomination data by the given ID.
 *
 * @param {number} id - The ID of the nomination to retrieve
 * @return {Promise<NominationType|null>} The nomination data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<NominationType | null> {
  return await nominationModel.findById(id);
}

/**
 * Removes a nomination from the database by their ID.
 *
 * @param {number} id - the ID of the nomination to be removed
 * @return {Promise<NominationType>} a promise that resolves once the nomination is removed
 */
export async function remove(
  id: number
): Promise<NominationType | null> {
  return await nominationModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await nominationModel.deleteManyByIds(ids);
  return;
}
