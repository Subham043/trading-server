import { and, asc, desc, eq, exists, inArray, max, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import db from "../../db";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import {
  NameChangeMasterType,
  NameChangeMasterUpdateType,
} from "../../@types/name_change_master.type";
import { companyMasters } from "../../db/schema/company_master";
import {
  Descending_NameChangeMaster_ID,
  NameChangeMasterSelect,
  Search_Query,
  Select_NSE_BSE_Query,
  Select_Name_Change_Master_Query,
  Select_Master_Query,
  Select_Sub_Query,
  transformData,
} from "./name_change_master.model";

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {InferInsertModel<typeof nameChangeMasters>} data - the data for creating the companyMaster
 * @return {Promise<NameChangeMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createNameChangeMaster(
  data: InferInsertModel<typeof nameChangeMasters>
): Promise<NameChangeMasterType> {
  const result = await db
    .insert(nameChangeMasters)
    .values(transformData(data))
    .onConflictDoNothing()
    .returning(NameChangeMasterSelect);
  return result[0];
}

/**
 * Update companyMaster information in the database.
 *
 * @param {UpdateNameChangeMasterBody} data - the data to update the companyMaster with
 * @param {number} id - the id of the companyMaster to update
 * @return {Promise<NameChangeMasterType>} the updated companyMaster information
 */
export async function updateNameChangeMaster(
  data: NameChangeMasterUpdateType,
  id: number
): Promise<NameChangeMasterType> {
  const result = await db
    .update(nameChangeMasters)
    .set(transformData(data))
    .where(eq(nameChangeMasters.id, id))
    .returning(NameChangeMasterSelect);
  return result[0];
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<NameChangeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  companyID: number,
  search?: string
): Promise<NameChangeMasterType[]> {
  const data = await Select_Name_Change_Master_Query.where(
    search
      ? and(eq(nameChangeMasters.companyID, companyID), Search_Query(search))
      : eq(nameChangeMasters.companyID, companyID)
  )
    .orderBy(Descending_NameChangeMaster_ID)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<NameChangeMasterType[]>} the paginated companyMaster data as a promise
 */
export async function getAll(
  companyID: number,
  search?: string
): Promise<NameChangeMasterType[]> {
  const data = await Select_Name_Change_Master_Query.where(
    search
      ? and(eq(nameChangeMasters.companyID, companyID), Search_Query(search))
      : eq(nameChangeMasters.companyID, companyID)
  ).orderBy(Descending_NameChangeMaster_ID);

  return data;
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(
  companyID: number,
  search?: string
): Promise<number> {
  const data = await db
    .select({
      count: sql<number>`cast(count(${nameChangeMasters.id}) as int)`,
    })
    .from(nameChangeMasters)
    .where(
      search
        ? and(eq(nameChangeMasters.companyID, companyID), Search_Query(search))
        : eq(nameChangeMasters.companyID, companyID)
    );

  return data[0].count;
}

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(
  id: number
): Promise<NameChangeMasterType | null> {
  const data = await Select_Name_Change_Master_Query.where(
    eq(nameChangeMasters.id, id)
  );
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Retrieves companyMaster information by CIN from the database.
 *
 * @param {string} CIN - The CIN of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByNSE(
  NSE: string
): Promise<NameChangeMasterType | null> {
  const data = await Select_NSE_BSE_Query.where(eq(nameChangeMasters.NSE, NSE));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Retrieves companyMaster information by ISIN from the database.
 *
 * @param {string} ISIN - The ISIN of the companyMaster to retrieve
 * @return {Promise<NameChangeMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByBSE(
  BSE: string
): Promise<NameChangeMasterType | null> {
  const data = await Select_NSE_BSE_Query.where(eq(nameChangeMasters.BSE, BSE));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a companyMaster from the database by their ID.
 *
 * @param {number} id - the ID of the companyMaster to be removed
 * @return {Promise<NameChangeMasterType>} a promise that resolves once the companyMaster is removed
 */
export async function remove(id: number): Promise<NameChangeMasterType> {
  const result = await db
    .delete(nameChangeMasters)
    .where(eq(nameChangeMasters.id, id))
    .returning(NameChangeMasterSelect);
  return result[0];
}

export async function removeMultiple(
  ids: number[],
  companyID: number
): Promise<void> {
  const data = await Select_Master_Query.where(
    and(
      eq(nameChangeMasters.companyID, companyID),
      eq(
        nameChangeMasters.id,
        db
          .select({
            id: nameChangeMasters.id,
          })
          .from(nameChangeMasters)
          .where(eq(nameChangeMasters.companyID, companyMasters.id))
          .orderBy(asc(nameChangeMasters.id))
          .limit(1)
      )
    )
  ).limit(1);
  if (data.length > 0) {
    const filteredIds = ids.filter((id) => id !== data[0].id);
    if (filteredIds.length === 0) return;
    await db
      .delete(nameChangeMasters)
      .where(inArray(nameChangeMasters.id, filteredIds))
      .returning(NameChangeMasterSelect);
    return;
  }
  await db
    .delete(nameChangeMasters)
    .where(inArray(nameChangeMasters.id, ids))
    .returning(NameChangeMasterSelect);
  return;
}

export async function paginateCompany(
  limit: number,
  offset: number,
  search?: string
): Promise<
  (NameChangeMasterType & {
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
    companyId?: number | null | undefined;
  })[]
> {
  const nCId = await db
    .select({
      id: max(nameChangeMasters.id),
    })
    .from(nameChangeMasters)
    .where(
      exists(
        db
          .select({
            id: companyMasters.id,
          })
          .from(companyMasters)
          .where(eq(companyMasters.id, nameChangeMasters.companyID))
      )
    )
    .groupBy(nameChangeMasters.companyID);
  const nCIdArr = nCId.map((x) => x.id).filter((x) => x !== null) as number[];
  const data = await Select_Master_Query.where(
    search
      ? and(inArray(nameChangeMasters.id, nCIdArr), Search_Query(search, true))
      : inArray(nameChangeMasters.id, nCIdArr)
  )
    .orderBy(desc(companyMasters.createdAt))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function getAllCompany(search?: string): Promise<
  (NameChangeMasterType & {
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
    companyId?: number | null | undefined;
  })[]
> {
  const nCId = await db
    .select({
      id: max(nameChangeMasters.id),
    })
    .from(nameChangeMasters)
    .where(
      exists(
        db
          .select({
            id: companyMasters.id,
          })
          .from(companyMasters)
          .where(eq(companyMasters.id, nameChangeMasters.companyID))
      )
    )
    .groupBy(nameChangeMasters.companyID);
  const nCIdArr = nCId.map((x) => x.id).filter((x) => x !== null) as number[];
  const data = await Select_Master_Query.where(
    search
      ? and(inArray(nameChangeMasters.id, nCIdArr), Search_Query(search, true))
      : inArray(nameChangeMasters.id, nCIdArr)
  ).orderBy(desc(companyMasters.createdAt));

  return data;
}

export async function countCompany(search?: string): Promise<number> {
  const nCId = await db
    .select({
      id: max(nameChangeMasters.id),
    })
    .from(nameChangeMasters)
    .where(
      exists(
        db
          .select({
            id: companyMasters.id,
          })
          .from(companyMasters)
          .where(eq(companyMasters.id, nameChangeMasters.companyID))
      )
    )
    .groupBy(nameChangeMasters.companyID);
  const nCIdArr = nCId.map((x) => x.id).filter((x) => x !== null) as number[];
  const data = await db
    .select({
      count: sql<number>`cast(count(${nameChangeMasters.id}) as int)`,
    })
    .from(nameChangeMasters)
    .leftJoin(
      companyMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      search
        ? and(
            inArray(nameChangeMasters.id, nCIdArr),
            Search_Query(search, true)
          )
        : inArray(nameChangeMasters.id, nCIdArr)
    );

  return data[0].count;
}

export async function getByCompanyId(companyId: number): Promise<
  NameChangeMasterType & {
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
    companyId?: number | null | undefined;
  }
> {
  const data = await Select_Master_Query.where(
    and(
      eq(nameChangeMasters.companyID, companyId),
      eq(nameChangeMasters.id, Select_Sub_Query)
    )
  );
  if (data.length > 0) {
    return data[0];
  }
  return {
    id: 0,
    NSE: undefined,
    BSE: undefined,
    currentName: undefined,
    previousName: undefined,
    dateNameChange: new Date(),
    companyId: companyId,
    createdAt: new Date(),
  };
}
