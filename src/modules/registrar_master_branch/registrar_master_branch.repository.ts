import {
  RegistrarMasterBranchType,
  RegistrarMasterBranchUpdateType,
  RegistrarMasterBranchCreateType,
} from "../../@types/registrar_master_branch.type";
import { registrarMasterBranchModel } from "./registrar_master_branch.model";

/**
 * Create a new registrarMaster with the provided data.
 *
 * @param {InferInsertModel<typeof registrarMasterBranches>} data - the data for creating the registrarMaster
 * @return {Promise<RegistrarMasterBranchType>} a promise that resolves to the newly created registrarMaster
 */
export async function createRegistrarMasterBranch(
  data: RegistrarMasterBranchCreateType & { registrarMasterId: number }
): Promise<RegistrarMasterBranchType> {
  return await registrarMasterBranchModel.store(data);
}

/**
 * Update registrarMaster information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the registrarMaster with
 * @param {number} id - the id of the registrarMaster to update
 * @return {Promise<RegistrarMasterBranchType>} the updated registrarMaster information
 */
export async function updateRegistrarMasterBranch(
  data: RegistrarMasterBranchUpdateType,
  id: number
): Promise<RegistrarMasterBranchType> {
  return await registrarMasterBranchModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<RegistrarMasterBranchType[]>} the paginated registrarMaster data as a promise
 */
export async function paginate(
  registrarMasterId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  return await registrarMasterBranchModel.paginate({
    limit,
    offset,
    registrarMasterId,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<RegistrarMasterBranchType[]>} the paginated registrarMaster data as a promise
 */
export async function getAll(
  registrarMasterId: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  return await registrarMasterBranchModel.all({
    registrarMasterId,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  registrarMasterId: number,
  search?: string
): Promise<number> {
  return await registrarMasterBranchModel.totalCount({
    registrarMasterId,
    search,
  });
}

/**
 * Retrieves registrarMaster data by the given ID.
 *
 * @param {number} id - The ID of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterBranchType|null>} The registrarMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<RegistrarMasterBranchType | null> {
  return await registrarMasterBranchModel.findById(id);
}

/**
 * Retrieves registrarMaster information by companyId from the database.
 *
 * @param {number} companyId - The companyId of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterBranchType | null>} The registrarMaster information if found, otherwise null
 */
export async function getByRegistrarMasterId(
  registrarMasterId: number
): Promise<{
  id: number;
  branch: string | null;
  registrarMasterID: number | null;
  createdAt: Date;
} | null> {
  return await registrarMasterBranchModel.findByRegistrarMasterId(
    registrarMasterId
  );
}

/**
 * Removes a registrarMaster from the database by their ID.
 *
 * @param {number} id - the ID of the registrarMaster to be removed
 * @return {Promise<RegistrarMasterBranchType>} a promise that resolves once the registrarMaster is removed
 */
export async function remove(id: number): Promise<RegistrarMasterBranchType> {
  return await registrarMasterBranchModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await registrarMasterBranchModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  return await registrarMasterBranchModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await registrarMasterBranchModel.totalCount({
    search,
  });
}
