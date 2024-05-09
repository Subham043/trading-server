import { and, eq, inArray, max, sql } from "drizzle-orm";
import db from "../../db";
import { companyMasters } from "../../db/schema/company_master";
import {
  CompanyMasterType,
  CompanyMasterUpdateType,
  CompanyMasterCreateType,
} from "../../@types/company_master.type";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import {
  CompanyMasterExcelUpdateRepoData,
  CompanyMasterSelect,
  Descending_CompanyMaster_CreatedAt,
  Descending_NameChangeMaster_ID,
  NameChangeMasterSelect,
  Search_Query,
  Select_Master_Query,
  Select_Sub_Query,
} from "./company_master.model";
import { exists } from "drizzle-orm";

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {InferInsertModel<typeof companyMasters>} data - the data for creating the companyMaster
 * @return {Promise<CompanyMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createCompanyMaster(
  data: CompanyMasterCreateType & { createdBy: number }
): Promise<CompanyMasterType | null> {
  const { currentName, NSE, BSE, registrarMasterBranchId, ...companyData } =
    data;
  const resp = await db.transaction(async (tx) => {
    try {
      const result = await tx
        .insert(companyMasters)
        .values(
          typeof registrarMasterBranchId === "number"
            ? {
                ...companyData,
                registrarMasterBranchId: registrarMasterBranchId
                  ? registrarMasterBranchId
                  : null,
              }
            : companyData
        )
        .onConflictDoNothing()
        .returning(CompanyMasterSelect);
      const nameChangeResult = await tx
        .insert(nameChangeMasters)
        .values({
          companyID: result[0].id,
          currentName: currentName,
          NSE: NSE,
          BSE: BSE,
        })
        .onConflictDoNothing()
        .returning(NameChangeMasterSelect);
      return { ...result[0], ...nameChangeResult[0] };
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
  return await getById(resp.id);
}

/**
 * Update companyMaster information in the database.
 *
 * @param {UpdateCompanyMasterBody} data - the data to update the companyMaster with
 * @param {number} id - the id of the companyMaster to update
 * @return {Promise<CompanyMasterType>} the updated companyMaster information
 */
export async function updateCompanyMaster(
  data: CompanyMasterUpdateType,
  id: number
): Promise<CompanyMasterType | null> {
  const { currentName, NSE, BSE, ...companyData } = data;
  await db.transaction(async (tx) => {
    try {
      const result = await tx
        .update(companyMasters)
        .set(companyData)
        .where(eq(companyMasters.id, id))
        .returning(CompanyMasterSelect);
      await tx
        .update(nameChangeMasters)
        .set({
          currentName: currentName,
          NSE: NSE,
          BSE: BSE,
        })
        .where(
          and(
            eq(nameChangeMasters.companyID, id),
            eq(
              nameChangeMasters.id,
              tx
                .select({
                  id: nameChangeMasters.id,
                })
                .from(nameChangeMasters)
                .where(eq(nameChangeMasters.companyID, id))
                .orderBy(Descending_NameChangeMaster_ID)
                .limit(1)
            )
          )
        )
        .returning(NameChangeMasterSelect);
      return result[0];
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
  return await getById(id);
}

function isObjectEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export async function updateCompanyMasterImport(
  data: CompanyMasterExcelUpdateRepoData
): Promise<CompanyMasterType | null> {
  const { currentName, NSE, BSE, ...companyData } = data;
  const nameChangeUpdateData = { currentName, NSE, BSE };
  await db.transaction(async (tx) => {
    Object.keys(companyData).forEach(function (key) {
      if (typeof companyData[key] === "undefined") {
        delete companyData[key];
      }
    });
    Object.keys(nameChangeUpdateData).forEach(function (key) {
      if (typeof nameChangeUpdateData[key] === "undefined") {
        delete nameChangeUpdateData[key];
      }
    });
    try {
      if (!isObjectEmpty(companyData)) {
        await tx
          .update(companyMasters)
          .set(companyData)
          .where(eq(companyMasters.id, data.id))
          .returning(CompanyMasterSelect);
      }
      if (!isObjectEmpty(nameChangeUpdateData)) {
        await tx
          .update(nameChangeMasters)
          .set(nameChangeUpdateData)
          .where(
            and(
              eq(nameChangeMasters.companyID, data.id),
              eq(
                nameChangeMasters.id,
                tx
                  .select({
                    id: nameChangeMasters.id,
                  })
                  .from(nameChangeMasters)
                  .where(eq(nameChangeMasters.companyID, data.id))
                  .orderBy(Descending_NameChangeMaster_ID)
                  .limit(1)
              )
            )
          )
          .returning(NameChangeMasterSelect);
      }
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
  return await getById(data.id);
}

/**
 * Asynchronously paginates the data from the database.
 *
 * @param {number} limit - the maximum number of items to retrieve
 * @param {number} offset - the number of items to skip before starting to return data
 * @return {Promise<CompanyMasterType[]>} the paginated companyMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<CompanyMasterType[]> {
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
          .limit(limit)
          .offset(offset)
      )
    )
    .groupBy(nameChangeMasters.companyID);
  const nCIdArr = nCId.map((x) => x.id).filter((x) => x !== null) as number[];

  const data = await Select_Master_Query.where(
    search
      ? and(inArray(nameChangeMasters.id, nCIdArr), Search_Query(search))
      : inArray(nameChangeMasters.id, nCIdArr)
  )
    .orderBy(Descending_CompanyMaster_CreatedAt)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<CompanyMasterType[]>} the paginated companyMaster data as a promise
 */
export async function getAll(search?: string): Promise<CompanyMasterType[]> {
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
      ? and(inArray(nameChangeMasters.id, nCIdArr), Search_Query(search))
      : inArray(nameChangeMasters.id, nCIdArr)
  ).orderBy(Descending_CompanyMaster_CreatedAt);

  return data;
}

/**
 * Asynchronously counts the number of records.
 *
 * @return {Promise<number>} The number of records.
 */
export async function count(search?: string): Promise<number> {
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
      count: sql<number>`cast(count(${companyMasters.id}) as int)`,
    })
    .from(companyMasters)
    .leftJoin(
      nameChangeMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      search
        ? and(inArray(nameChangeMasters.id, nCIdArr), Search_Query(search))
        : inArray(nameChangeMasters.id, nCIdArr)
    );

  return data[0].count;
}

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<CompanyMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<CompanyMasterType | null> {
  const data = await Select_Master_Query.where(
    and(
      eq(companyMasters.id, id),
      eq(
        nameChangeMasters.id,
        Select_Sub_Query.where(eq(nameChangeMasters.companyID, id))
          .orderBy(Descending_NameChangeMaster_ID)
          .limit(1)
      )
    )
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
 * @return {Promise<{ id: number, createdAt: Date | null } | null>} The companyMaster information if found, otherwise null
 */
export async function getByCIN(
  CIN: string
): Promise<{ id: number; createdAt: Date | null } | null> {
  const data = await db
    .select({
      id: companyMasters.id,
      createdAt: companyMasters.createdAt,
    })
    .from(companyMasters)
    .where(eq(companyMasters.CIN, CIN));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Retrieves companyMaster information by ISIN from the database.
 *
 * @param {string} ISIN - The ISIN of the companyMaster to retrieve
 * @return {Promise<{ id: number, createdAt: Date | null } | null>} The companyMaster information if found, otherwise null
 */
export async function getByISIN(
  ISIN: string
): Promise<{ id: number; createdAt: Date | null } | null> {
  const data = await db
    .select({
      id: companyMasters.id,
      createdAt: companyMasters.createdAt,
    })
    .from(companyMasters)
    .where(eq(companyMasters.ISIN, ISIN));
  if (data.length > 0) {
    return data[0];
  }
  return null;
}

/**
 * Removes a companyMaster from the database by their ID.
 *
 * @param {number} id - the ID of the companyMaster to be removed
 * @return {Promise<CompanyMasterType>} a promise that resolves once the companyMaster is removed
 */
export async function remove(id: number): Promise<CompanyMasterType | null> {
  const data = await getById(id);
  await db
    .delete(companyMasters)
    .where(eq(companyMasters.id, id))
    .returning(CompanyMasterSelect);
  return data;
}

export async function removeMultiple(ids: number[]): Promise<void> {
  await db.delete(companyMasters).where(inArray(companyMasters.id, ids));
}
