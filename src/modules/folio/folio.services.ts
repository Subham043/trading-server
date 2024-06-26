import {
  count,
  countAll,
  createFolio,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updateFolio,
} from "./folio.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  FolioCreateType,
  FolioType,
  FolioUpdateType,
} from "../../@types/folio.type";
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
  FolioExcelData,
  ExcelFolioesColumns,
  ExcelFailedFolioColumn,
  FolioExportExcelData,
} from "./folio.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createFolioBodySchema,
  shareCertificateIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new folio with the provided folio information.
 *
 * @param {FolioCreateType} folio - the folio information
 * @return {Promise<FolioType>} a promise that resolves with the created folio data
 */
export async function create(
  data: FolioCreateType,
  shareCertificateId: number
): Promise<FolioType> {
  return await createFolio({ ...data, shareCertificateId });
}

/**
 * Update FolioType information.
 *
 * @param {CreateFolioBody} FolioType - the FolioType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the FolioType to be updated
 * @return {Promise<FolioType>} the updated FolioType information
 */
export async function update(
  data: FolioUpdateType,
  param: GetIdParam
): Promise<FolioType> {
  return await updateFolio(data, param.id);
}

/**
 * Find a folio by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the folio
 * @return {Promise<FolioType>} the folio found by ID
 */
export async function findById(params: GetIdParam): Promise<FolioType> {
  const { id } = params;

  const folio = await getById(id);
  if (!folio) {
    throw new NotFoundError();
  }
  return folio;
}

/**
 * Find folio by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the folio
 * @return {Promise<{folio:FolioType[]} & PaginationType>} the folio found by ID
 */
export async function list(
  shareCertificateId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    folio: FolioType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const folio = await paginate(
    shareCertificateId,
    limit,
    offset,
    querystring.search
  );
  const folioCount = await count(shareCertificateId, querystring.search);
  return {
    folio,
    ...getPaginationKeys({
      count: folioCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    folio: FolioType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const folio = await paginateAll(limit, offset, querystring.search);
  const folioCount = await countAll(querystring.search);
  return {
    folio,
    ...getPaginationKeys({
      count: folioCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export folio by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the folio
 * @return {Promise<{file: ExcelBuffer}>} the folio found by ID
 */
export async function exportExcel(
  shareCertificateId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const folios = await getAll(shareCertificateId, querystring.search);

  const excelData = folios.map((folio) => {
    return {
      id: folio.id,
      instrumentType: folio.shareCertificateMaster?.instrumentType,
      equityType: folio.shareCertificateMaster?.equityType,
      Folio: folio.Folio,
      certificateNumber: folio.certificateNumber,
      certificateSerialNumber: folio.certificateSerialNumber,
      shareholderName1: folio.shareholderName1,
      shareholderName2: folio.shareholderName2,
      shareholderName3: folio.shareholderName3,
      noOfShares: folio.noOfShares,
      noOfSharesWords: folio.noOfSharesWords,
      dateOfAllotment: folio.dateOfAllotment,
      faceValue: folio.faceValue,
      distinctiveNosFrom: folio.distinctiveNosFrom,
      distinctiveNosTo: folio.distinctiveNosTo,
      createdAt: folio.createdAt,
      shareCertificateID: folio.shareCertificateID,
    };
  });

  const buffer = await generateExcel<FolioExportExcelData>(
    "Folios",
    ExcelFolioesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a folio based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the folio
 * @return {Promise<FolioType>} the destroyed folio
 */
export async function destroy(params: GetIdParam): Promise<FolioType> {
  const { id } = params;

  const folio = await findById(params);
  await remove(id);
  return folio;
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
  const folioInsertData: FolioExcelData[] = [];
  const failedFolioImport: (FolioExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const folioData = {
        faceValue: isNaN(Number(row.getCell(10).value?.toString()))
          ? undefined
          : Number(row.getCell(10).value?.toString()),
        Folio: row.getCell(1).value?.toString() as string,
        certificateNumber: row.getCell(2).value?.toString(),
        certificateSerialNumber: row.getCell(3).value?.toString(),
        shareholderName1: row.getCell(4).value?.toString(),
        shareholderName2: row.getCell(5).value?.toString(),
        shareholderName3: row.getCell(6).value?.toString(),
        noOfShares: row.getCell(7).value?.toString(),
        noOfSharesWords: row.getCell(8).value?.toString(),
        dateOfAllotment: (
          row.getCell(9).value as Date | undefined
        )?.toISOString(),
        distinctiveNosFrom: row.getCell(11).value?.toString(),
        distinctiveNosTo: row.getCell(12).value?.toString(),
        shareCertificateID: Number(row.getCell(13).value?.toString()),
      };
      folioInsertData.push(folioData);
    }
  });
  for (let i = 0; i < folioInsertData.length; i++) {
    try {
      await createFolioBodySchema.parseAsync(folioInsertData[i]);
      await shareCertificateIdSchema.parseAsync({
        shareCertificateId: folioInsertData[i].shareCertificateID,
      });
      await createFolio({
        ...folioInsertData[i],
        shareCertificateId: folioInsertData[i].shareCertificateID,
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
      failedFolioImport.push({
        ...folioInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedFolioImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<FolioExcelData & { error: string }>(
      "Folio",
      ExcelFailedFolioColumn,
      failedFolioImport,
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
