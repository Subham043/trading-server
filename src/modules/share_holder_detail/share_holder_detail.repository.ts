import {
  ShareHolderDetailRepoCreateType,
  ShareHolderDetailRepoUpdateType,
  ShareHolderDetailType,
} from "../../@types/share_holder_detail.type";
import { shareHolderDetailModel } from "./share_holder_detail.model";

/**
 * Create a new project with the provided data.
 *
 * @param {ShareHolderDetailRepoCreateType} data - the data for creating the project
 * @return {Promise<ShareHolderDetailType>} a promise that resolves to the newly created project
 */
export async function createShareHolderDetail(
  data: ShareHolderDetailRepoCreateType
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.store(data);
}

/**
 * Update project information in the database.
 *
 * @param {UpdateShareHolderDetailBody} data - the data to update the project with
 * @param {number} id - the id of the project to update
 * @return {Promise<ShareHolderDetailType>} the updated project information
 */
export async function updateShareHolderDetail(
  data: ShareHolderDetailRepoUpdateType,
  id: number
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<ShareHolderDetailType[]>} the paginated project data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<ShareHolderDetailType[]> {
  return await shareHolderDetailModel.paginate({
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
 * @return {Promise<ShareHolderDetailType[]>} the paginated project data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<ShareHolderDetailType[]> {
  return await shareHolderDetailModel.all({
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
  return await shareHolderDetailModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves project data by the given ID.
 *
 * @param {number} id - The ID of the project to retrieve
 * @return {Promise<ShareHolderDetailType|null>} The project data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.findById(id);
}

/**
 * Removes a project from the database by their ID.
 *
 * @param {number} id - the ID of the project to be removed
 * @return {Promise<ShareHolderDetailType>} a promise that resolves once the project is removed
 */
export async function remove(
  id: number
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await shareHolderDetailModel.deleteManyByIds(ids);
  return;
}
