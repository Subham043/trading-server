import {
  ProjectUpdateType,
  ProjectCreateType,
  ProjectType,
} from "../../@types/project.type";
import { projectModel } from "./project.model";

/**
 * Create a new project with the provided data.
 *
 * @param {InferInsertModel<typeof projects>} data - the data for creating the project
 * @return {Promise<ProjectType>} a promise that resolves to the newly created project
 */
export async function createProject(
  data: ProjectCreateType & { createdBy: number }
): Promise<ProjectType | null> {
  try {
    return await projectModel.store(data);
  } catch (error) {
    throw error;
  }
}

/**
 * Update project information in the database.
 *
 * @param {UpdateProjectBody} data - the data to update the project with
 * @param {number} id - the id of the project to update
 * @return {Promise<ProjectType>} the updated project information
 */
export async function updateProject(
  data: ProjectUpdateType,
  id: number
): Promise<ProjectType | null> {
  try {
    return await projectModel.updateById(data, id);
  } catch (error) {
    throw error;
  }
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<ProjectType[]>} the paginated project data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<ProjectType[]> {
  return await projectModel.paginate({ limit, offset, search });
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<ProjectType[]>} the paginated project data as a promise
 */
export async function getAll(search?: string): Promise<ProjectType[]> {
  return await projectModel.all({ search });
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await projectModel.totalCount({ search });
}

/**
 * Retrieves project data by the given ID.
 *
 * @param {number} id - The ID of the project to retrieve
 * @return {Promise<ProjectType|null>} The project data if found, otherwise null
 */
export async function getById(id: number): Promise<ProjectType | null> {
  return await projectModel.findById(id);
}

/**
 * Removes a project from the database by their ID.
 *
 * @param {number} id - the ID of the project to be removed
 * @return {Promise<ProjectType>} a promise that resolves once the project is removed
 */
export async function remove(id: number): Promise<ProjectType | null> {
  return await projectModel.deleteById(id);
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await projectModel.deleteManyByIds(ids);
}
