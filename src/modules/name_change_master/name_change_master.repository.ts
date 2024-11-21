import { Decimal } from "@prisma/client/runtime/library";
import { CompanyMasterQueryType } from "../../@types/company_master.type";
import {
  NameChangeMasterRepoCreateType,
  NameChangeMasterRepoUpdateType,
  NameChangeMasterType,
} from "../../@types/name_change_master.type";
import { companyMasterModel } from "../company_master/company_master.model";
import { nameChangeMasterModel } from "./name_change_master.model";

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {NameChangeMasterRepoCreateType} data - the data for creating the companyMaster
 * @return {Promise<NameChangeMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createNameChangeMaster(
  data: NameChangeMasterRepoCreateType
): Promise<NameChangeMasterType> {
  return await nameChangeMasterModel.store(data);
}

/**
 * Update companyMaster information in the database.
 *
 * @param {UpdateNameChangeMasterBody} data - the data to update the companyMaster with
 * @param {number} id - the id of the companyMaster to update
 * @return {Promise<NameChangeMasterType>} the updated companyMaster information
 */
export async function updateNameChangeMaster(
  data: NameChangeMasterRepoUpdateType,
  id: number
): Promise<NameChangeMasterType> {
  return await nameChangeMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<NameChangeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  companyID: number,
  search?: string
): Promise<NameChangeMasterType[]> {
  return await nameChangeMasterModel.paginate({
    limit,
    offset,
    companyID,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<NameChangeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function getAll(
  companyID: number,
  search?: string
): Promise<NameChangeMasterType[]> {
  return await nameChangeMasterModel.all({
    companyID,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  companyID: number,
  search?: string
): Promise<number> {
  return await nameChangeMasterModel.totalCount({
    companyID,
    search,
  });
}

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<NameChangeMasterType | null> {
  return await nameChangeMasterModel.findById(id);
}

/**
 * Retrieves companyMaster information by CIN from the database.
 *
 * @param {string} CIN - The CIN of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByNSE(
  NSE: string
): Promise<NameChangeMasterType | null> {
  return await nameChangeMasterModel.findByNSE(NSE);
}

/**
 * Retrieves companyMaster information by ISIN from the database.
 *
 * @param {string} ISIN - The ISIN of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByBSE(
  BSE: string
): Promise<NameChangeMasterType | null> {
  return await nameChangeMasterModel.findByBSE(BSE);
}

/**
 * Removes a companyMaster from the database by their ID.
 *
 * @param {number} id - the ID of the companyMaster to be removed
 * @return {Promise<NameChangeMasterType>} a promise that resolves once the companyMaster is removed
 */
export async function remove(id: number): Promise<NameChangeMasterType> {
  return await nameChangeMasterModel.deleteById(id);
}

export async function removeMultiple(
  ids: number[],
  companyID: number
): Promise<void> {
  await nameChangeMasterModel.deleteManyByIds(ids, companyID);
  return;
}

export async function paginateCompany(
  limit: number,
  offset: number,
  search?: string
): Promise<CompanyMasterQueryType[]> {
  return await companyMasterModel.paginate({
    limit,
    offset,
    search,
    isNameChangeMaster: true,
  });
}

export async function getAllCompany(
  search?: string
): Promise<CompanyMasterQueryType[]> {
  return await companyMasterModel.all({ search, isNameChangeMaster: true });
}

export async function countCompany(search?: string): Promise<number> {
  return await companyMasterModel.totalCount({
    search,
    isNameChangeMaster: true,
  });
}

export async function getByCompanyId(companyId: number): Promise<
  | (NameChangeMasterType & {
      companyMaster: {
        CIN: string | null;
        ISIN: string | null;
        faceValue: Decimal | null;
        id: number;
      } | null;
    })
  | null
> {
  const data = await nameChangeMasterModel.findByCompanyId(companyId);
  if (data) {
    return data;
  }
  return {
    id: 0,
    NSE: undefined,
    BSE: undefined,
    currentName: undefined,
    previousName: undefined,
    dateNameChange: new Date(),
    companyID: companyId,
    createdAt: new Date(),
    companyMaster: null,
  };
}
