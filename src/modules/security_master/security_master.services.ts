import {
  count,
  createSecurityMaster,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateSecurityMaster,
} from "./security_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  SecurityMasterCreateType,
  SecurityMasterType,
  SecurityMasterUpdateType,
} from "../../@types/security_master.type";
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
  ExcelFailedSecurityMasterColumn,
  ExcelSecurityMastersColumns,
  SecurityMasterExcelData,
} from "./security_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createSecurityMasterBodySchema,
  createSecurityMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new securityMaster with the provided securityMaster information.
 *
 * @param {SecurityMasterCreateType} securityMaster - the securityMaster information
 * @return {Promise<SecurityMasterType>} a promise that resolves with the created securityMaster data
 */
export async function create(
  data: SecurityMasterCreateType
): Promise<SecurityMasterType | null> {
  return await createSecurityMaster({
    ...data,
  });
}

/**
 * Update SecurityMasterType information.
 *
 * @param {CreateSecurityMasterBody} SecurityMasterType - the SecurityMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the SecurityMasterType to be updated
 * @return {Promise<SecurityMasterType>} the updated SecurityMasterType information
 */
export async function update(
  data: SecurityMasterUpdateType,
  param: GetIdParam
): Promise<SecurityMasterType | null> {
  return await updateSecurityMaster(data, param.id);
}

/**
 * Find a securityMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the securityMaster
 * @return {Promise<SecurityMasterType>} the securityMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<SecurityMasterType> {
  const { id } = params;

  const securityMaster = await getById(id);
  if (!securityMaster) {
    throw new NotFoundError();
  }
  return securityMaster;
}

/**
 * Find securityMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the securityMaster
 * @return {Promise<{securityMaster:SecurityMasterType[]} & PaginationType>} the securityMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    securityMaster: SecurityMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const securityMaster = await paginate(limit, offset, querystring.search);
  const securityMasterCount = await count(querystring.search);
  return {
    securityMaster,
    ...getPaginationKeys({
      count: securityMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export securityMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the securityMaster
 * @return {Promise<{file: ExcelBuffer}>} the securityMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const securityMasters = await getAll(querystring.search);

  const buffer = await generateExcel<SecurityMasterType>(
    "Name Change Masters",
    ExcelSecurityMastersColumns,
    securityMasters
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a securityMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the securityMaster
 * @return {Promise<SecurityMasterType>} the destroyed securityMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<SecurityMasterType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}

export async function importExcel(
  data: PostExcelBody,
  createdBy: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const securityMasterInsertData: SecurityMasterExcelData[] = [];
  const failedSecurityMasterImport: (SecurityMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const securityMasterData = {
        instrumentType: row.getCell(1).value?.toString() as
          | "InvIT"
          | "IDR"
          | "MFs"
          | "PreferenceShares"
          | "REiT"
          | "Equity"
          | "Warrant",
        equityType: row.getCell(2).value?.toString() as
          | "Bonus"
          | "Shares"
          | "Splits"
          | "Rights",
        Folio: row.getCell(3).value?.toString(),
        certificateNumber: row.getCell(4).value?.toString(),
        certificateSerialNumber: row.getCell(5).value?.toString(),
        shareholderName1: row.getCell(6).value?.toString(),
        shareholderName2: row.getCell(7).value?.toString(),
        shareholderName3: row.getCell(8).value?.toString(),
        noOfShares: row.getCell(9).value?.toString(),
        noOfSharesWords: row.getCell(10).value?.toString(),
        dateOfAllotment: (
          row.getCell(11).value as Date | undefined
        )?.toISOString(),
        faceValue: isNaN(Number(row.getCell(12).value?.toString()))
          ? undefined
          : Number(row.getCell(12).value?.toString()),
        distinctiveNosFrom: row.getCell(13).value?.toString(),
        distinctiveNosTo: row.getCell(14).value?.toString(),
        endorsement: row.getCell(15).value?.toString() as "Yes" | "No",
        endorsementFolio: row.getCell(16).value?.toString(),
        endorsementDate: row.getCell(17).value?.toString(),
        endorsementShareholderName1: row.getCell(18).value?.toString(),
        endorsementShareholderName2: row.getCell(19).value?.toString(),
        endorsementShareholderName3: row.getCell(20).value?.toString(),
        companyID: Number(row.getCell(21).value?.toString()),
      };
      securityMasterInsertData.push(securityMasterData);
    }
  });
  for (let i = 0; i < securityMasterInsertData.length; i++) {
    try {
      await createSecurityMasterBodySchema.parseAsync(
        securityMasterInsertData[i]
      );
      await createSecurityMasterUniqueSchema.parseAsync({
        companyID: securityMasterInsertData[i].companyID,
      });
      const validatedSecurityMasterData = {
        instrumentType: securityMasterInsertData[i].instrumentType,
        equityType: securityMasterInsertData[i].equityType,
        Folio: securityMasterInsertData[i].Folio,
        certificateNumber: securityMasterInsertData[i].certificateNumber,
        certificateSerialNumber:
          securityMasterInsertData[i].certificateSerialNumber,
        shareholderName1: securityMasterInsertData[i].shareholderName1,
        shareholderName2: securityMasterInsertData[i].shareholderName2,
        shareholderName3: securityMasterInsertData[i].shareholderName3,
        noOfShares: securityMasterInsertData[i].noOfShares,
        noOfSharesWords: securityMasterInsertData[i].noOfSharesWords,
        faceValue: securityMasterInsertData[i].faceValue,
        distinctiveNosFrom: securityMasterInsertData[i].distinctiveNosFrom,
        distinctiveNosTo: securityMasterInsertData[i].distinctiveNosTo,
        dateOfAllotment:
          securityMasterInsertData[i].dateOfAllotment !== undefined
            ? new Date(securityMasterInsertData[i].dateOfAllotment as string)
            : undefined,
        endorsement: securityMasterInsertData[i].endorsement,
        endorsementFolio: securityMasterInsertData[i].endorsementFolio,
        endorsementDate:
          securityMasterInsertData[i].endorsementDate !== undefined
            ? new Date(securityMasterInsertData[i].endorsementDate as string)
            : undefined,
        endorsementShareholderName1:
          securityMasterInsertData[i].endorsementShareholderName1,
        endorsementShareholderName2:
          securityMasterInsertData[i].endorsementShareholderName2,
        endorsementShareholderName3:
          securityMasterInsertData[i].endorsementShareholderName3,
        companyID: Number(securityMasterInsertData[i].companyID),
      };
      await createSecurityMaster(validatedSecurityMasterData);
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedSecurityMasterImport.push({
        ...securityMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedSecurityMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      SecurityMasterExcelData & { error: string }
    >(
      "Security_Master",
      ExcelFailedSecurityMasterColumn,
      failedSecurityMasterImport,
      createdBy
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
