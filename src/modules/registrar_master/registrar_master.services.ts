import {
  count,
  createRegistrarMaster,
  excel,
  getById,
  paginate,
  remove,
  removeMultiple,
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
  RegistrarMasterExcelData,
  ExcelRegistrarMastersColumns,
  ExcelFailedRegistrarMasterColumn,
  RegistrarMasterExportExcelData,
} from "./registrar_master.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import { createRegistrarMasterBodySchema } from "./schemas/create.schema";
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
  const registrarMasters = await excel(querystring.search);

  const excelData = registrarMasters
    .map((registrarMaster) => {
      if (registrarMaster.registrarMasterBranches.length > 0) {
        const data = registrarMaster.registrarMasterBranches.map(
          (registrarMasterBranch) => {
            return {
              id: registrarMasterBranch.id,
              registrar_name: registrarMaster.registrar_name,
              sebi_regn_id: registrarMaster.sebi_regn_id,
              registrarMasterID: registrarMaster.id,
              branch: registrarMasterBranch.branch,
              city: registrarMasterBranch.city,
              state: registrarMasterBranch.state,
              pincode: registrarMasterBranch.pincode,
              address: registrarMasterBranch.address,
            };
          }
        );
        return data.flat(1);
      }
      return {
        id: null,
        registrar_name: registrarMaster.registrar_name,
        sebi_regn_id: registrarMaster.sebi_regn_id,
        registrarMasterID: registrarMaster.id,
        branch: null,
        city: null,
        state: null,
        pincode: null,
        address: null,
      };
    })
    .flat(1);
  const buffer = await generateExcel<RegistrarMasterExportExcelData>(
    "Registrar Masters",
    ExcelRegistrarMastersColumns,
    excelData
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
      await createRegistrarMaster({
        ...registrarMasterInsertData[i],
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
      "Registrar_Master",
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
