import { and, desc, eq, like, or, sql } from "drizzle-orm";
import db from "../../db";
import { companyMasters } from "../../db/schema/company_master";
import {
  CompanyMasterType,
  CompanyMasterUpdateType,
  CompanyMasterCreateType,
} from "../../@types/company_master.type";
import { nameChangeMasters } from "../../db/schema/name_change_master";

const CompanyMasterSelect = {
  id: companyMasters.id,
  ISIN: companyMasters.ISIN,
  CIN: companyMasters.CIN,
  faceValue: companyMasters.faceValue,
  closingPriceNSE: companyMasters.closingPriceNSE,
  closingPriceBSE: companyMasters.closingPriceBSE,
  registeredOffice: companyMasters.registeredOffice,
  city: companyMasters.city,
  state: companyMasters.state,
  pincode: companyMasters.pincode,
  telephone: companyMasters.telephone,
  fax: companyMasters.fax,
  email: companyMasters.email,
  website: companyMasters.website,
  nameContactPerson: companyMasters.nameContactPerson,
  designationContactPerson: companyMasters.designationContactPerson,
  emailContactPerson: companyMasters.emailContactPerson,
  phoneContactPerson: companyMasters.phoneContactPerson,
  createdAt: companyMasters.createdAt,
};

const NameChangeMasterSelect = {
  newName: nameChangeMasters.newName,
  currentName: nameChangeMasters.currentName,
  NSE: nameChangeMasters.NSE,
  BSE: nameChangeMasters.BSE,
  nameChangeMasterId: nameChangeMasters.id,
};

const MasterSelect = {
  ...CompanyMasterSelect,
  ...NameChangeMasterSelect,
};

/**
 * Create a new companyMaster with the provided data.
 *
 * @param {InferInsertModel<typeof companyMasters>} data - the data for creating the companyMaster
 * @return {Promise<CompanyMasterType>} a promise that resolves to the newly created companyMaster
 */
export async function createCompanyMaster(
  data: CompanyMasterCreateType & { createdBy: number }
): Promise<CompanyMasterType> {
  const { newName, currentName, NSE, BSE, ...companyData } = data;
  const resp = await db.transaction(async (tx) => {
    try {
      const result = await tx
        .insert(companyMasters)
        .values(companyData)
        .onConflictDoNothing()
        .returning(CompanyMasterSelect);
      const nameChangeResult = await tx
        .insert(nameChangeMasters)
        .values({
          companyID: result[0].id,
          newName: newName,
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
  return resp;
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
): Promise<CompanyMasterType> {
  const { newName, currentName, NSE, BSE, ...companyData } = data;
  const resp = await db.transaction(async (tx) => {
    try {
      const result = await tx
        .update(companyMasters)
        .set(companyData)
        .where(eq(companyMasters.id, id))
        .returning(CompanyMasterSelect);
      const nameChangeResult = await tx
        .update(nameChangeMasters)
        .set({
          newName: newName,
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
                .orderBy(desc(nameChangeMasters.id))
                .limit(1)
            )
          )
        )
        .returning(NameChangeMasterSelect);
      return { ...result[0], ...nameChangeResult[0] };
    } catch (error) {
      tx.rollback();
      throw error;
    }
  });
  return resp;
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
  const data = await db
    .select(MasterSelect)
    .from(companyMasters)
    .leftJoin(
      nameChangeMasters,
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
              eq(companyMasters.pincode, search),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.currentName, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.NSE, `%${search}%`),
              like(companyMasters.ISIN, `%${search}%`),
              like(companyMasters.CIN, `%${search}%`),
              like(companyMasters.registeredOffice, `%${search}%`),
              like(companyMasters.city, `%${search}%`),
              like(companyMasters.state, `%${search}%`),
              like(companyMasters.email, `%${search}%`),
              like(companyMasters.website, `%${search}%`),
              like(companyMasters.nameContactPerson, `%${search}%`),
              like(companyMasters.designationContactPerson, `%${search}%`),
              like(companyMasters.emailContactPerson, `%${search}%`),
              like(companyMasters.phoneContactPerson, `%${search}%`),
              like(companyMasters.telephone, `%${search}%`),
              like(companyMasters.fax, `%${search}%`),
              eq(companyMasters.faceValue, Number(search)),
              eq(companyMasters.closingPriceNSE, Number(search)),
              eq(companyMasters.closingPriceBSE, Number(search))
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
    .from(companyMasters)
    .leftJoin(
      nameChangeMasters,
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
              like(companyMasters.ISIN, `%${search}%`),
              like(nameChangeMasters.newName, `%${search}%`),
              like(nameChangeMasters.currentName, `%${search}%`),
              like(nameChangeMasters.BSE, `%${search}%`),
              like(nameChangeMasters.NSE, `%${search}%`),
              like(companyMasters.CIN, `%${search}%`),
              like(companyMasters.registeredOffice, `%${search}%`),
              like(companyMasters.city, `%${search}%`),
              like(companyMasters.state, `%${search}%`),
              eq(companyMasters.pincode, search),
              like(companyMasters.email, `%${search}%`),
              like(companyMasters.website, `%${search}%`),
              like(companyMasters.nameContactPerson, `%${search}%`),
              like(companyMasters.designationContactPerson, `%${search}%`),
              like(companyMasters.emailContactPerson, `%${search}%`),
              like(companyMasters.phoneContactPerson, `%${search}%`),
              like(companyMasters.telephone, `%${search}%`),
              like(companyMasters.fax, `%${search}%`),
              eq(companyMasters.faceValue, Number(search)),
              eq(companyMasters.closingPriceNSE, Number(search)),
              eq(companyMasters.closingPriceBSE, Number(search))
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

/**
 * Retrieves companyMaster data by the given ID.
 *
 * @param {number} id - The ID of the companyMaster to retrieve
 * @return {Promise<CompanyMasterType|null>} The companyMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<CompanyMasterType | null> {
  const data = await db
    .select(MasterSelect)
    .from(companyMasters)
    .leftJoin(
      nameChangeMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      and(
        eq(companyMasters.id, id),
        eq(
          nameChangeMasters.id,
          db
            .select({
              id: nameChangeMasters.id,
            })
            .from(nameChangeMasters)
            .where(eq(nameChangeMasters.companyID, id))
            .orderBy(desc(nameChangeMasters.id))
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
 * @return {Promise<CompanyMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByCIN(CIN: string): Promise<CompanyMasterType | null> {
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
 * @return {Promise<CompanyMasterType | null>} The companyMaster information if found, otherwise null
 */
export async function getByISIN(
  ISIN: string
): Promise<CompanyMasterType | null> {
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
export async function remove(id: number): Promise<CompanyMasterType> {
  const result = await db
    .delete(companyMasters)
    .where(eq(companyMasters.id, id))
    .returning(CompanyMasterSelect);
  return result[0];
}
