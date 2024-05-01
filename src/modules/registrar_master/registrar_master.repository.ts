import { eq, inArray, sql } from "drizzle-orm";
import db from "../../db";
import { companyMasters } from "../../db/schema/company_master";
import {
  RegistrarMasterType,
  RegistrarMasterUpdateType,
  RegistrarMasterCreateType,
  RegistrarMasterAllType,
} from "../../@types/registrar_master.type";
import {
  Descending_RegistrarMaster_CreatedAt,
  RegistrarMasterSelect,
  Search_Query,
  Select_All_Master_Query,
  Select_Master_Query,
} from "./registrar_master.model";
import { registrarMasters } from "../../db/schema/registrar_master";

/**
 * Create a new registrarMaster with the provided data.
 *
 * @param {InferInsertModel<typeof registrarMasters>} data - the data for creating the registrarMaster
 * @return {Promise<RegistrarMasterType>} a promise that resolves to the newly created registrarMaster
 */
export async function createRegistrarMaster(
  data: RegistrarMasterCreateType & { createdBy: number }
): Promise<RegistrarMasterType> {
  const result = await db
    .insert(registrarMasters)
    .values({ ...data })
    .onConflictDoNothing()
    .returning(RegistrarMasterSelect);
  return result[0];
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
  const result = await db
    .update(registrarMasters)
    .set({ ...data })
    .where(eq(registrarMasters.id, id))
    .returning(RegistrarMasterSelect);
  return result[0];
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
  const data = await Select_Master_Query.where(
    search ? Search_Query(search) : undefined
  )
    .orderBy(Descending_RegistrarMaster_CreatedAt)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<RegistrarMasterAllType[]>} the paginated registrarMaster data as a promise
 */
export async function getAll(
  search?: string
): Promise<RegistrarMasterAllType[]> {
  const data = await Select_All_Master_Query.where(
    search ? Search_Query(search) : undefined
  ).orderBy(Descending_RegistrarMaster_CreatedAt);

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
      count: sql<number>`cast(count(${companyMasters.id}) as int)`,
    })
    .from(registrarMasters)
    .where(search ? Search_Query(search) : undefined);

  return data[0].count;
}

/**
 * Retrieves registrarMaster data by the given ID.
 *
 * @param {number} id - The ID of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterType|null>} The registrarMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<RegistrarMasterType | null> {
  const data = await Select_Master_Query.where(eq(registrarMasters.id, id));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a registrarMaster from the database by their ID.
 *
 * @param {number} id - the ID of the registrarMaster to be removed
 * @return {Promise<RegistrarMasterType>} a promise that resolves once the registrarMaster is removed
 */
export async function remove(id: number): Promise<RegistrarMasterType> {
  const res = await getById(id);
  const result = await db
    .delete(registrarMasters)
    .where(eq(registrarMasters.id, id))
    .returning(RegistrarMasterSelect);
  if (res) {
    return res;
  }
  return result[0];
}

export async function removeMultiple(
  ids: number[]
): Promise<RegistrarMasterType[]> {
  const result = await db
    .delete(registrarMasters)
    .where(inArray(registrarMasters.id, ids))
    .returning(RegistrarMasterSelect);
  return result;
}
