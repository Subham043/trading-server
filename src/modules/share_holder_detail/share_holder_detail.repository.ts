import {
  ShareHolderDetailRepoCreateType,
  ShareHolderDetailRepoUpdateType,
  ShareHolderDetailType,
} from "../../@types/share_holder_detail.type";
import { shareHolderDetailModel } from "./share_holder_detail.model";

/**
 * Create a new shareHolderMaster with the provided data.
 *
 * @param {ShareHolderDetailRepoCreateType} data - the data for creating the shareHolderMaster
 * @return {Promise<ShareHolderDetailType>} a promise that resolves to the newly created shareHolderMaster
 */
export async function createShareHolderDetail(
  data: ShareHolderDetailRepoCreateType
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.store(data);
}

/**
 * Update shareHolderMaster information in the database.
 *
 * @param {UpdateShareHolderDetailBody} data - the data to update the shareHolderMaster with
 * @param {number} id - the id of the shareHolderMaster to update
 * @return {Promise<ShareHolderDetailType>} the updated shareHolderMaster information
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
 * @return {Promise<ShareHolderDetailType[]>} the paginated shareHolderMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  shareHolderMasterID: number,
  search?: string
): Promise<ShareHolderDetailType[]> {
  return await shareHolderDetailModel.paginate({
    limit,
    offset,
    shareHolderMasterID,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<ShareHolderDetailType[]>} the paginated shareHolderMaster data as a promise
 */
export async function getAll(
  shareHolderMasterID: number,
  search?: string
): Promise<ShareHolderDetailType[]> {
  return await shareHolderDetailModel.all({
    shareHolderMasterID,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  shareHolderMasterID: number,
  search?: string
): Promise<number> {
  return await shareHolderDetailModel.totalCount({
    search,
    shareHolderMasterID,
  });
}

/**
 * Retrieves shareHolderMaster data by the given ID.
 *
 * @param {number} id - The ID of the shareHolderMaster to retrieve
 * @return {Promise<ShareHolderDetailType|null>} The shareHolderMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<ShareHolderDetailType | null> {
  return await shareHolderDetailModel.findById(id);
}

/**
 * Removes a shareHolderMaster from the database by their ID.
 *
 * @param {number} id - the ID of the shareHolderMaster to be removed
 * @return {Promise<ShareHolderDetailType>} a promise that resolves once the shareHolderMaster is removed
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
