import {
  count,
  createCompanyMaster,
  getAll,
  getById,
  paginate,
  remove,
  updateCompanyMaster,
} from "./company_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CompanyMasterCreateType,
  CompanyMasterType,
  CompanyMasterUpdateType,
} from "../../@types/company_master.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { ExcelBuffer, generateExcel } from "../../utils/excel";
import { ExcelCompanyMastersColumns } from "./company_master.model";

/**
 * Create a new companyMaster with the provided companyMaster information.
 *
 * @param {CompanyMasterCreateType} companyMaster - the companyMaster information
 * @return {Promise<CompanyMasterType>} a promise that resolves with the created companyMaster data
 */
export async function create(
  data: CompanyMasterCreateType,
  userId: number
): Promise<CompanyMasterType> {
  return await createCompanyMaster({ ...data, createdBy: userId });
}

/**
 * Update CompanyMasterType information.
 *
 * @param {CreateCompanyMasterBody} CompanyMasterType - the CompanyMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CompanyMasterType to be updated
 * @return {Promise<CompanyMasterType>} the updated CompanyMasterType information
 */
export async function update(
  data: CompanyMasterUpdateType,
  param: GetIdParam
): Promise<CompanyMasterType> {
  return await updateCompanyMaster(data, param.id);
}

/**
 * Find a companyMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the companyMaster
 * @return {Promise<CompanyMasterType>} the companyMaster found by ID
 */
export async function findById(params: GetIdParam): Promise<CompanyMasterType> {
  const { id } = params;

  const companyMaster = await getById(id);
  if (!companyMaster) {
    throw new NotFoundError();
  }
  return companyMaster;
}

/**
 * Find companyMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the companyMaster
 * @return {Promise<{companyMaster:CompanyMasterType[]} & PaginationType>} the companyMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    companyMaster: CompanyMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const companyMaster = await paginate(limit, offset, querystring.search);
  const companyMasterCount = await count(querystring.search);
  return {
    companyMaster,
    ...getPaginationKeys({
      count: companyMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export companyMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the companyMaster
 * @return {Promise<{file: ExcelBuffer}>} the companyMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const companyMasters = await getAll(querystring.search);

  const buffer = await generateExcel<CompanyMasterType>(
    "Company Masters",
    ExcelCompanyMastersColumns,
    companyMasters
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a companyMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the companyMaster
 * @return {Promise<CompanyMasterType>} the destroyed companyMaster
 */
export async function destroy(params: GetIdParam): Promise<CompanyMasterType> {
  const { id } = params;

  const companyMaster = await findById(params);
  await remove(id);
  return companyMaster;
}
