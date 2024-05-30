import { prisma } from "../../db";
import { Prisma } from "@prisma/client";
import { FailedExcel, failedExcelModel } from "./failedExcel.model";

/**
 * Create a new user with the provided data.
 *
 * @param {InferInsertModel<typeof failedExcels>} data - the data for creating the user
 * @return {Promise<FailedExcel>} a promise that resolves to the newly created user
 */
export async function createFailedExcel(
  data: Prisma.Args<typeof prisma.failedExcel, "create">["data"]
): Promise<FailedExcel> {
  return await failedExcelModel.store(data);
}

/**
 * Update user information in the database.
 *
 * @param {Omit<FailedExcel, "id"|"createdAt">} data - the data to update the user with
 * @param {number} id - the id of the user to update
 * @return {Promise<FailedExcel>} the updated user information
 */
export async function updateFailedExcel(
  data: Omit<FailedExcel, "id" | "createdAt">,
  id: number
): Promise<FailedExcel> {
  return await failedExcelModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<FailedExcel[]>} the paginated user data as a promise
 */
export async function paginate(
  userId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<FailedExcel[]> {
  return await failedExcelModel.paginate(userId, limit, offset, search);
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(userId: number, search?: string): Promise<number> {
  return await failedExcelModel.totalCount(userId, search);
}

/**
 * Retrieves user data by the given ID.
 *
 * @param {number} id - The ID of the user to retrieve
 * @return {Promise<FailedExcel|null>} The user data if found, otherwise null
 */
export async function getById(id: number): Promise<FailedExcel | null> {
  return await failedExcelModel.findById(id);
}

/**
 * Removes a user from the database by their ID.
 *
 * @param {number} id - the ID of the user to be removed
 * @return {Promise<FailedExcel>} a promise that resolves once the user is removed
 */
export async function remove(id: number): Promise<FailedExcel> {
  return await failedExcelModel.deleteById(id);
}

export async function removeByFileName(
  file_name: string
): Promise<FailedExcel | null> {
  return await failedExcelModel.deleteByFileName(file_name);
}
