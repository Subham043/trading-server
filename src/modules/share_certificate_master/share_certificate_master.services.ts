import {
  count,
  createShareCertificateMaster,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateShareCertificateMaster,
} from "./share_certificate_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  ShareCertificateMasterCreateType,
  ShareCertificateMasterType,
  ShareCertificateMasterUpdateType,
} from "../../@types/share_certificate_master.type";
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
  ExcelFailedShareCertificateMasterColumn,
  ExcelShareCertificateMastersColumns,
  ShareCertificateMasterExcelData,
} from "./share_certificate_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createShareCertificateMasterBodySchema,
  createShareCertificateMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new shareCertificateMaster with the provided shareCertificateMaster information.
 *
 * @param {ShareCertificateMasterCreateType} shareCertificateMaster - the shareCertificateMaster information
 * @return {Promise<ShareCertificateMasterType>} a promise that resolves with the created shareCertificateMaster data
 */
export async function create(
  data: ShareCertificateMasterCreateType
): Promise<ShareCertificateMasterType | null> {
  return await createShareCertificateMaster({
    ...data,
  });
}

/**
 * Update ShareCertificateMasterType information.
 *
 * @param {CreateShareCertificateMasterBody} ShareCertificateMasterType - the ShareCertificateMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the ShareCertificateMasterType to be updated
 * @return {Promise<ShareCertificateMasterType>} the updated ShareCertificateMasterType information
 */
export async function update(
  data: ShareCertificateMasterUpdateType,
  param: GetIdParam
): Promise<ShareCertificateMasterType | null> {
  return await updateShareCertificateMaster(data, param.id);
}

/**
 * Find a shareCertificateMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareCertificateMaster
 * @return {Promise<ShareCertificateMasterType>} the shareCertificateMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<ShareCertificateMasterType> {
  const { id } = params;

  const shareCertificateMaster = await getById(id);
  if (!shareCertificateMaster) {
    throw new NotFoundError();
  }
  return shareCertificateMaster;
}

/**
 * Find shareCertificateMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareCertificateMaster
 * @return {Promise<{shareCertificateMaster:ShareCertificateMasterType[]} & PaginationType>} the shareCertificateMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    shareCertificateMaster: ShareCertificateMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareCertificateMaster = await paginate(
    limit,
    offset,
    querystring.search
  );
  const shareCertificateMasterCount = await count(querystring.search);
  return {
    shareCertificateMaster,
    ...getPaginationKeys({
      count: shareCertificateMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export shareCertificateMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the shareCertificateMaster
 * @return {Promise<{file: ExcelBuffer}>} the shareCertificateMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const shareCertificateMasters = await getAll(querystring.search);

  const buffer = await generateExcel<ShareCertificateMasterType>(
    "Share Certificate Masters",
    ExcelShareCertificateMastersColumns,
    shareCertificateMasters
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a shareCertificateMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the shareCertificateMaster
 * @return {Promise<ShareCertificateMasterType>} the destroyed shareCertificateMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<ShareCertificateMasterType | null> {
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
  const shareCertificateMasterInsertData: ShareCertificateMasterExcelData[] =
    [];
  const failedShareCertificateMasterImport: (ShareCertificateMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const shareCertificateMasterData = {
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
        endorsement: row.getCell(3).value?.toString() as "Yes" | "No",
        endorsementFolio: row.getCell(4).value?.toString(),
        endorsementDate: row.getCell(5).value?.toString(),
        endorsementShareholderName1: row.getCell(6).value?.toString(),
        endorsementShareholderName2: row.getCell(7).value?.toString(),
        endorsementShareholderName3: row.getCell(8).value?.toString(),
        companyID: Number(row.getCell(9).value?.toString()),
      };
      shareCertificateMasterInsertData.push(shareCertificateMasterData);
    }
  });
  for (let i = 0; i < shareCertificateMasterInsertData.length; i++) {
    try {
      await createShareCertificateMasterBodySchema.parseAsync(
        shareCertificateMasterInsertData[i]
      );
      await createShareCertificateMasterUniqueSchema.parseAsync({
        companyID: shareCertificateMasterInsertData[i].companyID,
      });
      const validatedShareCertificateMasterData = {
        instrumentType: shareCertificateMasterInsertData[i].instrumentType,
        equityType: shareCertificateMasterInsertData[i].equityType,
        endorsement: shareCertificateMasterInsertData[i].endorsement,
        endorsementFolio: shareCertificateMasterInsertData[i].endorsementFolio,
        endorsementDate:
          shareCertificateMasterInsertData[i].endorsementDate !== undefined
            ? new Date(
                shareCertificateMasterInsertData[i].endorsementDate as string
              )
            : undefined,
        endorsementShareholderName1:
          shareCertificateMasterInsertData[i].endorsementShareholderName1,
        endorsementShareholderName2:
          shareCertificateMasterInsertData[i].endorsementShareholderName2,
        endorsementShareholderName3:
          shareCertificateMasterInsertData[i].endorsementShareholderName3,
        companyID: Number(shareCertificateMasterInsertData[i].companyID),
      };
      await createShareCertificateMaster(validatedShareCertificateMasterData);
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedShareCertificateMasterImport.push({
        ...shareCertificateMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedShareCertificateMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      ShareCertificateMasterExcelData & { error: string }
    >(
      "Share_Certificate_Master",
      ExcelFailedShareCertificateMasterColumn,
      failedShareCertificateMasterImport,
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
