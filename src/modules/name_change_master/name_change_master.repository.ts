import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import db from "../../db";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import {
  NameChangeMasterType,
  NameChangeMasterUpdateType,
} from "../../@types/name_change_master.type";
import { companyMasters } from "../../db/schema/company_master";

const NameChangeMasterSelect = {
  id: nameChangeMasters.id,
  NSE: nameChangeMasters.NSE,
  BSE: nameChangeMasters.BSE,
  newName: nameChangeMasters.newName,
  previousName: nameChangeMasters.previousName,
  dateNameChange: nameChangeMasters.dateNameChange,
  newRTA: nameChangeMasters.newRTA,
  previousRTA: nameChangeMasters.previousRTA,
  dateRTAChange: nameChangeMasters.dateRTAChange,
  oldSecuritySymbol: nameChangeMasters.oldSecuritySymbol,
  newSecuritySymbol: nameChangeMasters.newSecuritySymbol,
  dateSecurityChange: nameChangeMasters.dateSecurityChange,
  createdAt: nameChangeMasters.createdAt,
  companyId: nameChangeMasters.companyID,
};

const CompanyMasterSelect = {
  companyId: companyMasters.id,
  CIN: companyMasters.CIN,
  ISIN: companyMasters.ISIN,
  faceValue: companyMasters.faceValue,
};

const MasterSelect = {
  ...NameChangeMasterSelect,
  ...CompanyMasterSelect,
};

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
    .values({
      ...data,
      dateNameChange: data.dateNameChange
        ? new Date(data.dateNameChange)
        : new Date(),
      dateSecurityChange: data.dateSecurityChange
        ? new Date(data.dateSecurityChange)
        : new Date(),
      dateRTAChange: data.dateRTAChange
        ? new Date(data.dateRTAChange)
        : new Date(),
    })
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
    .set({
      ...data,
      dateNameChange: data.dateNameChange
        ? new Date(data.dateNameChange)
        : new Date(),
      dateSecurityChange: data.dateSecurityChange
        ? new Date(data.dateSecurityChange)
        : new Date(),
      dateRTAChange: data.dateRTAChange
        ? new Date(data.dateRTAChange)
        : new Date(),
    })
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
  const data = await db
    .select(NameChangeMasterSelect)
    .from(nameChangeMasters)
    .where(
      search
        ? and(
            eq(nameChangeMasters.companyID, companyID),
            or(
              like(nameChangeMasters.NSE, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.previousName, `%${search}%`),
              like(nameChangeMasters.newRTA, `%${search}%`),
              like(nameChangeMasters.previousRTA, `%${search}%`),
              like(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
              like(nameChangeMasters.newSecuritySymbol, `%${search}%`)
            )
          )
        : eq(nameChangeMasters.companyID, companyID)
    )
    .orderBy(desc(nameChangeMasters.createdAt))
    .limit(limit)
    .offset(offset);

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
        ? and(
            eq(nameChangeMasters.companyID, companyID),
            or(
              like(nameChangeMasters.NSE, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.previousName, `%${search}%`),
              like(nameChangeMasters.newRTA, `%${search}%`),
              like(nameChangeMasters.previousRTA, `%${search}%`),
              like(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
              like(nameChangeMasters.newSecuritySymbol, `%${search}%`)
            )
          )
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
  const data = await db
    .select(NameChangeMasterSelect)
    .from(nameChangeMasters)
    .where(eq(nameChangeMasters.id, id));
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
  const data = await db
    .select({
      id: nameChangeMasters.id,
      companyId: nameChangeMasters.companyID,
      createdAt: nameChangeMasters.createdAt,
    })
    .from(nameChangeMasters)
    .where(eq(nameChangeMasters.NSE, NSE));
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
  const data = await db
    .select({
      id: nameChangeMasters.id,
      companyId: nameChangeMasters.companyID,
      createdAt: nameChangeMasters.createdAt,
    })
    .from(nameChangeMasters)
    .where(eq(nameChangeMasters.BSE, BSE));
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
  const data = await db
    .select(MasterSelect)
    .from(nameChangeMasters)
    .leftJoin(
      companyMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      search
        ? and(
            eq(
              nameChangeMasters.id,
              db
                .select({
                  id: nameChangeMasters.id,
                })
                .from(nameChangeMasters)
                .where(eq(nameChangeMasters.companyID, companyMasters.id))
                .orderBy(desc(nameChangeMasters.id))
                .limit(1)
            ),
            or(
              like(nameChangeMasters.NSE, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.previousName, `%${search}%`),
              like(nameChangeMasters.newRTA, `%${search}%`),
              like(nameChangeMasters.previousRTA, `%${search}%`),
              like(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
              like(nameChangeMasters.newSecuritySymbol, `%${search}%`),
              like(companyMasters.ISIN, `%${search}%`),
              like(companyMasters.CIN, `%${search}%`),
              eq(companyMasters.faceValue, Number(search))
            )
          )
        : eq(
            nameChangeMasters.id,
            db
              .select({
                id: nameChangeMasters.id,
              })
              .from(nameChangeMasters)
              .where(eq(nameChangeMasters.companyID, companyMasters.id))
              .orderBy(desc(nameChangeMasters.id))
              .limit(1)
          )
    )
    .orderBy(desc(companyMasters.createdAt))
    .limit(limit)
    .offset(offset);

  return data;
}

export async function countCompany(search?: string): Promise<number> {
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
            eq(
              nameChangeMasters.id,
              db
                .select({
                  id: nameChangeMasters.id,
                })
                .from(nameChangeMasters)
                .where(eq(nameChangeMasters.companyID, companyMasters.id))
                .orderBy(desc(nameChangeMasters.id))
                .limit(1)
            ),
            or(
              like(nameChangeMasters.NSE, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.previousName, `%${search}%`),
              like(nameChangeMasters.newRTA, `%${search}%`),
              like(nameChangeMasters.previousRTA, `%${search}%`),
              like(nameChangeMasters.oldSecuritySymbol, `%${search}%`),
              like(nameChangeMasters.newSecuritySymbol, `%${search}%`),
              like(companyMasters.ISIN, `%${search}%`),
              like(companyMasters.CIN, `%${search}%`),
              eq(companyMasters.faceValue, Number(search))
            )
          )
        : eq(
            nameChangeMasters.id,
            db
              .select({
                id: nameChangeMasters.id,
              })
              .from(nameChangeMasters)
              .where(eq(nameChangeMasters.companyID, companyMasters.id))
              .orderBy(desc(nameChangeMasters.id))
              .limit(1)
          )
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
  const data = await db
    .select(MasterSelect)
    .from(nameChangeMasters)
    .leftJoin(
      companyMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      and(
        eq(nameChangeMasters.companyID, companyId),
        eq(
          nameChangeMasters.id,
          db
            .select({
              id: nameChangeMasters.id,
            })
            .from(nameChangeMasters)
            .where(eq(nameChangeMasters.companyID, companyMasters.id))
            .orderBy(desc(nameChangeMasters.id))
            .limit(1)
        )
      )
    );
  if (data.length > 0) {
    return data[0];
  }
  return {
    id: 0,
    NSE: undefined,
    BSE: undefined,
    newName: undefined,
    previousName: undefined,
    dateNameChange: new Date(),
    newRTA: undefined,
    previousRTA: undefined,
    dateRTAChange: new Date(),
    oldSecuritySymbol: undefined,
    newSecuritySymbol: undefined,
    dateSecurityChange: new Date(),
    companyId: companyId,
    createdAt: new Date(),
  };
}
