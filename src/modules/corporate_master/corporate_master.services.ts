import {
  count,
  countAll,
  createCorporateMaster,
  getAll,
  getById,
  paginateAll,
  remove,
  removeMultiple,
  updateCorporateMaster,
} from "./corporate_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CorporateMasterCreateType,
  CorporateMasterType,
  CorporateMasterUpdateType,
} from "../../@types/corporate_master.type";
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
  CorporateMasterExcelData,
  ExcelCorporateMasteresColumns,
  ExcelFailedCorporateMasterColumn,
  CorporateMasterExportExcelData,
} from "./corporate_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createCorporateMasterBodySchema,
  companyMasterIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new corporateMaster with the provided corporateMaster information.
 *
 * @param {CorporateMasterCreateType} corporateMaster - the corporateMaster information
 * @return {Promise<CorporateMasterType>} a promise that resolves with the created corporateMaster data
 */
export async function create(
  data: CorporateMasterCreateType,
  companyMasterId: number
): Promise<CorporateMasterType> {
  const result = await createCorporateMaster({ ...data, companyMasterId });
  const exchange = Math.floor(
    Number(result.numerator) !== 0 && Number(result.denominator) !== 0
      ? (Number(result.originalHolding) * Number(result.numerator)) /
          Number(result.denominator)
      : 0
  );
  const consolidatedHolding = Number(result.originalHolding) + exchange;
  return {
    ...result,
    exchange: exchange.toString(),
    consolidatedHolding: consolidatedHolding.toString(),
  };
}

/**
 * Update CorporateMasterType information.
 *
 * @param {CreateCorporateMasterBody} CorporateMasterType - the CorporateMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CorporateMasterType to be updated
 * @return {Promise<CorporateMasterType>} the updated CorporateMasterType information
 */
export async function update(
  data: CorporateMasterUpdateType,
  param: GetIdParam
): Promise<CorporateMasterType> {
  const result = await updateCorporateMaster(data, param.id);
  const exchange = Math.floor(
    Number(result.numerator) !== 0 && Number(result.denominator) !== 0
      ? (Number(result.originalHolding) * Number(result.numerator)) /
          Number(result.denominator)
      : 0
  );
  const consolidatedHolding = Number(result.originalHolding) + exchange;
  return {
    ...result,
    exchange: exchange.toString(),
    consolidatedHolding: consolidatedHolding.toString(),
  };
}

/**
 * Find a corporateMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the corporateMaster
 * @return {Promise<CorporateMasterType>} the corporateMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<CorporateMasterType> {
  const { id } = params;

  const corporateMaster = await getById(id);
  if (!corporateMaster) {
    throw new NotFoundError();
  }
  const exchange = Math.floor(
    Number(corporateMaster.numerator) !== 0 &&
      Number(corporateMaster.denominator) !== 0
      ? (Number(corporateMaster.originalHolding) *
          Number(corporateMaster.numerator)) /
          Number(corporateMaster.denominator)
      : 0
  );
  const consolidatedHolding =
    Number(corporateMaster.originalHolding) + exchange;
  return {
    ...corporateMaster,
    exchange: exchange.toString(),
    consolidatedHolding: consolidatedHolding.toString(),
  };
}

/**
 * Find corporateMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the corporateMaster
 * @return {Promise<{corporateMaster:CorporateMasterType[]} & PaginationType>} the corporateMaster found by ID
 */
export async function list(
  companyMasterId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    corporateMaster: CorporateMasterType[];
  } & PaginationType
> {
  const corporateMasterData = await getAll(companyMasterId, querystring.search);
  const corporateMaster = corporateMasterData.map((item) => {
    const exchange = Math.floor(
      Number(item.numerator) !== 0 && Number(item.denominator) !== 0
        ? (Number(item.originalHolding) * Number(item.numerator)) /
            Number(item.denominator)
        : 0
    );
    const consolidatedHolding = Number(item.originalHolding) + exchange;
    return {
      ...item,
      exchange: exchange.toString(),
      consolidatedHolding: consolidatedHolding.toString(),
    };
  });
  const corporateMasterCount = await count(companyMasterId, querystring.search);
  return {
    corporateMaster,
    ...getPaginationKeys({
      count: corporateMasterCount,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    corporateMaster: CorporateMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const corporateMasterData = await paginateAll(
    limit,
    offset,
    querystring.search
  );
  const corporateMasterCount = await countAll(querystring.search);
  const corporateMaster = corporateMasterData.map((item) => {
    const exchange = Math.floor(
      Number(item.numerator) !== 0 && Number(item.denominator) !== 0
        ? (Number(item.originalHolding) * Number(item.numerator)) /
            Number(item.denominator)
        : 0
    );
    const consolidatedHolding = Number(item.originalHolding) + exchange;
    return {
      ...item,
      exchange: exchange.toString(),
      consolidatedHolding: consolidatedHolding.toString(),
    };
  });
  return {
    corporateMaster,
    ...getPaginationKeys({
      count: corporateMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export corporateMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the corporateMaster
 * @return {Promise<{file: ExcelBuffer}>} the corporateMaster found by ID
 */
export async function exportExcel(
  companyMasterId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const corporateMasters = await getAll(companyMasterId, querystring.search);

  const excelData = corporateMasters.map((corporateMaster) => {
    const exchange = Math.floor(
      Number(corporateMaster.numerator) !== 0 &&
        Number(corporateMaster.denominator) !== 0
        ? (Number(corporateMaster.originalHolding) *
            Number(corporateMaster.numerator)) /
            Number(corporateMaster.denominator)
        : 0
    );
    const consolidatedHolding =
      Number(corporateMaster.originalHolding) + exchange;
    return {
      ...corporateMaster,
      exchange: exchange.toString(),
      consolidatedHolding: consolidatedHolding.toString(),
    };
  });

  const buffer = await generateExcel<CorporateMasterExportExcelData>(
    "Corporate Masters",
    ExcelCorporateMasteresColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a corporateMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the corporateMaster
 * @return {Promise<CorporateMasterType>} the destroyed corporateMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<CorporateMasterType> {
  const { id } = params;

  const corporateMaster = await findById(params);
  await remove(id);
  return corporateMaster;
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
  const corporateMasterInsertData: CorporateMasterExcelData[] = [];
  const failedCorporateMasterImport: (CorporateMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const corporateMasterData = {
        type: row.getCell(1).value?.toString() as
          | "Equity"
          | "Bonus"
          | "Splits"
          | "RightsSubscribed"
          | "RightsUnsubscribed"
          | "ShareBought",
        date: row.getCell(2).value?.toString()
          ? (new Date(row.getCell(2).value!.toString()) as Date)
          : (new Date() as Date),
        numerator: row.getCell(3).value?.toString(),
        denominator: row.getCell(4).value?.toString(),
        originalHolding: row.getCell(5).value?.toString(),
        companyID: Number(row.getCell(6).value?.toString()),
      };
      corporateMasterInsertData.push(corporateMasterData);
    }
  });
  for (let i = 0; i < corporateMasterInsertData.length; i++) {
    try {
      await createCorporateMasterBodySchema.parseAsync(
        corporateMasterInsertData[i]
      );
      await companyMasterIdSchema.parseAsync({
        companyMasterId: corporateMasterInsertData[i].companyID,
      });
      await createCorporateMaster({
        ...corporateMasterInsertData[i],
        companyMasterId: corporateMasterInsertData[i].companyID,
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
      failedCorporateMasterImport.push({
        ...corporateMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedCorporateMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      CorporateMasterExcelData & { error: string }
    >(
      "Corporate_Master",
      ExcelFailedCorporateMasterColumn,
      failedCorporateMasterImport,
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
