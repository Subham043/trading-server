import { and, eq, notInArray, sql } from "drizzle-orm";
import db from "../../db";
import { companyMasters } from "../../db/schema/company_master";
import {
  RegistrarMasterType,
  RegistrarMasterUpdateType,
  RegistrarMasterCreateType,
} from "../../@types/registrar_master.type";
import { nameChangeMasters } from "../../db/schema/name_change_master";
import {
  RegistrarMasterSelect,
  Descending_CompanyMaster_ID,
  Search_Query,
  MasterSelect,
  Descending_NameChangeMaster_ID,
} from "./registrar_master.model";
import { registrarMasters } from "../../db/schema/registrar_master";
import { desc } from "drizzle-orm";

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
    .values({ ...data, companyID: data.companyId })
    .onConflictDoNothing()
    .returning(RegistrarMasterSelect);
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
 * @return {Promise<RegistrarMasterType>} the updated registrarMaster information
 */
export async function updateRegistrarMaster(
  data: RegistrarMasterUpdateType,
  id: number
): Promise<RegistrarMasterType> {
  const { companyId, ...rest } = data;
  const result = await db
    .update(registrarMasters)
    .set({ ...rest, companyID: companyId })
    .where(eq(registrarMasters.id, id))
    .returning(RegistrarMasterSelect);
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
 * @return {Promise<RegistrarMasterType[]>} the paginated registrarMaster data as a promise
 */
export async function paginate(
  limit: number,
  offset: number,
  search?: string
): Promise<RegistrarMasterType[]> {
  const data = await db
    .select(MasterSelect)
    .from(registrarMasters)
    .leftJoin(companyMasters, eq(registrarMasters.companyID, companyMasters.id))
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
                .where(
                  eq(nameChangeMasters.companyID, registrarMasters.companyID)
                )
                .orderBy(Descending_NameChangeMaster_ID)
                .limit(1)
            ),
            Search_Query(search)
          )
        : eq(
            nameChangeMasters.id,
            db
              .select({
                id: nameChangeMasters.id,
              })
              .from(nameChangeMasters)
              .where(
                eq(nameChangeMasters.companyID, registrarMasters.companyID)
              )
              .orderBy(Descending_NameChangeMaster_ID)
              .limit(1)
          )
    )
    .orderBy(Descending_CompanyMaster_ID)
    .limit(limit)
    .offset(offset);

  return data;
}

/**
 * Asynchronously get all the data from the database.
 *
 * @param {string} search - the maximum number of items to retrieve
 * @return {Promise<RegistrarMasterType[]>} the paginated registrarMaster data as a promise
 */
export async function getAll(search?: string): Promise<RegistrarMasterType[]> {
  const data = await db
    .select(MasterSelect)
    .from(registrarMasters)
    .leftJoin(companyMasters, eq(registrarMasters.companyID, companyMasters.id))
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
                .where(
                  eq(nameChangeMasters.companyID, registrarMasters.companyID)
                )
                .orderBy(Descending_NameChangeMaster_ID)
                .limit(1)
            ),
            Search_Query(search)
          )
        : eq(
            nameChangeMasters.id,
            db
              .select({
                id: nameChangeMasters.id,
              })
              .from(nameChangeMasters)
              .where(
                eq(nameChangeMasters.companyID, registrarMasters.companyID)
              )
              .orderBy(Descending_NameChangeMaster_ID)
              .limit(1)
          )
    )
    .orderBy(Descending_CompanyMaster_ID);

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
    .leftJoin(companyMasters, eq(registrarMasters.companyID, companyMasters.id))
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
                .where(
                  eq(nameChangeMasters.companyID, registrarMasters.companyID)
                )
                .orderBy(Descending_NameChangeMaster_ID)
                .limit(1)
            ),
            Search_Query(search)
          )
        : eq(
            nameChangeMasters.id,
            db
              .select({
                id: nameChangeMasters.id,
              })
              .from(nameChangeMasters)
              .where(
                eq(nameChangeMasters.companyID, registrarMasters.companyID)
              )
              .orderBy(Descending_NameChangeMaster_ID)
              .limit(1)
          )
    );

  return data[0].count;
}

/**
 * Retrieves registrarMaster data by the given ID.
 *
 * @param {number} id - The ID of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterType|null>} The registrarMaster data if found, otherwise null
 */
export async function getById(id: number): Promise<RegistrarMasterType | null> {
  const data = await db
    .select(MasterSelect)
    .from(registrarMasters)
    .leftJoin(companyMasters, eq(registrarMasters.companyID, companyMasters.id))
    .leftJoin(
      nameChangeMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      and(
        eq(registrarMasters.id, id),
        eq(
          nameChangeMasters.id,
          db
            .select({
              id: nameChangeMasters.id,
            })
            .from(nameChangeMasters)
            .where(eq(nameChangeMasters.companyID, registrarMasters.companyID))
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
 * Retrieves registrarMaster information by companyId from the database.
 *
 * @param {number} companyId - The companyId of the registrarMaster to retrieve
 * @return {Promise<RegistrarMasterType | null>} The registrarMaster information if found, otherwise null
 */
export async function getByCompanyId(
  companyId: number
): Promise<RegistrarMasterType | null> {
  const data = await db
    .select({
      id: registrarMasters.id,
      registrar_name: registrarMasters.registrar_name,
      sebi_regn_id: registrarMasters.sebi_regn_id,
      companyID: registrarMasters.companyID,
      createdAt: registrarMasters.createdAt,
    })
    .from(registrarMasters)
    .where(eq(registrarMasters.companyID, companyId));
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

export async function getCompanyMasterSelect(param: {
  companyId?: string;
}): Promise<
  {
    currentName: string | null;
    companyID: number | null;
  }[]
> {
  const registrar = await db
    .select({
      companyID: registrarMasters.companyID,
    })
    .from(registrarMasters)
    .where(
      param.companyId
        ? notInArray(registrarMasters.companyID, [Number(param.companyId)])
        : undefined
    );
  const data = await db
    .select({
      companyID: companyMasters.id,
      currentName: nameChangeMasters.currentName,
    })
    .from(companyMasters)
    .leftJoin(
      nameChangeMasters,
      eq(nameChangeMasters.companyID, companyMasters.id)
    )
    .where(
      and(
        eq(
          nameChangeMasters.id,
          db
            .select({
              id: nameChangeMasters.id,
            })
            .from(nameChangeMasters)
            .where(eq(nameChangeMasters.companyID, companyMasters.id))
            .orderBy(Descending_NameChangeMaster_ID)
            .limit(1)
        ),
        registrar.length > 0
          ? notInArray(companyMasters.id, [
              ...registrar.map((item) => item.companyID),
            ])
          : undefined
      )
    )
    .orderBy(desc(companyMasters.createdAt));
  return data;
}
