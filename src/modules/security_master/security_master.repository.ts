import {
  SecurityMasterRepoCreateType,
  SecurityMasterRepoUpdateType,
  SecurityMasterType,
} from "../../@types/security_master.type";
import { securityMasterModel } from "./security_master.model";

/**
 * Create a new securityMaster with the provided data.
 *
 * @param {SecurityMasterRepoCreateType} data - the data for creating the securityMaster
 * @return {Promise<SecurityMasterType>} a promise that resolves to the newly created securityMaster
 */
export async function createSecurityMaster(
  data: SecurityMasterRepoCreateType
): Promise<SecurityMasterType | null> {
  return await securityMasterModel.store(data);
}

/**
 * Update securityMaster information in the database.
 *
 * @param {UpdateSecurityMasterBody} data - the data to update the securityMaster with
 * @param {number} id - the id of the securityMaster to update
 * @return {Promise<SecurityMasterType>} the updated securityMaster information
 */
export async function updateSecurityMaster(
  data: SecurityMasterRepoUpdateType,
  id: number
): Promise<SecurityMasterType | null> {
  return await securityMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<SecurityMasterType[]>} the paginated securityMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<SecurityMasterType[]> {
  return await securityMasterModel.paginate({
    limit,
    offset,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<SecurityMasterType[]>} the paginated securityMaster data as a promise
 */
export async function getAll(search?: string): Promise<SecurityMasterType[]> {
  return await securityMasterModel.all({
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await securityMasterModel.totalCount({
    search,
  });
}

/**
 * Retrieves securityMaster data by the given ID.
 *
 * @param {number} id - The ID of the securityMaster to retrieve
 * @return {Promise<SecurityMasterType|null>} The securityMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<SecurityMasterType | null> {
  return await securityMasterModel.findById(id);
}

/**
 * Removes a securityMaster from the database by their ID.
 *
 * @param {number} id - the ID of the securityMaster to be removed
 * @return {Promise<SecurityMasterType>} a promise that resolves once the securityMaster is removed
 */
export async function remove(id: number): Promise<SecurityMasterType | null> {
  return await securityMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await securityMasterModel.deleteManyByIds(ids);
  return;
}
