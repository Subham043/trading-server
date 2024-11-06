// import {
//   LegalHeirDetailRepoCreateType,
//   LegalHeirDetailRepoUpdateType,
//   LegalHeirDetailType,
// } from "../../@types/legal_heir_detail.type";
// import { legalHeirDetailModel } from "./legal_heir_detail.model";

// /**
//  * Create a new shareHolderMaster with the provided data.
//  *
//  * @param {LegalHeirDetailRepoCreateType} data - the data for creating the shareHolderMaster
//  * @return {Promise<LegalHeirDetailType>} a promise that resolves to the newly created shareHolderMaster
//  */
// export async function createLegalHeirDetail(
//   data: LegalHeirDetailRepoCreateType
// ): Promise<LegalHeirDetailType | null> {
//   return await legalHeirDetailModel.store(data);
// }

// /**
//  * Update shareHolderMaster information in the database.
//  *
//  * @param {UpdateLegalHeirDetailBody} data - the data to update the shareHolderMaster with
//  * @param {number} id - the id of the shareHolderMaster to update
//  * @return {Promise<LegalHeirDetailType>} the updated shareHolderMaster information
//  */
// export async function updateLegalHeirDetail(
//   data: LegalHeirDetailRepoUpdateType,
//   id: number
// ): Promise<LegalHeirDetailType | null> {
//   return await legalHeirDetailModel.updateById(data, id);
// }

// /**
//  * Asynchronously paginates the data from the database.
//  *
//  * @param {number} limit - the maximum number of items to retrieve
//  * @param {number} offset - the number of items to skip before starting to return data
//  * @return {Promise<LegalHeirDetailType[]>} the paginated shareHolderMaster data as a promise
//  */
// export async function paginate(
//   limit: number,
//   offset: number,
//   shareHolderMasterID: number,
//   search?: string
// ): Promise<LegalHeirDetailType[]> {
//   return await legalHeirDetailModel.paginate({
//     limit,
//     offset,
//     shareHolderMasterID,
//     search,
//   });
// }

// /**
//  * Asynchronously get all the data from the database.
//  *
//  * @param {string} search - the maximum number of items to retrieve
//  * @return {Promise<LegalHeirDetailType[]>} the paginated shareHolderMaster data as a promise
//  */
// export async function getAll(
//   shareHolderMasterID: number,
//   search?: string
// ): Promise<LegalHeirDetailType[]> {
//   return await legalHeirDetailModel.all({
//     shareHolderMasterID,
//     search,
//   });
// }

// /**
//  * Asynchronously counts the number of records.
//  *
//  * @return {Promise<number>} The number of records.
//  */
// export async function count(
//   shareHolderMasterID: number,
//   search?: string
// ): Promise<number> {
//   return await legalHeirDetailModel.totalCount({
//     search,
//     shareHolderMasterID,
//   });
// }

// /**
//  * Retrieves shareHolderMaster data by the given ID.
//  *
//  * @param {number} id - The ID of the shareHolderMaster to retrieve
//  * @return {Promise<LegalHeirDetailType|null>} The shareHolderMaster data if found, otherwise null
//  */
// export async function getById(
//   id: number
// ): Promise<LegalHeirDetailType | null> {
//   return await legalHeirDetailModel.findById(id);
// }

// /**
//  * Removes a shareHolderMaster from the database by their ID.
//  *
//  * @param {number} id - the ID of the shareHolderMaster to be removed
//  * @return {Promise<LegalHeirDetailType>} a promise that resolves once the shareHolderMaster is removed
//  */
// export async function remove(
//   id: number
// ): Promise<LegalHeirDetailType | null> {
//   return await legalHeirDetailModel.deleteById(id);
// }

// export async function removeMultiple(ids: number[]): Promise<void> {
//   await legalHeirDetailModel.deleteManyByIds(ids);
//   return;
// }
