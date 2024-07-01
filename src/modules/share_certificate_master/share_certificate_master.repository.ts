import {
  ShareCertificateMasterRepoCreateType,
  ShareCertificateMasterRepoUpdateType,
  ShareCertificateMasterType,
} from "../../@types/share_certificate_master.type";
import { shareCertificateMasterModel } from "./share_certificate_master.model";

/**
 * Create a new shareCertificateMaster with the provided data.
 *
 * @param {ShareCertificateMasterRepoCreateType} data - the data for creating the shareCertificateMaster
 * @return {Promise<ShareCertificateMasterType>} a promise that resolves to the newly created shareCertificateMaster
 */
export async function createShareCertificateMaster(
  data: ShareCertificateMasterRepoCreateType
): Promise<ShareCertificateMasterType | null> {
  return await shareCertificateMasterModel.store(data);
}

/**
 * Update shareCertificateMaster information in the database.
 *
 * @param {UpdateShareCertificateMasterBody} data - the data to update the shareCertificateMaster with
 * @param {number} id - the id of the shareCertificateMaster to update
 * @return {Promise<ShareCertificateMasterType>} the updated shareCertificateMaster information
 */
export async function updateShareCertificateMaster(
  data: ShareCertificateMasterRepoUpdateType,
  id: number
): Promise<ShareCertificateMasterType | null> {
  return await shareCertificateMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<ShareCertificateMasterType[]>} the paginated shareCertificateMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<ShareCertificateMasterType[]> {
  return await shareCertificateMasterModel.paginate({
    limit,
    offset,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<ShareCertificateMasterType[]>} the paginated shareCertificateMaster data as a promise
 */
export async function getAll(
  search?: string
): Promise<ShareCertificateMasterType[]> {
  return await shareCertificateMasterModel.all({
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await shareCertificateMasterModel.totalCount({
    search,
  });
}

/**
 * Retrieves shareCertificateMaster data by the given ID.
 *
 * @param {number} id - The ID of the shareCertificateMaster to retrieve
 * @return {Promise<ShareCertificateMasterType|null>} The shareCertificateMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<ShareCertificateMasterType | null> {
  return await shareCertificateMasterModel.findById(id);
}

/**
 * Removes a shareCertificateMaster from the database by their ID.
 *
 * @param {number} id - the ID of the shareCertificateMaster to be removed
 * @return {Promise<ShareCertificateMasterType>} a promise that resolves once the shareCertificateMaster is removed
 */
export async function remove(
  id: number
): Promise<ShareCertificateMasterType | null> {
  return await shareCertificateMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await shareCertificateMasterModel.deleteManyByIds(ids);
  return;
}
