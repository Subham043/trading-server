import { PincodeRepoCreateType, PincodeType } from "../../@types/pincode.type";
import { UpdatePincodeBody } from "./schemas/update.schema";
import { pincodesModel } from "./pincode.model";
import { Prisma } from "@prisma/client";

/**
 * Create a new pincode with the provided data.
 *
 * @param {PincodeRepoCreateType} data - the data for creating the pincode
 * @return {Promise<PincodeType>} a promise that resolves to the newly created pincode
 */
export async function createPincode(
  data: PincodeRepoCreateType
): Promise<PincodeType> {
  return await pincodesModel.store(data);
}

/**
 * Update pincode information in the database.
 *
 * @param {UpdatePincodeBody} data - the data to update the pincode with
 * @param {number} id - the id of the pincode to update
 * @return {Promise<PincodeType>} the updated pincode information
 */
export async function updatePincode(
  data: Omit<UpdatePincodeBody, "id" | "createdAt">,
  id: number
): Promise<PincodeType> {
  return await pincodesModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<PincodeType[]>} the paginated pincode data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<PincodeType[]> {
  return await pincodesModel.paginate(limit, offset, search);
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the number of items to skip before starting to return data
 * @return {Promise<PincodeType[]>} the paginated pincode data as a promise
 */
export async function getAll(search?: string): Promise<PincodeType[]> {
  return await pincodesModel.all(search);
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await pincodesModel.totalCount(search);
}

/**
 * Retrieves pincode data by the given ID.
 *
 * @param {number} id - The ID of the pincode to retrieve
 * @return {Promise<PincodeType|null>} The pincode data if found, otherwise null
 */
export async function getById(id: number): Promise<PincodeType | null> {
  return await pincodesModel.findById(id);
}

/**
 * Retrieves pincode information by pincode from the database.
 *
 * @param {string} pincode - The pincode of the pincode to retrieve
 * @return {Promise<PincodeType | null>} The pincode information if found, otherwise null
 */
export async function getByPincode(
  pincode: string
): Promise<PincodeType | null> {
  return await pincodesModel.findByPincode(pincode);
}

/**
 * Removes a pincode from the database by their ID.
 *
 * @param {number} id - the ID of the pincode to be removed
 * @return {Promise<PincodeType>} a promise that resolves once the pincode is removed
 */
export async function remove(id: number): Promise<PincodeType> {
  return await pincodesModel.deleteById(id);
}

export async function removeMultiple(
  ids: number[]
): Promise<Prisma.BatchPayload> {
  return await pincodesModel.deleteManyByIds(ids);
}

export async function getAllDistinct(search?: string): Promise<
  {
    id: number;
    pincode: string;
    state_name: string;
  }[]
> {
  return await pincodesModel.allDistinctPincodes(search);
}
