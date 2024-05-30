import { UserCreateType, UserType } from "../../@types/user.type";
import { UpdateUserBody } from "./schemas/update.schema";
import { usersModel } from "./user.model";
import { Prisma } from "@prisma/client";

/**
 * Create a new user with the provided data.
 *
 * @param {UserCreateType} data - the data for creating the user
 * @return {Promise<UserType>} a promise that resolves to the newly created user
 */
export async function createUser(data: UserCreateType): Promise<UserType> {
  return await usersModel.store(data);
}

/**
 * Update user information in the database.
 *
 * @param {UpdateUserBody} data - the data to update the user with
 * @param {number} id - the id of the user to update
 * @return {Promise<UserType>} the updated user information
 */
export async function updateUser(
  data: Omit<UpdateUserBody, "confirm_password">,
  id: number
): Promise<UserType> {
  return await usersModel.updateById(data, id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<UserType[]>} the paginated user data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<UserType[]> {
  return await usersModel.paginate(limit, offset, search);
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the number of items to skip before starting to return data
 * @return {Promise<UserType[]>} the paginated user data as a promise
 */
export async function getAll(search?: string): Promise<UserType[]> {
  return await usersModel.all(search);
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  return await usersModel.totalCount(search);
}

/**
 * Retrieves user data by the given ID.
 *
 * @param {number} id - The ID of the user to retrieve
 * @return {Promise<UserType|null>} The user data if found, otherwise null
 */
export async function getById(id: number): Promise<UserType | null> {
  return await usersModel.findById(id);
}

/**
 * Retrieves user information by email from the database.
 *
 * @param {string} email - The email of the user to retrieve
 * @return {Promise<UserType | null>} The user information if found, otherwise null
 */
export async function getByEmail(email: string): Promise<UserType | null> {
  return await usersModel.findByEmail(email);
}

/**
 * Removes a user from the database by their ID.
 *
 * @param {number} id - the ID of the user to be removed
 * @return {Promise<UserType>} a promise that resolves once the user is removed
 */
export async function remove(id: number): Promise<UserType> {
  return await usersModel.deleteById(id);
}

export async function removeMultiple(
  ids: number[]
): Promise<Prisma.BatchPayload> {
  return await usersModel.deleteManyByIds(ids);
}
