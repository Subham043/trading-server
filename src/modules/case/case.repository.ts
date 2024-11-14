import {
  CaseRepoCreateType,
  CaseType,
} from "../../@types/case.type";
import { caseModel } from "./case.model";

/**
 * Create a new case with the provided data.
 *
 * @param {CaseRepoCreateType} data - the data for creating the case
 * @return {Promise<CaseType>} a promise that resolves to the newly created case
 */
export async function createCase(
  data: CaseRepoCreateType
): Promise<CaseType | null> {
  return await caseModel.store(data);
}

/**
 * Update case information in the database.
 *
 * @param {UpdateCaseBody} data - the data to update the case with
 * @param {number} id - the id of the case to update
 * @return {Promise<CaseType>} the updated case information
 */
export async function updateCase(
  data: any,
  id: number
): Promise<CaseType | null> {
  return await caseModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CaseType[]>} the paginated case data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  shareCertificateID: number,
  search?: string
): Promise<CaseType[]> {
  return await caseModel.paginate({
    limit,
    offset,
    shareCertificateID,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<CaseType[]>} the paginated case data as a promise
 */
export async function getAll(
  shareCertificateID: number,
  search?: string
): Promise<CaseType[]> {
  return await caseModel.all({
    shareCertificateID,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  shareCertificateID: number,
  search?: string
): Promise<number> {
  return await caseModel.totalCount({
    search,
    shareCertificateID,
  });
}

/**
 * Retrieves case data by the given ID.
 *
 * @param {number} id - The ID of the case to retrieve
 * @return {Promise<CaseType|null>} The case data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<CaseType | null> {
  return await caseModel.findById(id);
}

export async function getInfoById(
  id: number
): Promise<CaseType | null> {
  return await caseModel.findInfoById(id);
}

/**
 * Removes a case from the database by their ID.
 *
 * @param {number} id - the ID of the case to be removed
 * @return {Promise<CaseType>} a promise that resolves once the case is removed
 */
export async function remove(
  id: number
): Promise<CaseType | null> {
  return await caseModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await caseModel.deleteManyByIds(ids);
  return;
}
