import {
  count,
  createRegistrarMaster,
  getAll,
  getById,
  getCompanyMasterSelect,
  paginate,
  remove,
  updateRegistrarMaster,
} from "./registrar_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  RegistrarMasterCreateType,
  RegistrarMasterType,
  RegistrarMasterUpdateType,
} from "../../@types/registrar_master.type";
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
  RegistrarMasterExcelData,
  ExcelRegistrarMastersColumns,
  ExcelFailedRegistrarMasterColumn,
} from "./registrar_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createRegistrarMasterBodySchema,
  createRegistrarMasterUniqueSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new registrarMaster with the provided registrarMaster information.
 *
 * @param {RegistrarMasterCreateType} registrarMaster - the registrarMaster information
 * @return {Promise<RegistrarMasterType>} a promise that resolves with the created registrarMaster data
 */
export async function create(
  data: RegistrarMasterCreateType,
  userId: number
): Promise<RegistrarMasterType> {
  return await createRegistrarMaster({ ...data, createdBy: userId });
}

/**
 * Update RegistrarMasterType information.
 *
 * @param {CreateRegistrarMasterBody} RegistrarMasterType - the RegistrarMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the RegistrarMasterType to be updated
 * @return {Promise<RegistrarMasterType>} the updated RegistrarMasterType information
 */
export async function update(
  data: RegistrarMasterUpdateType,
  param: GetIdParam
): Promise<RegistrarMasterType> {
  return await updateRegistrarMaster(data, param.id);
}

/**
 * Find a registrarMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the registrarMaster
 * @return {Promise<RegistrarMasterType>} the registrarMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<RegistrarMasterType> {
  const { id } = params;

  const registrarMaster = await getById(id);
  if (!registrarMaster) {
    throw new NotFoundError();
  }
  return registrarMaster;
}

/**
 * Find registrarMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the registrarMaster
 * @return {Promise<{registrarMaster:RegistrarMasterType[]} & PaginationType>} the registrarMaster found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    registrarMaster: RegistrarMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const registrarMaster = await paginate(limit, offset, querystring.search);
  const registrarMasterCount = await count(querystring.search);
  return {
    registrarMaster,
    ...getPaginationKeys({
      count: registrarMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export registrarMaster by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the registrarMaster
 * @return {Promise<{file: ExcelBuffer}>} the registrarMaster found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const registrarMasters = await getAll(querystring.search);

  const buffer = await generateExcel<RegistrarMasterType>(
    "Registrar Masters",
    ExcelRegistrarMastersColumns,
    registrarMasters
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a registrarMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the registrarMaster
 * @return {Promise<RegistrarMasterType>} the destroyed registrarMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<RegistrarMasterType> {
  const { id } = params;

  const registrarMaster = await findById(params);
  await remove(id);
  return registrarMaster;
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
  const registrarMasterInsertData: RegistrarMasterExcelData[] = [];
  const failedRegistrarMasterImport: (RegistrarMasterExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const registrarMasterData = {
        registrar_name: (row.getCell(1).value?.toString()
          ? row.getCell(1).value?.toString()
          : "") as string,
        sebi_regn_id: (row.getCell(2).value?.toString()
          ? row.getCell(2).value?.toString()
          : "") as string,
        address: row.getCell(3).value?.toString(),
        city: row.getCell(4).value?.toString(),
        state: row.getCell(5).value?.toString(),
        pincode: Number(row.getCell(6).value?.toString()),
        telephone1: row.getCell(7).value?.toString(),
        telephone2: row.getCell(8).value?.toString(),
        email: row.getCell(9).value?.toString(),
        website: row.getCell(10).value?.toString(),
        nameContactPerson: row.getCell(11).value?.toString(),
        designationContactPerson: row.getCell(12).value?.toString(),
        emailContactPerson: row.getCell(13).value?.toString(),
        phoneContactPerson: row.getCell(14).value?.toString(),
        officerAssigned: row.getCell(15).value?.toString(),
        branch: row.getCell(16).value?.toString(),
        companyId: Number(row.getCell(17).value),
        createdBy: userId,
      };
      registrarMasterInsertData.push(registrarMasterData);
    }
  });
  for (let i = 0; i < registrarMasterInsertData.length; i++) {
    try {
      await createRegistrarMasterBodySchema.parseAsync(
        registrarMasterInsertData[i]
      );
      await createRegistrarMasterUniqueSchema.parseAsync({
        companyId: registrarMasterInsertData[i].companyId,
      });
      await createRegistrarMaster({
        ...registrarMasterInsertData[i],
        pincode: registrarMasterInsertData[i].pincode?.toString(),
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
      failedRegistrarMasterImport.push({
        ...registrarMasterInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedRegistrarMasterImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      RegistrarMasterExcelData & { error: string }
    >(
      "Failed Registrar Master Import",
      ExcelFailedRegistrarMasterColumn,
      failedRegistrarMasterImport,
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

export async function companyMasterSelect(param: {
  companyId?: string;
}): Promise<
  {
    currentName: string | null;
    companyID: number | null;
  }[]
> {
  return await getCompanyMasterSelect(param);
}
