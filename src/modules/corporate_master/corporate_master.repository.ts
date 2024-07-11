import {
  CorporateMasterType,
  CorporateMasterUpdateType,
  CorporateMasterCreateType,
} from "../../@types/corporate_master.type";
import { corporateMasterModel } from "./corporate_master.model";

/**
 * Create a new corporateMaster with the provided data.
 *
 * @param {InferInsertModel<typeof corporateMaster>} data - the data for creating the corporateMaster
 * @return {Promise<CorporateMasterType>} a promise that resolves to the newly created corporateMaster
 */
export async function createCorporateMaster(
  data: CorporateMasterCreateType & { companyMasterId: number }
): Promise<CorporateMasterType> {
  return await corporateMasterModel.store(data);
}

/**
 * Update corporateMaster information in the database.
 *
 * @param {UpdateCompanyMasterBody} data - the data to update the corporateMaster with
 * @param {number} id - the id of the corporateMaster to update
 * @return {Promise<CorporateMasterType>} the updated corporateMaster information
 */
export async function updateCorporateMaster(
  data: CorporateMasterUpdateType,
  id: number
): Promise<CorporateMasterType> {
  return await corporateMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CorporateMasterType[]>} the paginated corporateMaster data as a promise
 */
export async function paginate(
  companyMasterId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<CorporateMasterType[]> {
  return await corporateMasterModel.paginate({
    limit,
    offset,
    companyMasterId,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<CorporateMasterType[]>} the paginated corporateMaster data as a promise
 */
export async function getAll(
  companyMasterId: number,
  search?: string
): Promise<CorporateMasterType[]> {
  return await corporateMasterModel.all({
    companyMasterId,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  companyMasterId: number,
  search?: string
): Promise<number> {
  return await corporateMasterModel.totalCount({
    companyMasterId,
    search,
  });
}

/**
 * Retrieves corporateMaster data by the given ID.
 *
 * @param {number} id - The ID of the corporateMaster to retrieve
 * @return {Promise<CorporateMasterType|null>} The corporateMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<CorporateMasterType | null> {
  return await corporateMasterModel.findById(id);
}

/**
 * Retrieves corporateMaster information by companyId from the database.
 *
 * @param {number} companyId - The companyId of the corporateMaster to retrieve
 * @return {Promise<CorporateMasterType | null>} The corporateMaster information if found, otherwise null
 */
export async function getByCompanyMasterId(
  companyMasterId: number
): Promise<CorporateMasterType | null> {
  return await corporateMasterModel.findByCompanyMasterId(companyMasterId);
}

/**
 * Removes a corporateMaster from the database by their ID.
 *
 * @param {number} id - the ID of the corporateMaster to be removed
 * @return {Promise<CorporateMasterType>} a promise that resolves once the corporateMaster is removed
 */
export async function remove(id: number): Promise<CorporateMasterType> {
  return await corporateMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await corporateMasterModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<CorporateMasterType[]> {
  return await corporateMasterModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await corporateMasterModel.totalCount({
    search,
  });
}
