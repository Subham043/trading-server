import {
  CompanyMasterUpdateType,
  CompanyMasterCreateType,
  CompanyMasterQueryType,
} from "../../@types/company_master.type";
import {
  CompanyMasterExcelUpdateRepoData,
  companyMasterModel,
} from "./company_master.model";

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {InferInsertModel<typeof companyMasters>} data - the data for creating the companyMaster
 * @return {Promise<CompanyMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createCompanyMaster(
  data: CompanyMasterCreateType & { createdBy: number }
): Promise<CompanyMasterQueryType | null> {
  try {
    return await companyMasterModel.store(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update companyMaster information in the database.
 *
 * @param {UpdateCompanyMasterBody} data - the data to update the companyMaster with
 * @param {number} id - the id of the companyMaster to update
 * @return {Promise<CompanyMasterType>} the updated companyMaster information
 */
export async function updateCompanyMaster(
  data: CompanyMasterUpdateType,
  id: number
): Promise<CompanyMasterQueryType | null> {
  try {
    return await companyMasterModel.updateById(data, id);
  } catch (error) {
    throw error;
  }
}

export async function updateCompanyMasterImport(
  data: CompanyMasterExcelUpdateRepoData
): Promise<CompanyMasterQueryType | null> {
  try {
    return await companyMasterModel.updateCompanyMasterImport(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CompanyMasterType[]>} the paginated companyMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<CompanyMasterQueryType[]> {
  return await companyMasterModel.paginate({ limit, offset, search });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<CompanyMasterType[]>} the paginated companyMaster data as a promise
 */
export async function getAll(
  search?: string
): Promise<CompanyMasterQueryType[]> {
  return await companyMasterModel.all({ search });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await companyMasterModel.totalCount({ search });
}

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<CompanyMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<CompanyMasterQueryType | null> {
  return await companyMasterModel.findById(id);
}

/**
 * Retrieves companyMaster information by CIN from the database.
 *
 * @param {string} CIN - The CIN of the companyMaster to retrieve
 * @return {Promise<{ id: number, createdAt: Date | null } | null>} The companyMaster information if found, otherwise null
 */
export async function getByCIN(
  CIN: string
): Promise<{ id: number; createdAt: Date | null } | null> {
  return await companyMasterModel.findByCIN(CIN);
}

/**
 * Retrieves companyMaster information by ISIN from the database.
 *
 * @param {string} ISIN - The ISIN of the companyMaster to retrieve
 * @return {Promise<{ id: number, createdAt: Date | null } | null>} The companyMaster information if found, otherwise null
 */
export async function getByISIN(
  ISIN: string
): Promise<{ id: number; createdAt: Date | null } | null> {
  return await companyMasterModel.findByISIN(ISIN);
}

/**
 * Removes a companyMaster from the database by their ID.
 *
 * @param {number} id - the ID of the companyMaster to be removed
 * @return {Promise<CompanyMasterType>} a promise that resolves once the companyMaster is removed
 */
export async function remove(
  id: number
): Promise<CompanyMasterQueryType | null> {
  return await companyMasterModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await companyMasterModel.deleteManyByIds(ids);
}
