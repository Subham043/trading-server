import {
  StageNameUpdateType,
  StageNameCreateType,
  StageNameType,
} from "../../@types/stage_name.type";
import { stageNameModel } from "./stageName.model";

/**
 * Create a new project with the provided data.
 *
 * @param {InferInsertModel<typeof projects>} data - the data for creating the project
 * @return {Promise<StageNameType>} a promise that resolves to the newly created project
 */
export async function createStageName(
  data: StageNameCreateType
): Promise<StageNameType | null> {
  try {
    return await stageNameModel.store(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update project information in the database.
 *
 * @param {UpdateStageNameBody} data - the data to update the project with
 * @param {number} id - the id of the project to update
 * @return {Promise<StageNameType>} the updated project information
 */
export async function updateStageName(
  data: StageNameUpdateType,
  id: number
): Promise<StageNameType | null> {
  try {
    return await stageNameModel.updateById(data, id);
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<StageNameType[]>} the paginated project data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<StageNameType[]> {
  return await stageNameModel.paginate({ limit, offset, search });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<StageNameType[]>} the paginated project data as a promise
 */
export async function getAll(search?: string): Promise<StageNameType[]> {
  return await stageNameModel.all({ search });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await stageNameModel.totalCount({ search });
}

/**
 * Retrieves project data by the given ID.
 *
 * @param {number} id - The ID of the project to retrieve
 * @return {Promise<StageNameType|null>} The project data if found, otherwise null
 */
export async function getById(id: number): Promise<StageNameType | null> {
  return await stageNameModel.findById(id);
}

/**
 * Removes a project from the database by their ID.
 *
 * @param {number} id - the ID of the project to be removed
 * @return {Promise<StageNameType>} a promise that resolves once the project is removed
 */
export async function remove(id: number): Promise<StageNameType | null> {
  return await stageNameModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await stageNameModel.deleteManyByIds(ids);
}
