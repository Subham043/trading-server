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
import {
  ExcelBuffer,
  generateExcel,
  readExcel,
  storeExcel,
} from "../../utils/excel";
import {
  CompanyMasterExcelData,
  ExcelCompanyMastersColumns,
  ExcelFailedCompanyMasterColumn,
} from "./company_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createCompanyMasterBodySchema,
  createCompanyMasterUniqueSchema,
} from "./schemas/create.schema";

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

export async function importExcel(
  data: PostExcelBody,
  userId: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const companyMasterInsertData: CompanyMasterExcelData[] = [];
  const failedCompanyMasterImport: (CompanyMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const companyMasterData = {
        newName: row.getCell(3).value?.toString(),
        currentName: row.getCell(4).value?.toString(),
        NSE: row.getCell(1).value?.toString(),
        BSE: row.getCell(2).value?.toString(),
        ISIN: row.getCell(5).value?.toString(),
        CIN: row.getCell(6).value?.toString(),
        faceValue: Number(row.getCell(7).value),
        closingPriceNSE: Number(row.getCell(8).value),
        closingPriceBSE: Number(row.getCell(9).value),
        registeredOffice: row.getCell(10).value?.toString(),
        city: row.getCell(11).value?.toString(),
        state: row.getCell(12).value?.toString(),
        pincode: Number(row.getCell(13).value?.toString()),
        telephone: row.getCell(14).value?.toString(),
        fax: row.getCell(15).value?.toString(),
        email: row.getCell(16).value?.toString(),
        website: row.getCell(17).value?.toString(),
        nameContactPerson: row.getCell(18).value?.toString(),
        designationContactPerson: row.getCell(21).value?.toString(),
        emailContactPerson: row.getCell(19).value?.toString(),
        phoneContactPerson: row.getCell(20).value?.toString(),
        createdBy: userId,
      };
      companyMasterInsertData.push(companyMasterData);
    }
  });
  for (let i = 0; i < companyMasterInsertData.length; i++) {
    try {
      await createCompanyMasterBodySchema.parseAsync(
        companyMasterInsertData[i]
      );
      await createCompanyMasterUniqueSchema.parseAsync({
        CIN: companyMasterInsertData[i].CIN,
        ISIN: companyMasterInsertData[i].ISIN,
        NSE: companyMasterInsertData[i].NSE,
        BSE: companyMasterInsertData[i].BSE,
      });
      await createCompanyMaster({
        ...companyMasterInsertData[i],
        pincode: companyMasterInsertData[i].pincode?.toString(),
      });
      successCount = successCount + 1;
    } catch (error) {
      failedCompanyMasterImport.push({
        ...companyMasterInsertData[i],
        error: JSON.stringify(error),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedCompanyMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      CompanyMasterExcelData & { error: string }
    >(
      "Failed Company Master Import",
      ExcelFailedCompanyMasterColumn,
      failedCompanyMasterImport
    );
    return {
      successCount,
      errorCount,
      fileName,
    };
  }
  return {
    successCount,
    errorCount,
    fileName: null,
  };
}
