import {
  LegalHeirDetailRepoCreateType,
  LegalHeirDetailRepoUpdateType,
  LegalHeirDetailType,
} from "../../@types/legal_heir_detail.type";
import { legalHeirDetailModel } from "./legal_heir_detail.model";

/**
 * Create a new project with the provided data.
 *
 * @param {LegalHeirDetailRepoCreateType} data - the data for creating the project
 * @return {Promise<LegalHeirDetailType>} a promise that resolves to the newly created project
 */
export async function createLegalHeirDetail(
  data: LegalHeirDetailRepoCreateType
): Promise<LegalHeirDetailType | null> {
  return await legalHeirDetailModel.store(data);
}

/**
 * Update project information in the database.
 *
 * @param {UpdateLegalHeirDetailBody} data - the data to update the project with
 * @param {number} id - the id of the project to update
 * @return {Promise<LegalHeirDetailType>} the updated project information
 */
export async function updateLegalHeirDetail(
  data: LegalHeirDetailRepoUpdateType,
  id: number
): Promise<LegalHeirDetailType | null> {
  return await legalHeirDetailModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<LegalHeirDetailType[]>} the paginated project data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  projectID: number,
  search?: string
): Promise<LegalHeirDetailType[]> {
  return await legalHeirDetailModel.paginate({
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
 * @return {Promise<LegalHeirDetailType[]>} the paginated project data as a promise
 */
export async function getAll(
  projectID: number,
  search?: string
): Promise<LegalHeirDetailType[]> {
  return await legalHeirDetailModel.all({
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
  return await legalHeirDetailModel.totalCount({
    search,
    projectID,
  });
}

/**
 * Retrieves project data by the given ID.
 *
 * @param {number} id - The ID of the project to retrieve
 * @return {Promise<LegalHeirDetailType|null>} The project data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<LegalHeirDetailType | null> {
  return await legalHeirDetailModel.findById(id);
}

/**
 * Removes a project from the database by their ID.
 *
 * @param {number} id - the ID of the project to be removed
 * @return {Promise<LegalHeirDetailType>} a promise that resolves once the project is removed
 */
export async function remove(
  id: number
): Promise<LegalHeirDetailType | null> {
  return await legalHeirDetailModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await legalHeirDetailModel.deleteManyByIds(ids);
  return;
}
