import {
  count,
  countAll,
  createCertificate,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updateCertificate,
} from "./certificate.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CertificateCreateType,
  CertificateType,
  CertificateUpdateType,
} from "../../@types/certificate.type";
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
  CertificateExcelData,
  ExcelCertificateesColumns,
  ExcelFailedCertificateColumn,
  CertificateExportExcelData,
} from "./certificate.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createCertificateBodySchema,
  folioIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new certificate with the provided certificate information.
 *
 * @param {CertificateCreateType} certificate - the certificate information
 * @return {Promise<CertificateType>} a promise that resolves with the created certificate data
 */
export async function create(
  data: CertificateCreateType,
  folioId: number
): Promise<CertificateType> {
  return await createCertificate({ ...data, folioId });
}

/**
 * Update CertificateType information.
 *
 * @param {CreateCertificateBody} CertificateType - the CertificateType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CertificateType to be updated
 * @return {Promise<CertificateType>} the updated CertificateType information
 */
export async function update(
  data: CertificateUpdateType,
  param: GetIdParam
): Promise<CertificateType> {
  return await updateCertificate(data, param.id);
}

/**
 * Find a certificate by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the certificate
 * @return {Promise<CertificateType>} the certificate found by ID
 */
export async function findById(params: GetIdParam): Promise<CertificateType> {
  const { id } = params;

  const certificate = await getById(id);
  if (!certificate) {
    throw new NotFoundError();
  }
  return certificate;
}

/**
 * Find certificate by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the certificate
 * @return {Promise<{certificate:CertificateType[]} & PaginationType>} the certificate found by ID
 */
export async function list(
  folioId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    certificate: CertificateType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const certificate = await paginate(
    folioId,
    limit,
    offset,
    querystring.search
  );
  const certificateCount = await count(folioId, querystring.search);
  return {
    certificate,
    ...getPaginationKeys({
      count: certificateCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    certificate: CertificateType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const certificate = await paginateAll(limit, offset, querystring.search);
  const certificateCount = await countAll(querystring.search);
  return {
    certificate,
    ...getPaginationKeys({
      count: certificateCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export certificate by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the certificate
 * @return {Promise<{file: ExcelBuffer}>} the certificate found by ID
 */
export async function exportExcel(
  folioId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const excelData = await getAll(folioId, querystring.search);

  const buffer = await generateExcel<CertificateExportExcelData>(
    "Certificates",
    ExcelCertificateesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a certificate based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the certificate
 * @return {Promise<CertificateType>} the destroyed certificate
 */
export async function destroy(params: GetIdParam): Promise<CertificateType> {
  const { id } = params;

  const certificate = await findById(params);
  await remove(id);
  return certificate;
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
  const certificateInsertData: CertificateExcelData[] = [];
  const failedCertificateImport: (CertificateExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const certificateData = {
        certificateNumber: row.getCell(1).value?.toString() as string,
        certificateSerialNumber: row.getCell(2).value?.toString(),
        folioID: Number(row.getCell(3).value?.toString()),
      };
      certificateInsertData.push(certificateData);
    }
  });
  for (let i = 0; i < certificateInsertData.length; i++) {
    try {
      await createCertificateBodySchema.parseAsync(certificateInsertData[i]);
      await folioIdSchema.parseAsync({
        folioId: certificateInsertData[i].folioID,
      });
      await createCertificate({
        ...certificateInsertData[i],
        folioId: certificateInsertData[i].folioID,
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
      failedCertificateImport.push({
        ...certificateInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedCertificateImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<CertificateExcelData & { error: string }>(
      "Certificate",
      ExcelFailedCertificateColumn,
      failedCertificateImport,
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