import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import db from "../../db";
import { failedExcels } from "../../db/schema/failed_excel";

export type FailedExcel = {
  id: number;
  file_name: string;
  file_of: string;
  createdAt: Date | null;
};

const FailedExcelSelect = {
  id: failedExcels.id,
  file_name: failedExcels.file_name,
  file_of: failedExcels.file_of,
  createdAt: failedExcels.createdAt,
};

/**
 * Create a new user with the provided data.
 *
 * @param {InferInsertModel<typeof failedExcels>} data - the data for creating the user
 * @return {Promise<FailedExcel>} a promise that resolves to the newly created user
 */
export async function createFailedExcel(
  data: InferInsertModel<typeof failedExcels>
): Promise<FailedExcel> {
  const result = await db
    .insert(failedExcels)
    .values(data)
    .onConflictDoNothing()
    .returning(FailedExcelSelect);
  return result[0];
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
  const result = await db
    .update(failedExcels)
    .set(data)
    .where(eq(failedExcels.id, id))
    .returning(FailedExcelSelect);
  return result[0];
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
  const data = await db
    .select(FailedExcelSelect)
    .from(failedExcels)
    .where(
      search
        ? and(
            eq(failedExcels.createdBy, userId),
            or(
              ilike(failedExcels.file_name, `%${search}%`),
              ilike(failedExcels.file_of, `%${search}%`)
            )
          )
        : eq(failedExcels.createdBy, userId)
    )
    .orderBy(desc(failedExcels.id))
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(userId: number, search?: string): Promise<number> {
  const data = await db
    .select({
      count: sql<number>`cast(count(${failedExcels.id}) as int)`,
    })
    .from(failedExcels)
    .where(
      search
        ? and(
            eq(failedExcels.createdBy, userId),
            or(
              ilike(failedExcels.file_name, `%${search}%`),
              ilike(failedExcels.file_of, `%${search}%`)
            )
          )
        : eq(failedExcels.createdBy, userId)
    );

  return data[0].count;
}

/**
 * Retrieves user data by the given ID.
 *
 * @param {number} id - The ID of the user to retrieve
 * @return {Promise<FailedExcel|null>} The user data if found, otherwise null
 */
export async function getById(id: number): Promise<FailedExcel | null> {
  const data = await db
    .select(FailedExcelSelect)
    .from(failedExcels)
    .where(eq(failedExcels.id, id));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a user from the database by their ID.
 *
 * @param {number} id - the ID of the user to be removed
 * @return {Promise<FailedExcel>} a promise that resolves once the user is removed
 */
export async function remove(id: number): Promise<FailedExcel> {
  const result = await db
    .delete(failedExcels)
    .where(eq(failedExcels.id, id))
    .returning(FailedExcelSelect);
  return result[0];
}

export async function removeByFileName(
  file_name: string
): Promise<FailedExcel> {
  const result = await db
    .delete(failedExcels)
    .where(eq(failedExcels.file_name, file_name))
    .returning(FailedExcelSelect);
  return result[0];
}
