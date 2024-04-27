import { desc, eq, inArray, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import db from "../../db";
import { pincodes } from "../../db/schema/pincode";
import { PincodeType } from "../../@types/pincode.type";
import { UpdatePincodeBody } from "./schemas/update.schema";
import {
  Descending_Pincode_ID,
  Search_Query,
  Select_Query,
  PincodeSelect,
} from "./pincode.model";

/**
 * Create a new pincode with the provided data.
 *
 * @param {InferInsertModel<typeof pincodes>} data - the data for creating the pincode
 * @return {Promise<PincodeType>} a promise that resolves to the newly created pincode
 */
export async function createPincode(
  data: InferInsertModel<typeof pincodes>
): Promise<PincodeType> {
  const result = await db
    .insert(pincodes)
    .values(data)
    .onConflictDoNothing()
    .returning(PincodeSelect);
  return result[0];
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
  const result = await db
    .update(pincodes)
    .set(data)
    .where(eq(pincodes.id, id))
    .returning(PincodeSelect);
  return result[0];
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
  const data = await Select_Query.where(
    search ? Search_Query(search) : undefined
  )
    .orderBy(Descending_Pincode_ID)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the number of items to skip before starting to return data
 * @return {Promise<PincodeType[]>} the paginated pincode data as a promise
 */
export async function getAll(search?: string): Promise<PincodeType[]> {
  const data = await Select_Query.where(
    search ? Search_Query(search) : undefined
  ).orderBy(Descending_Pincode_ID);

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
      count: sql<number>`cast(count(${pincodes.id}) as int)`,
    })
    .from(pincodes)
    .where(search ? Search_Query(search) : undefined);

  return data[0].count;
}

/**
 * Retrieves pincode data by the given ID.
 *
 * @param {number} id - The ID of the pincode to retrieve
 * @return {Promise<PincodeType|null>} The pincode data if found, otherwise null
 */
export async function getById(id: number): Promise<PincodeType | null> {
  const data = await Select_Query.where(eq(pincodes.id, id));
  if (data.length > 0) {
    return data[0];
  }
  return null;
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
  const data = await Select_Query.where(eq(pincodes.pincode, pincode));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a pincode from the database by their ID.
 *
 * @param {number} id - the ID of the pincode to be removed
 * @return {Promise<PincodeType>} a promise that resolves once the pincode is removed
 */
export async function remove(id: number): Promise<PincodeType> {
  const result = await db
    .delete(pincodes)
    .where(eq(pincodes.id, id))
    .returning(PincodeSelect);
  return result[0];
}

export async function removeMultiple(ids: number[]): Promise<PincodeType[]> {
  const result = await db
    .delete(pincodes)
    .where(inArray(pincodes.id, ids))
    .returning(PincodeSelect);
  return result;
}

export async function getAllDistinct(search?: string): Promise<
  {
    id: number;
    pincode: string;
    state_name: string;
  }[]
> {
  const data = await db
    .selectDistinctOn([pincodes.pincode], {
      id: pincodes.id,
      pincode: pincodes.pincode,
      state_name: pincodes.state_name,
    })
    .from(pincodes)
    .where(search ? Search_Query(search) : undefined)
    .orderBy(desc(pincodes.pincode));

  return data;
}
