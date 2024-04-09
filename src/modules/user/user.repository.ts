import { eq, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import db from "../../db";
import { users } from "../../db/schema/user";
import { UserType } from "../../@types/user.type";
import { UpdateUserBody } from "./schemas/update.schema";
import {
  Descending_User_ID,
  Search_Query,
  Select_Query,
  UserSelect,
} from "./user.model";

/**
 * Create a new user with the provided data.
 *
 * @param {InferInsertModel<typeof users>} data - the data for creating the user
 * @return {Promise<UserType>} a promise that resolves to the newly created user
 */
export async function createUser(
  data: InferInsertModel<typeof users>
): Promise<UserType> {
  const result = await db
    .insert(users)
    .values(data)
    .onConflictDoNothing()
    .returning(UserSelect);
  return result[0];
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
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning(UserSelect);
  return result[0];
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
  const data = await Select_Query.where(
    search ? Search_Query(search) : undefined
  )
    .orderBy(Descending_User_ID)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the number of items to skip before starting to return data
 * @return {Promise<UserType[]>} the paginated user data as a promise
 */
export async function getAll(search?: string): Promise<UserType[]> {
  const data = await Select_Query.where(
    search ? Search_Query(search) : undefined
  ).orderBy(Descending_User_ID);

  return data;
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
  const data = await db
    .select({
      count: sql<number>`cast(count(${users.id}) as int)`,
    })
    .from(users)
    .where(search ? Search_Query(search) : undefined);

  return data[0].count;
}

/**
 * Retrieves user data by the given ID.
 *
 * @param {number} id - The ID of the user to retrieve
 * @return {Promise<UserType|null>} The user data if found, otherwise null
 */
export async function getById(id: number): Promise<UserType | null> {
  const data = await Select_Query.where(eq(users.id, id));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Retrieves user information by email from the database.
 *
 * @param {string} email - The email of the user to retrieve
 * @return {Promise<UserType | null>} The user information if found, otherwise null
 */
export async function getByEmail(email: string): Promise<UserType | null> {
  const data = await Select_Query.where(eq(users.email, email));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a user from the database by their ID.
 *
 * @param {number} id - the ID of the user to be removed
 * @return {Promise<UserType>} a promise that resolves once the user is removed
 */
export async function remove(id: number): Promise<UserType> {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning(UserSelect);
  return result[0];
}
