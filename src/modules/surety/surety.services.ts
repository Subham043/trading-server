import {
  count,
  createSurety,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateSurety,
} from "./surety.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  SuretyCreateType,
  SuretyType,
  SuretyUpdateType,
} from "../../@types/surety.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
} from "../../utils/excel";
import {
  ExcelSuretysColumns,
} from "./surety.model";

/**
 * Create a new surety with the provided surety information.
 *
 * @param {SuretyCreateType} surety - the surety information
 * @return {Promise<SuretyType>} a promise that resolves with the created surety data
 */
export async function create(
  data: SuretyCreateType,
  projectID: number
): Promise<SuretyType | null> {
  const surety = await createSurety({
    ...data,
    projectID,
  });
  if(!surety){
    throw new NotFoundError();
  }
  return findById({ id: surety.id });
}

/**
 * Update SuretyType information.
 *
 * @param {CreateSuretyBody} SuretyType - the SuretyType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the SuretyType to be updated
 * @return {Promise<SuretyType>} the updated SuretyType information
 */
export async function update(
  data: SuretyUpdateType,
  param: GetIdParam
): Promise<SuretyType | null> {
  const surety = await updateSurety(data, param.id);
  if (!surety) {
    throw new NotFoundError();
  }
  return findById({ id: surety.id });
}

/**
 * Find a surety by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the surety
 * @return {Promise<SuretyType>} the surety found by ID
 */
export async function findById(params: GetIdParam): Promise<
  SuretyType
> {
  const { id } = params;

  const surety = await getById(id);
  if (!surety) {
    throw new NotFoundError();
  }
  return {
    ...surety,
  };
}

/**
 * Find surety by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the surety
 * @return {Promise<{surety:SuretyType[]} & PaginationType>} the surety found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    suretys: (SuretyType)[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const suretys = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const suretyCount = await count(
    projectID,
    querystring.search
  );
  return {
    suretys,
    ...getPaginationKeys({
      count: suretyCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export surety by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the surety
 * @return {Promise<{file: ExcelBuffer}>} the surety found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const suretys = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<SuretyType>(
    "Iepf Trackers",
    ExcelSuretysColumns,
    suretys
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a surety based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the surety
 * @return {Promise<SuretyType>} the destroyed surety
 */
export async function destroy(
  params: GetIdParam
): Promise<SuretyType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}