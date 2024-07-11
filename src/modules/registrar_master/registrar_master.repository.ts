import {
  RegistrarMasterType,
  RegistrarMasterUpdateType,
  RegistrarMasterCreateType,
  RegistrarMasterAllType,
} from "../../@types/registrar_master.type";
import { registrarMasterModel } from "./registrar_master.model";
import { Prisma } from "@prisma/client";

/**
 * Create a new registrarMaster with the provided data.
 *
 * @param {InferInsertModel<typeof registrarMasters>} data - the data for creating the registrarMaster
 * @return {Promise<RegistrarMasterType>} a promise that resolves to the newly created registrarMaster
 */
export async function createRegistrarMaster(
  data: RegistrarMasterCreateType & { createdBy: number }
): Promise<RegistrarMasterType> {
  return await registrarMasterModel.store(data);
}

/**
 * Update registrarMaster information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the registrarMaster with
 * @param {number} id - the id of the registrarMaster to update
 * @return {Promise<RegistrarMasterType>} the updated registrarMaster information
 */
export async function updateRegistrarMaster(
  data: RegistrarMasterUpdateType,
  id: number
): Promise<RegistrarMasterType> {
  return await registrarMasterModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<RegistrarMasterType[]>} the paginated registrarMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterType[]> {
  return await registrarMasterModel.paginate(limit, offset, search);
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<RegistrarMasterType[]>} the paginated registrarMaster data as a promise
 */
export async function getAll(
  search?: string
): Promise<RegistrarMasterAllType[]> {
  return await registrarMasterModel.all(search);
}

export async function excel(search?: string): Promise<
  (RegistrarMasterType & {
    registrarMasterBranches: {
      id: number;
      branch: string | null;
      city: string | null;
      state: string | null;
      pincode: string | null;
      address: string | null;
    }[];
  })[]
> {
  return await registrarMasterModel.excelQuery(search);
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await registrarMasterModel.totalCount(search);
}

/**
 * Retrieves registrarMaster data by the given ID.
 *
 * @param {number} id - The ID of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterType|null>} The registrarMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<RegistrarMasterType | null> {
  return await registrarMasterModel.findById(id);
}

/**
 * Removes a registrarMaster from the database by their ID.
 *
 * @param {number} id - the ID of the registrarMaster to be removed
 * @return {Promise<RegistrarMasterType>} a promise that resolves once the registrarMaster is removed
 */
export async function remove(id: number): Promise<RegistrarMasterType> {
  return await registrarMasterModel.deleteById(id);
}

export async function removeMultiple(
  ids: number[]
): Promise<Prisma.BatchPayload> {
  return await registrarMasterModel.deleteManyByIds(ids);
}
