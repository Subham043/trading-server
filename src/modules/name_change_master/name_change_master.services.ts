import {
  count,
  countCompany,
  createNameChangeMaster,
  getAll,
  getAllCompany,
  getByCompanyId,
  getById,
  paginate,
  paginateCompany,
  remove,
  removeMultiple,
  updateNameChangeMaster,
} from "./name_change_master.repository";
import { InvalidRequestError, NotFoundError } from "../../utils/exceptions";
import {
  NameChangeMasterCreateType,
  NameChangeMasterType,
  NameChangeMasterUpdateType,
} from "../../@types/name_change_master.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import {
  GetCompanyIdParam,
  GetIdParam,
  GetIdsBody,
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
  readExcel,
  storeExcel,
} from "../../utils/excel";
import {
  ExcelFailedNameChangeMasterColumn,
  ExcelNameChangeCompanyColumns,
  ExcelNameChangeMastersColumns,
  NameChangeMasterExcelData,
  NameChangeMasterExportExcelData,
} from "./name_change_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createNameChangeMasterBodySchema,
  createNameChangeMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Create a new nameChangeMaster with the provided nameChangeMaster information.
 *
 * @param {NameChangeMasterCreateType} nameChangeMaster - the nameChangeMaster information
 * @return {Promise<NameChangeMasterType>} a promise that resolves with the created nameChangeMaster data
 */
export async function create(
  data: NameChangeMasterCreateType,
  companyId: number
): Promise<NameChangeMasterType> {
  return await createNameChangeMaster({
    ...data,
    companyID: companyId,
  });
}

/**
 * Update NameChangeMasterType information.
 *
 * @param {CreateNameChangeMasterBody} NameChangeMasterType - the NameChangeMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the NameChangeMasterType to be updated
 * @return {Promise<NameChangeMasterType>} the updated NameChangeMasterType information
 */
export async function update(
  data: NameChangeMasterUpdateType,
  param: GetIdParam
): Promise<NameChangeMasterType> {
  return await updateNameChangeMaster(data, param.id);
}

/**
 * Find a nameChangeMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the nameChangeMaster
 * @return {Promise<NameChangeMasterType>} the nameChangeMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<NameChangeMasterType> {
  const { id } = params;

  const nameChangeMaster = await getById(id);
  if (!nameChangeMaster) {
    throw new NotFoundError();
  }
  return nameChangeMaster;
}

export async function findByCompanyId(params: GetCompanyIdParam): Promise<
  | (NameChangeMasterType & {
      companyMaster: {
        id: number;
        CIN: string | null;
        ISIN: string | null;
        faceValue: Decimal | null;
      } | null;
    })
  | null
> {
  const { companyId } = params;
  return await getByCompanyId(companyId);
}

/**
 * Find nameChangeMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the nameChangeMaster
 * @return {Promise<{nameChangeMaster:NameChangeMasterType[]} & PaginationType>} the nameChangeMaster found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  params: GetCompanyIdParam
): Promise<
  {
    nameChangeMaster: NameChangeMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const nameChangeMaster = await paginate(
    limit,
    offset,
    params.companyId,
    querystring.search
  );
  const nameChangeMasterCount = await count(
    params.companyId,
    querystring.search
  );
  return {
    nameChangeMaster,
    ...getPaginationKeys({
      count: nameChangeMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export nameChangeMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the nameChangeMaster
 * @return {Promise<{file: ExcelBuffer}>} the nameChangeMaster found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  params: GetCompanyIdParam
): Promise<{
  file: ExcelBuffer;
}> {
  const nameChangeMasters = await getAll(params.companyId, querystring.search);

  const buffer = await generateExcel<NameChangeMasterType>(
    "Name Change Masters",
    ExcelNameChangeMastersColumns,
    nameChangeMasters
  );

  return {
    file: buffer,
  };
}

export async function listCompany(querystring: GetPaginationQuery): Promise<
  {
    nameChangeMaster: (NameChangeMasterType & {
      CIN?: string | null | undefined;
      ISIN?: string | null | undefined;
      faceValue?: Decimal | null | undefined;
      companyId?: number | null | undefined;
    })[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const nameChangeMaster = await paginateCompany(
    limit,
    offset,
    querystring.search
  );
  const nameChangeMasterCount = await countCompany(querystring.search);
  return {
    nameChangeMaster,
    ...getPaginationKeys({
      count: nameChangeMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function exportExcelCompany(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const nameChangeMasters = await getAllCompany(querystring.search);

  const excelData = nameChangeMasters.map((companyMaster) => {
    return {
      id: companyMaster.currentNameChangeMasters?.id,
      companyId: companyMaster.id,
      currentName: companyMaster.currentNameChangeMasters?.currentName,
      previousName: companyMaster.currentNameChangeMasters?.previousName,
      dateNameChange: companyMaster.currentNameChangeMasters?.dateNameChange,
      NSE: companyMaster.currentNameChangeMasters?.NSE,
      BSE: companyMaster.currentNameChangeMasters?.BSE,
      ISIN: companyMaster.ISIN,
      CIN: companyMaster.CIN,
      faceValue: companyMaster.faceValue,
    };
  });

  const buffer = await generateExcel<NameChangeMasterExportExcelData>(
    "Name Change Masters",
    ExcelNameChangeCompanyColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a nameChangeMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the nameChangeMaster
 * @return {Promise<NameChangeMasterType>} the destroyed nameChangeMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<NameChangeMasterType> {
  const { id } = params;

  const nameChangeMaster = await findById(params);
  const nameChangeMasterCount = await count(
    nameChangeMaster.companyID ? nameChangeMaster.companyID : 0,
    undefined
  );
  if (nameChangeMasterCount === 1) {
    throw new InvalidRequestError(
      "Company must have at least one name change master"
    );
  }
  await remove(id);
  return nameChangeMaster;
}

export async function destroyMultiple(
  params: GetCompanyIdParam,
  body: GetIdsBody
): Promise<void> {
  const { companyId } = params;
  const { id } = body;

  const nameChangeMasterCount = await count(companyId, undefined);
  if (nameChangeMasterCount === 1) {
    throw new InvalidRequestError(
      "Company must have at least one name change master"
    );
  }
  await removeMultiple(id, companyId);
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
  const nameChangeMasterInsertData: NameChangeMasterExcelData[] = [];
  const failedNameChangeMasterImport: (NameChangeMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const nameChangeMasterData = {
        NSE: row.getCell(1).value?.toString(),
        BSE: row.getCell(2).value?.toString(),
        currentName: row.getCell(3).value?.toString(),
        previousName: row.getCell(4).value?.toString(),
        dateNameChange: (
          row.getCell(5).value as Date | undefined
        )?.toISOString(),
        companyId: Number(row.getCell(6).value),
      };
      nameChangeMasterInsertData.push(nameChangeMasterData);
    }
  });
  for (let i = 0; i < nameChangeMasterInsertData.length; i++) {
    try {
      await createNameChangeMasterBodySchema.parseAsync(
        nameChangeMasterInsertData[i]
      );
      await createNameChangeMasterUniqueSchema.parseAsync({
        companyId: nameChangeMasterInsertData[i].companyId,
        NSE: nameChangeMasterInsertData[i].NSE,
        BSE: nameChangeMasterInsertData[i].BSE,
      });
      const validatedNameChangeMasterData = {
        NSE: nameChangeMasterInsertData[i].NSE,
        BSE: nameChangeMasterInsertData[i].BSE,
        currentName: nameChangeMasterInsertData[i].currentName,
        previousName: nameChangeMasterInsertData[i].previousName,
        dateNameChange:
          nameChangeMasterInsertData[i].dateNameChange !== undefined
            ? new Date(nameChangeMasterInsertData[i].dateNameChange as string)
            : new Date(),
        companyID: Number(nameChangeMasterInsertData[i].companyId),
      };
      await createNameChangeMaster(validatedNameChangeMasterData);
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedNameChangeMasterImport.push({
        ...nameChangeMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedNameChangeMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      NameChangeMasterExcelData & { error: string }
    >(
      "Name_Change_Master",
      ExcelFailedNameChangeMasterColumn,
      failedNameChangeMasterImport,
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
