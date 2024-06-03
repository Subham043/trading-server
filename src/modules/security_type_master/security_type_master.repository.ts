import {
  SecurityTypeMasterRepoCreateType,
  SecurityTypeMasterRepoUpdateType,
  SecurityTypeMasterType,
} from "../../@types/security_type_master.type";
import { securityTypeMasterModel } from "./security_type_master.model";

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {SecurityTypeMasterRepoCreateType} data - the data for creating the companyMaster
 * @return {Promise<SecurityTypeMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createSecurityTypeMaster(
  data: SecurityTypeMasterRepoCreateType
): Promise<SecurityTypeMasterType | null> {
  return await securityTypeMasterModel.store(data);
}

/**
 * Update companyMaster information in the database.
 *
 * @param {UpdateSecurityTypeMasterBody} data - the data to update the companyMaster with
 * @param {number} id - the id of the companyMaster to update
 * @return {Promise<SecurityTypeMasterType>} the updated companyMaster information
 */
export async function updateSecurityTypeMaster(
  data: SecurityTypeMasterRepoUpdateType,
  id: number
): Promise<SecurityTypeMasterType | null> {
  return await securityTypeMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<SecurityTypeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<SecurityTypeMasterType[]> {
  return await securityTypeMasterModel.paginate({
    limit,
    offset,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<SecurityTypeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function getAll(
  search?: string
): Promise<SecurityTypeMasterType[]> {
  return await securityTypeMasterModel.all({
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await securityTypeMasterModel.totalCount({
    search,
  });
}

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<SecurityTypeMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<SecurityTypeMasterType | null> {
  return await securityTypeMasterModel.findById(id);
}

/**
 * Removes a companyMaster from the database by their ID.
 *
 * @param {number} id - the ID of the companyMaster to be removed
 * @return {Promise<SecurityTypeMasterType>} a promise that resolves once the companyMaster is removed
 */
export async function remove(
  id: number
): Promise<SecurityTypeMasterType | null> {
  return await securityTypeMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await securityTypeMasterModel.deleteManyByIds(ids);
  return;
}
