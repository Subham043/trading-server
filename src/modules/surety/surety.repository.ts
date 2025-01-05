import {
  SuretyRepoCreateType,
  SuretyRepoUpdateType,
  SuretyType,
} from "../../@types/surety.type";
import { suretyModel } from "./surety.model";

/**
 * Create a new surety with the provided data.
 *
 * @param {SuretyRepoCreateType} data - the data for creating the surety
 * @return {Promise<SuretyType>} a promise that resolves to the newly created surety
 */
export async function createSurety(
  data: SuretyRepoCreateType
): Promise<SuretyType | null> {
  return await suretyModel.store(data);
}

/**
 * Update surety information in the database.
 *
 * @param {UpdateSuretyBody} data - the data to update the surety with
 * @param {number} id - the id of the surety to update
 * @return {Promise<SuretyType>} the updated surety information
 */
export async function updateSurety(
  data: SuretyRepoUpdateType,
  id: number
): Promise<SuretyType | null> {
  return await suretyModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<SuretyType[]>} the paginated surety data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<SuretyType[]> {
  return await suretyModel.paginate({
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
 * @return {Promise<SuretyType[]>} the paginated surety data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<SuretyType[]> {
  return await suretyModel.all({
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
  return await suretyModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves surety data by the given ID.
 *
 * @param {number} id - The ID of the surety to retrieve
 * @return {Promise<SuretyType|null>} The surety data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<SuretyType | null> {
  return await suretyModel.findById(id);
}

/**
 * Removes a surety from the database by their ID.
 *
 * @param {number} id - the ID of the surety to be removed
 * @return {Promise<SuretyType>} a promise that resolves once the surety is removed
 */
export async function remove(
  id: number
): Promise<SuretyType | null> {
  return await suretyModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await suretyModel.deleteManyByIds(ids);
  return;
}
