import { and, eq, inArray, sql } from "drizzle-orm";
import db from "../../db";
import {
  RegistrarMasterBranchType,
  RegistrarMasterBranchUpdateType,
  RegistrarMasterBranchCreateType,
} from "../../@types/registrar_master_branch.type";
import {
  Search_Query,
  RegistrarMasterBranchSelect,
  Select_Master_Query,
  Descending_RegistrarMasterBranch_CreatedAt,
} from "./registrar_master_branch.model";
import { registrarMasterBranches } from "../../db/schema/registrar_master_branch";
import { registrarMasters } from "../../db/schema/registrar_master";

/**
 * Create a new registrarMaster with the provided data.
 *
 * @param {InferInsertModel<typeof registrarMasterBranches>} data - the data for creating the registrarMaster
 * @return {Promise<RegistrarMasterBranchType>} a promise that resolves to the newly created registrarMaster
 */
export async function createRegistrarMasterBranch(
  data: RegistrarMasterBranchCreateType & { registrarMasterId: number }
): Promise<RegistrarMasterBranchType> {
  const result = await db
    .insert(registrarMasterBranches)
    .values({ ...data, registrarMasterID: data.registrarMasterId })
    .onConflictDoNothing()
    .returning(RegistrarMasterBranchSelect);
  const res = await getById(result[0].id);
  if (res) {
    return res;
  }
  return result[0];
}

/**
 * Update registrarMaster information in the database.
 *
 * @param {UpdateRegistrarMasterBody} data - the data to update the registrarMaster with
 * @param {number} id - the id of the registrarMaster to update
 * @return {Promise<RegistrarMasterBranchType>} the updated registrarMaster information
 */
export async function updateRegistrarMasterBranch(
  data: RegistrarMasterBranchUpdateType,
  id: number
): Promise<RegistrarMasterBranchType> {
  const result = await db
    .update(registrarMasterBranches)
    .set({ ...data })
    .where(eq(registrarMasterBranches.id, id))
    .returning(RegistrarMasterBranchSelect);
  const res = await getById(id);
  if (res) {
    return res;
  }
  return result[0];
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<RegistrarMasterBranchType[]>} the paginated registrarMaster data as a promise
 */
export async function paginate(
  registrarMasterId: number,
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  const data = await Select_Master_Query.where(
    search
      ? and(
          eq(registrarMasterBranches.registrarMasterID, registrarMasterId),
          Search_Query(search)
        )
      : eq(registrarMasterBranches.registrarMasterID, registrarMasterId)
  )
    .orderBy(Descending_RegistrarMasterBranch_CreatedAt)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<RegistrarMasterBranchType[]>} the paginated registrarMaster data as a promise
 */
export async function getAll(
  registrarMasterId: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  const data = await Select_Master_Query.where(
    search
      ? and(
          eq(registrarMasterBranches.registrarMasterID, registrarMasterId),
          Search_Query(search)
        )
      : eq(registrarMasterBranches.registrarMasterID, registrarMasterId)
  ).orderBy(Descending_RegistrarMasterBranch_CreatedAt);

  return data;
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  registrarMasterId: number,
  search?: string
): Promise<number> {
  const data = await db
    .select({
      count: sql<number>`cast(count(${registrarMasterBranches.id}) as int)`,
    })
    .from(registrarMasterBranches)
    .leftJoin(
      registrarMasters,
      eq(registrarMasterBranches.registrarMasterID, registrarMasters.id)
    )
    .where(
      search
        ? and(
            eq(registrarMasterBranches.registrarMasterID, registrarMasterId),
            Search_Query(search)
          )
        : eq(registrarMasterBranches.registrarMasterID, registrarMasterId)
    );

  return data[0].count;
}

/**
 * Retrieves registrarMaster data by the given ID.
 *
 * @param {number} id - The ID of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterBranchType|null>} The registrarMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<RegistrarMasterBranchType | null> {
  const data = await Select_Master_Query.where(
    eq(registrarMasterBranches.id, id)
  );
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Retrieves registrarMaster information by companyId from the database.
 *
 * @param {number} companyId - The companyId of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterBranchType | null>} The registrarMaster information if found, otherwise null
 */
export async function getByRegistrarMasterId(
  registrarMasterId: number
): Promise<RegistrarMasterBranchType | null> {
  const data = await db
    .select({
      id: registrarMasterBranches.id,
      branch: registrarMasterBranches.branch,
      registrarMasterID: registrarMasterBranches.registrarMasterID,
      createdAt: registrarMasterBranches.createdAt,
    })
    .from(registrarMasterBranches)
    .where(eq(registrarMasterBranches.registrarMasterID, registrarMasterId));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a registrarMaster from the database by their ID.
 *
 * @param {number} id - the ID of the registrarMaster to be removed
 * @return {Promise<RegistrarMasterBranchType>} a promise that resolves once the registrarMaster is removed
 */
export async function remove(id: number): Promise<RegistrarMasterBranchType> {
  const res = await getById(id);
  const result = await db
    .delete(registrarMasterBranches)
    .where(eq(registrarMasterBranches.id, id))
    .returning(RegistrarMasterBranchSelect);
  if (res) {
    return res;
  }
  return result[0];
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await db
    .delete(registrarMasterBranches)
    .where(inArray(registrarMasterBranches.id, ids));
}

export async function paginateAll(
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterBranchType[]> {
  const data = await Select_Master_Query.where(
    search ? Search_Query(search) : undefined
  )
    .orderBy(Descending_RegistrarMasterBranch_CreatedAt)
    .limit(limit)
    .offset(offset);

  return data;
}

export async function countAll(search?: string): Promise<number> {
  const data = await db
    .select({
      count: sql<number>`cast(count(${registrarMasterBranches.id}) as int)`,
    })
    .from(registrarMasterBranches)
    .leftJoin(
      registrarMasters,
      eq(registrarMasterBranches.registrarMasterID, registrarMasters.id)
    )
    .where(search ? Search_Query(search) : undefined);

  return data[0].count;
}
