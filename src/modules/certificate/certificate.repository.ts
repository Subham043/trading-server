import {
  CertificateType,
  CertificateUpdateType,
  CertificateCreateType,
} from "../../@types/certificate.type";
import { certificateModel } from "./certificate.model";

/**
 * Create a new folio with the provided data.
 *
 * @param {InferInsertModel<typeof folio>} data - the data for creating the folio
 * @return {Promise<CertificateType>} a promise that resolves to the newly created folio
 */
export async function createCertificate(
  data: CertificateCreateType & { folioId: number }
): Promise<CertificateType> {
  return await certificateModel.store(data);
}

/**
 * Update folio information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the folio with
 * @param {number} id - the id of the folio to update
 * @return {Promise<CertificateType>} the updated folio information
 */
export async function updateCertificate(
  data: CertificateUpdateType,
  id: number
): Promise<CertificateType> {
  return await certificateModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CertificateType[]>} the paginated folio data as a promise
 */
export async function paginate(
  folioId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<CertificateType[]> {
  return await certificateModel.paginate({
    limit,
    offset,
    folioId,
    search,
  });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<CertificateType[]>} the paginated folio data as a promise
 */
export async function getAll(
  folioId: number,
  search?: string
): Promise<CertificateType[]> {
  return await certificateModel.all({
    folioId,
    search,
  });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  folioId: number,
  search?: string
): Promise<number> {
  return await certificateModel.totalCount({
    folioId,
    search,
  });
}

/**
 * Retrieves folio data by the given ID.
 *
 * @param {number} id - The ID of the folio to retrieve
 * @return {Promise<CertificateType|null>} The folio data if found, otherwise null
 */
export async function getById(id: number): Promise<CertificateType | null> {
  return await certificateModel.findById(id);
}

/**
 * Retrieves folio information by folioId from the database.
 *
 * @param {number} folioId - The folioId of the folio to retrieve
 * @return {Promise<CertificateType | null>} The folio information if found, otherwise null
 */
export async function getByFolioId(
  folioId: number
): Promise<{
  id: number;
  certificateNumber: string;
  folioID: number | null;
  createdAt: Date;
} | null> {
  return await certificateModel.findByFolioId(folioId);
}

/**
 * Removes a folio from the database by their ID.
 *
 * @param {number} id - the ID of the folio to be removed
 * @return {Promise<CertificateType>} a promise that resolves once the folio is removed
 */
export async function remove(id: number): Promise<CertificateType> {
  return await certificateModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await certificateModel.deleteManyByIds(ids);
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<CertificateType[]> {
  return await certificateModel.paginate({
    limit,
    offset,
    search,
  });
}

export async function countAll(search?: string): Promise<number> {
  return await certificateModel.totalCount({
    search,
  });
}
