// import {
//   ShareHolderMasterMainType,
//   ShareHolderMasterRepoCreateType,
//   ShareHolderMasterRepoUpdateType,
//   ShareHolderMasterType,
// } from "../../@types/share_holder_master.type";
// import { shareHolderMasterModel } from "./share_holder_master.model";

// /**
//  * Create a new shareHolderMaster with the provided data.
//  *
//  * @param {ShareHolderMasterRepoCreateType} data - the data for creating the shareHolderMaster
//  * @return {Promise<ShareHolderMasterType>} a promise that resolves to the newly created shareHolderMaster
//  */
// export async function createShareHolderMaster(
//   data: ShareHolderMasterRepoCreateType
// ): Promise<ShareHolderMasterType | null> {
//   return await shareHolderMasterModel.store(data);
// }

// /**
//  * Update shareHolderMaster information in the database.
//  *
//  * @param {UpdateShareHolderMasterBody} data - the data to update the shareHolderMaster with
//  * @param {number} id - the id of the shareHolderMaster to update
//  * @return {Promise<ShareHolderMasterType>} the updated shareHolderMaster information
//  */
// export async function updateShareHolderMaster(
//   data: ShareHolderMasterRepoUpdateType,
//   id: number
// ): Promise<ShareHolderMasterType | null> {
//   return await shareHolderMasterModel.updateById(data, id);
// }

// /**
//  * Asynchronously paginates the data from the database.
//  *
//  * @param {number} limit - the maximum number of items to retrieve
//  * @param {number} offset - the number of items to skip before starting to return data
//  * @return {Promise<ShareHolderMasterType[]>} the paginated shareHolderMaster data as a promise
//  */
// export async function paginate(
//   limit: number,
//   offset: number,
//   projectID: number,
//   search?: string
// ): Promise<ShareHolderMasterType[]> {
//   return await shareHolderMasterModel.paginate({
//     limit,
//     offset,
//     projectID,
//     search,
//   });
// }

// /**
//  * Asynchronously get all the data from the database.
//  *
//  * @param {string} search - the maximum number of items to retrieve
//  * @return {Promise<ShareHolderMasterType[]>} the paginated shareHolderMaster data as a promise
//  */
// export async function getAll(
//   projectID: number,
//   search?: string
// ): Promise<ShareHolderMasterType[]> {
//   return await shareHolderMasterModel.all({
//     projectID,
//     search,
//   });
// }

// /**
//  * Asynchronously counts the number of records.
//  *
//  * @return {Promise<number>} The number of records.
//  */
// export async function count(
//   projectID: number,
//   search?: string
// ): Promise<number> {
//   return await shareHolderMasterModel.totalCount({
//     search,
//     projectID,
//   });
// }

// /**
//  * Retrieves shareHolderMaster data by the given ID.
//  *
//  * @param {number} id - The ID of the shareHolderMaster to retrieve
//  * @return {Promise<ShareHolderMasterType|null>} The shareHolderMaster data if found, otherwise null
//  */
// export async function getById(
//   id: number
// ): Promise<ShareHolderMasterType | null> {
//   return await shareHolderMasterModel.findById(id);
// }

// export async function getInfoById(
//   id: number
// ): Promise<ShareHolderMasterMainType | null> {
//   return await shareHolderMasterModel.findInfoById(id);
// }

// /**
//  * Removes a shareHolderMaster from the database by their ID.
//  *
//  * @param {number} id - the ID of the shareHolderMaster to be removed
//  * @return {Promise<ShareHolderMasterType>} a promise that resolves once the shareHolderMaster is removed
//  */
// export async function remove(
//   id: number
// ): Promise<ShareHolderMasterType | null> {
//   return await shareHolderMasterModel.deleteById(id);
// }

// export async function removeMultiple(ids: number[]): Promise<void> {
//   await shareHolderMasterModel.deleteManyByIds(ids);
//   return;
// }
