import {
  DividendMasterType,
  DividendMasterUpdateType,
  DividendMasterCreateType,
} from "../../@types/dividend_master.type";
import { dividendMasterModel } from "./dividend_master.model";

/**
 * Create a new dividendMaster with the provided data.
 *
 * @param {InferInsertModel<typeof dividendMaster>} data - the data for creating the dividendMaster
 * @return {Promise<DividendMasterType>} a promise that resolves to the newly created dividendMaster
 */
export async function createDividendMaster(
  data: DividendMasterCreateType & { companyMasterId: number }
): Promise<DividendMasterType> {
  return await dividendMasterModel.store(data);
}

/**
 * Update dividendMaster information in the database.
 *
 * @param {UpdateCompanyMasterBody} data - the data to update the dividendMaster with
 * @param {number} id - the id of the dividendMaster to update
 * @return {Promise<DividendMasterType>} the updated dividendMaster information
 */
export async function updateDividendMaster(
  data: DividendMasterUpdateType,
  id: number
): Promise<DividendMasterType> {
  return await dividendMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<DividendMasterType[]>} the paginated dividendMaster data as a promise
 */
export async function paginate(
  companyMasterId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<DividendMasterType[]> {
  return await dividendMasterModel.paginate({
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
 * @return {Promise<DividendMasterType[]>} the paginated dividendMaster data as a promise
 */
export async function getAll(
  companyMasterId: number,
  search?: string
): Promise<DividendMasterType[]> {
  return await dividendMasterModel.all({
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
  return await dividendMasterModel.totalCount({
    companyMasterId,
    search,
  });
}

/**
 * Retrieves dividendMaster data by the given ID.
 *
 * @param {number} id - The ID of the dividendMaster to retrieve
 * @return {Promise<DividendMasterType|null>} The dividendMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<DividendMasterType | null> {
  return await dividendMasterModel.findById(id);
}

/**
 * Retrieves dividendMaster information by companyId from the database.
 *
 * @param {number} companyId - The companyId of the dividendMaster to retrieve
 * @return {Promise<DividendMasterType | null>} The dividendMaster information if found, otherwise null
 */
export async function getByCompanyMasterId(
  companyMasterId: number
): Promise<DividendMasterType | null> {
  return await dividendMasterModel.findByCompanyMasterId(companyMasterId);
}

/**
 * Removes a dividendMaster from the database by their ID.
 *
 * @param {number} id - the ID of the dividendMaster to be removed
 * @return {Promise<DividendMasterType>} a promise that resolves once the dividendMaster is removed
 */
export async function remove(id: number): Promise<DividendMasterType> {
  return await dividendMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await dividendMasterModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<DividendMasterType[]> {
  return await dividendMasterModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await dividendMasterModel.totalCount({
    search,
  });
}
