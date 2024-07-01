import {
  FolioType,
  FolioUpdateType,
  FolioCreateType,
} from "../../@types/folio.type";
import { folioModel } from "./folio.model";

/**
 * Create a new folio with the provided data.
 *
 * @param {InferInsertModel<typeof folio>} data - the data for creating the folio
 * @return {Promise<FolioType>} a promise that resolves to the newly created folio
 */
export async function createFolio(
  data: FolioCreateType & { shareCertificateId: number }
): Promise<FolioType> {
  return await folioModel.store(data);
}

/**
 * Update folio information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the folio with
 * @param {number} id - the id of the folio to update
 * @return {Promise<FolioType>} the updated folio information
 */
export async function updateFolio(
  data: FolioUpdateType,
  id: number
): Promise<FolioType> {
  return await folioModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<FolioType[]>} the paginated folio data as a promise
 */
export async function paginate(
  shareCertificateId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<FolioType[]> {
  return await folioModel.paginate({
    limit,
    offset,
    shareCertificateId,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<FolioType[]>} the paginated folio data as a promise
 */
export async function getAll(
  shareCertificateId: number,
  search?: string
): Promise<FolioType[]> {
  return await folioModel.all({
    shareCertificateId,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  shareCertificateId: number,
  search?: string
): Promise<number> {
  return await folioModel.totalCount({
    shareCertificateId,
    search,
  });
}

/**
 * Retrieves folio data by the given ID.
 *
 * @param {number} id - The ID of the folio to retrieve
 * @return {Promise<FolioType|null>} The folio data if found, otherwise null
 */
export async function getById(id: number): Promise<FolioType | null> {
  return await folioModel.findById(id);
}

/**
 * Retrieves folio information by shareCertificateId from the database.
 *
 * @param {number} shareCertificateId - The shareCertificateId of the folio to retrieve
 * @return {Promise<FolioType | null>} The folio information if found, otherwise null
 */
export async function getByShareCertificateMasterId(
  shareCertificateId: number
): Promise<{
  id: number;
  Folio: string | null;
  shareCertificateID: number | null;
  createdAt: Date;
} | null> {
  return await folioModel.findByShareCertificateMasterId(shareCertificateId);
}

/**
 * Removes a folio from the database by their ID.
 *
 * @param {number} id - the ID of the folio to be removed
 * @return {Promise<FolioType>} a promise that resolves once the folio is removed
 */
export async function remove(id: number): Promise<FolioType> {
  return await folioModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await folioModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<FolioType[]> {
  return await folioModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await folioModel.totalCount({
    search,
  });
}
