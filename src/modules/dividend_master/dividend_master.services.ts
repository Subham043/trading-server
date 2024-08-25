import {
  count,
  countAll,
  createDividendMaster,
  getAll,
  getById,
  paginateAll,
  remove,
  removeMultiple,
  updateDividendMaster,
} from "./dividend_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  DividendMasterCreateType,
  DividendMasterType,
  DividendMasterUpdateType,
} from "../../@types/dividend_master.type";
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
  DividendMasterExcelData,
  ExcelDividendMasteresColumns,
  ExcelFailedDividendMasterColumn,
  DividendMasterExportExcelData,
} from "./dividend_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createDividendMasterBodySchema,
  companyMasterIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new dividendMaster with the provided dividendMaster information.
 *
 * @param {DividendMasterCreateType} dividendMaster - the dividendMaster information
 * @return {Promise<DividendMasterType>} a promise that resolves with the created dividendMaster data
 */
export async function create(
  data: DividendMasterCreateType,
  companyMasterId: number
): Promise<DividendMasterType> {
  const result = await createDividendMaster({ ...data, companyMasterId });
  return {
    ...result,
  };
}

/**
 * Update DividendMasterType information.
 *
 * @param {CreateDividendMasterBody} DividendMasterType - the DividendMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the DividendMasterType to be updated
 * @return {Promise<DividendMasterType>} the updated DividendMasterType information
 */
export async function update(
  data: DividendMasterUpdateType,
  param: GetIdParam
): Promise<DividendMasterType> {
  const result = await updateDividendMaster(data, param.id);
  return {
    ...result,
  };
}

/**
 * Find a dividendMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the dividendMaster
 * @return {Promise<DividendMasterType>} the dividendMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<DividendMasterType> {
  const { id } = params;

  const dividendMaster = await getById(id);
  if (!dividendMaster) {
    throw new NotFoundError();
  }
  return {
    ...dividendMaster,
  };
}

/**
 * Find dividendMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the dividendMaster
 * @return {Promise<{dividendMaster:DividendMasterType[]} & PaginationType>} the dividendMaster found by ID
 */
export async function list(
  companyMasterId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    dividendMaster: DividendMasterType[];
  } & PaginationType
> {
  const dividendMaster = await getAll(companyMasterId, querystring.search);
  const dividendMasterCount = await count(companyMasterId, querystring.search);
  return {
    dividendMaster,
    ...getPaginationKeys({
      count: dividendMasterCount,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    dividendMaster: DividendMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const dividendMaster = await paginateAll(limit, offset, querystring.search);
  const dividendMasterCount = await countAll(querystring.search);
  return {
    dividendMaster,
    ...getPaginationKeys({
      count: dividendMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export dividendMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the dividendMaster
 * @return {Promise<{file: ExcelBuffer}>} the dividendMaster found by ID
 */
export async function exportExcel(
  companyMasterId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const excelData = await getAll(companyMasterId, querystring.search);

  const buffer = await generateExcel<DividendMasterExportExcelData>(
    "Dividend Masters",
    ExcelDividendMasteresColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a dividendMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the dividendMaster
 * @return {Promise<DividendMasterType>} the destroyed dividendMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<DividendMasterType> {
  const { id } = params;

  const dividendMaster = await findById(params);
  await remove(id);
  return dividendMaster;
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
  const dividendMasterInsertData: DividendMasterExcelData[] = [];
  const failedDividendMasterImport: (DividendMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const dividendMasterData = {
        recorded_date: row.getCell(1).value?.toString() || '',
        financial_year: row.getCell(2).value?.toString(),
        dividend_per_share: row.getCell(3).value?.toString(),
        companyID: Number(row.getCell(4).value?.toString()),
      };
      dividendMasterInsertData.push(dividendMasterData);
    }
  });
  for (let i = 0; i < dividendMasterInsertData.length; i++) {
    try {
      await createDividendMasterBodySchema.parseAsync(
        dividendMasterInsertData[i]
      );
      await companyMasterIdSchema.parseAsync({
        companyMasterId: dividendMasterInsertData[i].companyID,
      });
      await createDividendMaster({
        ...dividendMasterInsertData[i],
        companyMasterId: dividendMasterInsertData[i].companyID,
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
      failedDividendMasterImport.push({
        ...dividendMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedDividendMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      DividendMasterExcelData & { error: string }
    >(
      "Dividend_Master",
      ExcelFailedDividendMasterColumn,
      failedDividendMasterImport,
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
