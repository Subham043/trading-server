import {
  count,
  createSecurityTypeMaster,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateSecurityTypeMaster,
} from "./security_type_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  SecurityTypeMasterCreateType,
  SecurityTypeMasterType,
  SecurityTypeMasterUpdateType,
} from "../../@types/security_type_master.type";
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
  ExcelFailedSecurityTypeMasterColumn,
  ExcelSecurityTypeMastersColumns,
  SecurityTypeMasterExcelData,
} from "./security_type_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createSecurityTypeMasterBodySchema,
  createSecurityTypeMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new securityTypeMaster with the provided securityTypeMaster information.
 *
 * @param {SecurityTypeMasterCreateType} securityTypeMaster - the securityTypeMaster information
 * @return {Promise<SecurityTypeMasterType>} a promise that resolves with the created securityTypeMaster data
 */
export async function create(
  data: SecurityTypeMasterCreateType
): Promise<SecurityTypeMasterType | null> {
  return await createSecurityTypeMaster({
    ...data,
  });
}

/**
 * Update SecurityTypeMasterType information.
 *
 * @param {CreateSecurityTypeMasterBody} SecurityTypeMasterType - the SecurityTypeMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the SecurityTypeMasterType to be updated
 * @return {Promise<SecurityTypeMasterType>} the updated SecurityTypeMasterType information
 */
export async function update(
  data: SecurityTypeMasterUpdateType,
  param: GetIdParam
): Promise<SecurityTypeMasterType | null> {
  return await updateSecurityTypeMaster(data, param.id);
}

/**
 * Find a securityTypeMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the securityTypeMaster
 * @return {Promise<SecurityTypeMasterType>} the securityTypeMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<SecurityTypeMasterType> {
  const { id } = params;

  const securityTypeMaster = await getById(id);
  if (!securityTypeMaster) {
    throw new NotFoundError();
  }
  return securityTypeMaster;
}

/**
 * Find securityTypeMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the securityTypeMaster
 * @return {Promise<{securityTypeMaster:SecurityTypeMasterType[]} & PaginationType>} the securityTypeMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    securityTypeMaster: SecurityTypeMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const securityTypeMaster = await paginate(limit, offset, querystring.search);
  const securityTypeMasterCount = await count(querystring.search);
  return {
    securityTypeMaster,
    ...getPaginationKeys({
      count: securityTypeMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export securityTypeMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the securityTypeMaster
 * @return {Promise<{file: ExcelBuffer}>} the securityTypeMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const securityTypeMasters = await getAll(querystring.search);

  const buffer = await generateExcel<SecurityTypeMasterType>(
    "Name Change Masters",
    ExcelSecurityTypeMastersColumns,
    securityTypeMasters
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a securityTypeMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the securityTypeMaster
 * @return {Promise<SecurityTypeMasterType>} the destroyed securityTypeMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<SecurityTypeMasterType | null> {
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
  const securityTypeMasterInsertData: SecurityTypeMasterExcelData[] = [];
  const failedSecurityTypeMasterImport: (SecurityTypeMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const securityTypeMasterData = {
        instrumentType: row.getCell(1).value?.toString() as
          | "InvIT"
          | "IDR"
          | "MFs"
          | "PreferenceShares"
          | "REiT"
          | "Equity"
          | "Warrant",
        Symbol: row.getCell(2).value?.toString(),
        Series: row.getCell(3).value?.toString(),
        securityName: row.getCell(4).value?.toString(),
        dateOfListing: (
          row.getCell(5).value as Date | undefined
        )?.toISOString(),
        dateOfAllotment: (
          row.getCell(6).value as Date | undefined
        )?.toISOString(),
        redemptionDate: (
          row.getCell(7).value as Date | undefined
        )?.toISOString(),
        conversionDate: (
          row.getCell(8).value as Date | undefined
        )?.toISOString(),
        paidUpValue: isNaN(Number(row.getCell(9).value?.toString()))
          ? undefined
          : Number(row.getCell(9).value?.toString()),
        faceValue: isNaN(Number(row.getCell(10).value?.toString()))
          ? undefined
          : Number(row.getCell(10).value?.toString()),
        dividend: isNaN(Number(row.getCell(11).value?.toString()))
          ? undefined
          : Number(row.getCell(11).value?.toString()),
        redemptionAmount: isNaN(Number(row.getCell(12).value?.toString()))
          ? undefined
          : Number(row.getCell(12).value?.toString()),
        conversionAmount: isNaN(Number(row.getCell(13).value?.toString()))
          ? undefined
          : Number(row.getCell(13).value?.toString()),
        marketLot: row.getCell(14).value?.toString(),
        isinNumber: row.getCell(15).value?.toString(),
        distinctiveNosFrom: row.getCell(16).value?.toString(),
        distinctiveNosTo: row.getCell(17).value?.toString(),
        companyID: Number(row.getCell(18).value?.toString()),
      };
      securityTypeMasterInsertData.push(securityTypeMasterData);
    }
  });
  for (let i = 0; i < securityTypeMasterInsertData.length; i++) {
    try {
      await createSecurityTypeMasterBodySchema.parseAsync(
        securityTypeMasterInsertData[i]
      );
      await createSecurityTypeMasterUniqueSchema.parseAsync({
        companyID: securityTypeMasterInsertData[i].companyID,
      });
      const validatedSecurityTypeMasterData = {
        instrumentType: securityTypeMasterInsertData[i].instrumentType,
        Symbol: securityTypeMasterInsertData[i].Symbol,
        Series: securityTypeMasterInsertData[i].Series,
        securityName: securityTypeMasterInsertData[i].securityName,
        paidUpValue: securityTypeMasterInsertData[i].paidUpValue,
        faceValue: securityTypeMasterInsertData[i].faceValue,
        dividend: securityTypeMasterInsertData[i].dividend,
        redemptionAmount: securityTypeMasterInsertData[i].redemptionAmount,
        conversionAmount: securityTypeMasterInsertData[i].conversionAmount,
        marketLot: securityTypeMasterInsertData[i].marketLot,
        isinNumber: securityTypeMasterInsertData[i].isinNumber,
        distinctiveNosFrom: securityTypeMasterInsertData[i].distinctiveNosFrom,
        distinctiveNosTo: securityTypeMasterInsertData[i].distinctiveNosTo,
        dateOfListing:
          securityTypeMasterInsertData[i].dateOfListing !== undefined
            ? new Date(securityTypeMasterInsertData[i].dateOfListing as string)
            : undefined,
        dateOfAllotment:
          securityTypeMasterInsertData[i].dateOfAllotment !== undefined
            ? new Date(
                securityTypeMasterInsertData[i].dateOfAllotment as string
              )
            : undefined,
        redemptionDate:
          securityTypeMasterInsertData[i].redemptionDate !== undefined
            ? new Date(securityTypeMasterInsertData[i].redemptionDate as string)
            : undefined,
        conversionDate:
          securityTypeMasterInsertData[i].conversionDate !== undefined
            ? new Date(securityTypeMasterInsertData[i].conversionDate as string)
            : undefined,
        companyID: Number(securityTypeMasterInsertData[i].companyID),
      };
      await createSecurityTypeMaster(validatedSecurityTypeMasterData);
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedSecurityTypeMasterImport.push({
        ...securityTypeMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedSecurityTypeMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      SecurityTypeMasterExcelData & { error: string }
    >(
      "Security_Type_Master",
      ExcelFailedSecurityTypeMasterColumn,
      failedSecurityTypeMasterImport,
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
