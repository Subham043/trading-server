import {
  count,
  createCompanyMaster,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateCompanyMaster,
  updateCompanyMasterImport,
} from "./company_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CompanyMasterCreateType,
  CompanyMasterQueryType,
  CompanyMasterUpdateType,
} from "../../@types/company_master.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
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
  CompanyMasterExcelUpdateData,
  CompanyMasterExportExcelData,
  ExcelCompanyMastersColumns,
  ExcelFailedCompanyMasterColumn,
  ExcelFailedCompanyMasterUpdateColumn,
} from "./company_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createCompanyMasterBodySchema,
  createCompanyMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";
import {
  updateImportCompanyMasterBodySchema,
  updateImportCompanyMasterUniqueSchema,
} from "./schemas/import_update.schema";

/**
 * Create a new companyMaster with the provided companyMaster information.
 *
 * @param {CompanyMasterCreateType} companyMaster - the companyMaster information
 * @return {Promise<CompanyMasterType>} a promise that resolves with the created companyMaster data
 */
export async function create(
  data: CompanyMasterCreateType,
  userId: number
): Promise<CompanyMasterQueryType | null> {
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
): Promise<CompanyMasterQueryType | null> {
  return await updateCompanyMaster(data, param.id);
}

/**
 * Find a companyMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the companyMaster
 * @return {Promise<CompanyMasterType>} the companyMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<CompanyMasterQueryType> {
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
 * @return {Promise<{companyMaster:CompanyMasterQueryType[]} & PaginationType>} the companyMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    companyMaster: CompanyMasterQueryType[];
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

  const excelData = companyMasters.map((companyMaster) => {
    return {
      id: companyMaster.id,
      currentName: companyMaster.currentNameChangeMasters?.currentName,
      NSE: companyMaster.currentNameChangeMasters?.NSE,
      BSE: companyMaster.currentNameChangeMasters?.BSE,
      ISIN: companyMaster.ISIN,
      CIN: companyMaster.CIN,
      faceValue: companyMaster.faceValue,
      closingPriceNSE: companyMaster.closingPriceNSE,
      closingPriceBSE: companyMaster.closingPriceBSE,
      registeredOffice: companyMaster.registeredOffice,
      city: companyMaster.city,
      state: companyMaster.state,
      pincode: companyMaster.pincode,
      telephone: companyMaster.telephone,
      fax: companyMaster.fax,
      email: companyMaster.email,
      website: companyMaster.website,
      nameContactPerson: companyMaster.nameContactPerson,
      emailContactPerson: companyMaster.emailContactPerson,
      phoneContactPerson: companyMaster.phoneContactPerson,
      designationContactPerson: companyMaster.designationContactPerson,
      registrarMasterBranchId: companyMaster.registrarMasterBranch?.id,
      registrar_branch: companyMaster.registrarMasterBranch?.branch,
      registrar_city: companyMaster.registrarMasterBranch?.city,
      registrar_state: companyMaster.registrarMasterBranch?.state,
      registrar_pincode: companyMaster.registrarMasterBranch?.pincode,
      registrar_name:
        companyMaster.registrarMasterBranch?.registrarMaster?.registrar_name,
      sebi_regn_id:
        companyMaster.registrarMasterBranch?.registrarMaster?.sebi_regn_id,
      registrarMasterId:
        companyMaster.registrarMasterBranch?.registrarMaster?.id,
      createdAt: companyMaster.createdAt,
    };
  });

  const buffer = await generateExcel<CompanyMasterExportExcelData>(
    "Company Masters",
    ExcelCompanyMastersColumns,
    excelData
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
export async function destroy(
  params: GetIdParam
): Promise<CompanyMasterQueryType> {
  const { id } = params;

  const companyMaster = await findById(params);
  await remove(id);
  return companyMaster;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
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
        currentName: row.getCell(3).value?.toString(),
        NSE: row.getCell(1).value?.toString(),
        BSE: row.getCell(2).value?.toString(),
        ISIN: row.getCell(4).value?.toString(),
        CIN: row.getCell(5).value?.toString(),
        faceValue: Number(row.getCell(6).value),
        closingPriceNSE: Number(row.getCell(7).value),
        closingPriceBSE: Number(row.getCell(8).value),
        registeredOffice: row.getCell(9).value?.toString(),
        city: row.getCell(10).value?.toString(),
        state: row.getCell(11).value?.toString(),
        pincode: isNaN(Number(row.getCell(12).value?.toString()))
          ? undefined
          : Number(row.getCell(12).value?.toString()),
        telephone: row.getCell(13).value?.toString(),
        fax: row.getCell(14).value?.toString(),
        email: row.getCell(15).isHyperlink
          ? row.getCell(15).toCsvString().replace("mailto:", "")
          : row.getCell(15).value?.toString(),
        website: row.getCell(16).isHyperlink
          ? row.getCell(16).toCsvString().replace("mailto:", "")
          : row.getCell(16).value?.toString(),
        nameContactPerson: row.getCell(17).value?.toString(),
        designationContactPerson: row.getCell(20).value?.toString(),
        emailContactPerson: row.getCell(18).isHyperlink
          ? row.getCell(18).toCsvString().replace("mailto:", "")
          : row.getCell(18).value?.toString(),
        phoneContactPerson: row.getCell(19).value?.toString(),
        registrarMasterBranchId: isNaN(
          Number(row.getCell(21).value?.toString())
        )
          ? undefined
          : Number(row.getCell(21).value?.toString()),
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
        registrarMasterBranchId:
          companyMasterInsertData[i].registrarMasterBranchId,
      });
      await createCompanyMaster({
        ...companyMasterInsertData[i],
        pincode: companyMasterInsertData[i].pincode?.toString(),
        registrarMasterBranchId: companyMasterInsertData[i]
          .registrarMasterBranchId as number | undefined,
      });
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedCompanyMasterImport.push({
        ...companyMasterInsertData[i],
        error: JSON.stringify(errorData),
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
      failedCompanyMasterImport,
      userId
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

export async function importUpdateExcel(
  data: PostExcelBody,
  userId: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const companyMasterUpdateData: CompanyMasterExcelUpdateData[] = [];
  const failedCompanyMasterImport: (CompanyMasterExcelUpdateData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const companyMasterData = {
        id: row.getCell(1).value as number,
        currentName: row.getCell(4).value?.toString(),
        NSE: row.getCell(2).value?.toString(),
        BSE: row.getCell(3).value?.toString(),
        ISIN: row.getCell(5).value?.toString(),
        CIN: row.getCell(6).value?.toString(),
        faceValue: isNaN(Number(row.getCell(7).value?.toString()))
          ? undefined
          : Number(row.getCell(7).value?.toString()),
        closingPriceNSE: isNaN(Number(row.getCell(8).value?.toString()))
          ? undefined
          : Number(row.getCell(8).value?.toString()),
        closingPriceBSE: isNaN(Number(row.getCell(9).value?.toString()))
          ? undefined
          : Number(row.getCell(9).value?.toString()),
        registeredOffice: row.getCell(10).value?.toString(),
        city: row.getCell(11).value?.toString(),
        state: row.getCell(12).value?.toString(),
        pincode: isNaN(Number(row.getCell(13).value?.toString()))
          ? undefined
          : Number(row.getCell(13).value?.toString()),
        telephone: row.getCell(14).value?.toString(),
        fax: row.getCell(15).value?.toString(),
        email: row.getCell(16).isHyperlink
          ? row.getCell(16).toCsvString().replace("mailto:", "")
          : row.getCell(16).value?.toString(),
        website: row.getCell(17).isHyperlink
          ? row.getCell(17).toCsvString().replace("mailto:", "")
          : row.getCell(17).value?.toString(),
        nameContactPerson: row.getCell(18).value?.toString(),
        emailContactPerson: row.getCell(19).isHyperlink
          ? row.getCell(19).toCsvString().replace("mailto:", "")
          : row.getCell(19).value?.toString(),
        phoneContactPerson: row.getCell(20).value?.toString(),
        designationContactPerson: row.getCell(21).value?.toString(),
        registrarMasterBranchId: isNaN(
          Number(row.getCell(22).value?.toString())
        )
          ? undefined
          : Number(row.getCell(22).value?.toString()),
      };
      companyMasterUpdateData.push(companyMasterData);
    }
  });
  for (let i = 0; i < companyMasterUpdateData.length; i++) {
    try {
      await updateImportCompanyMasterBodySchema.parseAsync(
        companyMasterUpdateData[i]
      );
      await updateImportCompanyMasterUniqueSchema.parseAsync({
        id: companyMasterUpdateData[i].id,
        CIN: companyMasterUpdateData[i].CIN,
        ISIN: companyMasterUpdateData[i].ISIN,
        NSE: companyMasterUpdateData[i].NSE,
        BSE: companyMasterUpdateData[i].BSE,
        registrarMasterBranchId:
          companyMasterUpdateData[i].registrarMasterBranchId,
      });
      let { pincode, ...rest } = companyMasterUpdateData[i];
      let pincodeString = pincode?.toString() as string | undefined;
      await updateCompanyMasterImport({
        ...rest,
        pincode: pincodeString,
      });
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedCompanyMasterImport.push({
        ...companyMasterUpdateData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedCompanyMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      CompanyMasterExcelUpdateData & { error: string }
    >(
      "Company_Master",
      ExcelFailedCompanyMasterUpdateColumn,
      failedCompanyMasterImport,
      userId
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
