import {
  count,
  countAll,
  createRegistrarMasterBranch,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updateRegistrarMasterBranch,
} from "./registrar_master_branch.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  RegistrarMasterBranchCreateType,
  RegistrarMasterBranchType,
  RegistrarMasterBranchUpdateType,
} from "../../@types/registrar_master_branch.type";
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
  RegistrarMasterBranchExcelData,
  ExcelRegistrarMasterBranchesColumns,
  ExcelFailedRegistrarMasterBranchColumn,
  RegistrarMasterBranchExportExcelData,
} from "./registrar_master_branch.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import {
  createRegistrarMasterBranchBodySchema,
  registrarMasterIdSchema,
} from "./schemas/create.schema";
import { ZodError } from "zod";

/**
 * Create a new registrarMaster with the provided registrarMaster information.
 *
 * @param {RegistrarMasterBranchCreateType} registrarMaster - the registrarMaster information
 * @return {Promise<RegistrarMasterBranchType>} a promise that resolves with the created registrarMaster data
 */
export async function create(
  data: RegistrarMasterBranchCreateType,
  registrarMasterId: number
): Promise<RegistrarMasterBranchType> {
  return await createRegistrarMasterBranch({ ...data, registrarMasterId });
}

/**
 * Update RegistrarMasterBranchType information.
 *
 * @param {CreateRegistrarMasterBody} RegistrarMasterBranchType - the RegistrarMasterBranchType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the RegistrarMasterBranchType to be updated
 * @return {Promise<RegistrarMasterBranchType>} the updated RegistrarMasterBranchType information
 */
export async function update(
  data: RegistrarMasterBranchUpdateType,
  param: GetIdParam
): Promise<RegistrarMasterBranchType> {
  return await updateRegistrarMasterBranch(data, param.id);
}

/**
 * Find a registrarMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the registrarMaster
 * @return {Promise<RegistrarMasterBranchType>} the registrarMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<RegistrarMasterBranchType> {
  const { id } = params;

  const registrarMasterBranch = await getById(id);
  if (!registrarMasterBranch) {
    throw new NotFoundError();
  }
  return registrarMasterBranch;
}

/**
 * Find registrarMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the registrarMaster
 * @return {Promise<{registrarMaster:RegistrarMasterBranchType[]} & PaginationType>} the registrarMaster found by ID
 */
export async function list(
  registrarMasterId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    registrarMasterBranch: RegistrarMasterBranchType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const registrarMasterBranch = await paginate(
    registrarMasterId,
    limit,
    offset,
    querystring.search
  );
  const registrarMasterBranchCount = await count(
    registrarMasterId,
    querystring.search
  );
  return {
    registrarMasterBranch,
    ...getPaginationKeys({
      count: registrarMasterBranchCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    registrarMasterBranch: RegistrarMasterBranchType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const registrarMasterBranch = await paginateAll(
    limit,
    offset,
    querystring.search
  );
  const registrarMasterBranchCount = await countAll(querystring.search);
  return {
    registrarMasterBranch,
    ...getPaginationKeys({
      count: registrarMasterBranchCount,
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
export async function exportExcel(
  registrarMasterId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const registrarMasterBranches = await getAll(
    registrarMasterId,
    querystring.search
  );

  const excelData = registrarMasterBranches.map((registrarMasterBranch) => {
    return {
      id: registrarMasterBranch.id,
      registrar_name: registrarMasterBranch.registrarMaster?.registrar_name,
      sebi_regn_id: registrarMasterBranch.registrarMaster?.sebi_regn_id,
      address: registrarMasterBranch.address,
      city: registrarMasterBranch.city,
      state: registrarMasterBranch.state,
      pincode: registrarMasterBranch.pincode,
      telephone1: registrarMasterBranch.telephone1,
      telephone2: registrarMasterBranch.telephone2,
      email: registrarMasterBranch.email,
      website: registrarMasterBranch.website,
      nameContactPerson: registrarMasterBranch.nameContactPerson,
      emailContactPerson: registrarMasterBranch.emailContactPerson,
      phoneContactPerson: registrarMasterBranch.phoneContactPerson,
      designationContactPerson: registrarMasterBranch.designationContactPerson,
      officerAssigned: registrarMasterBranch.officerAssigned,
      branch: registrarMasterBranch.branch,
      createdAt: registrarMasterBranch.createdAt,
      registrarMasterID: registrarMasterBranch.registrarMasterID,
    };
  });

  const buffer = await generateExcel<RegistrarMasterBranchExportExcelData>(
    "Registrar Master Branches",
    ExcelRegistrarMasterBranchesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a registrarMasterBranch based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the registrarMasterBranch
 * @return {Promise<RegistrarMasterBranchType>} the destroyed registrarMasterBranch
 */
export async function destroy(
  params: GetIdParam
): Promise<RegistrarMasterBranchType> {
  const { id } = params;

  const registrarMasterBranch = await findById(params);
  await remove(id);
  return registrarMasterBranch;
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
  const registrarMasterBranchInsertData: RegistrarMasterBranchExcelData[] = [];
  const failedRegistrarMasterBranchImport: (RegistrarMasterBranchExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const registrarMasterData = {
        branch: row.getCell(1).value?.toString(),
        address: row.getCell(2).value?.toString(),
        city: row.getCell(3).value?.toString(),
        state: row.getCell(4).value?.toString(),
        pincode: isNaN(Number(row.getCell(5).value?.toString()))
          ? undefined
          : Number(row.getCell(5).value?.toString()),
        telephone1: row.getCell(6).value?.toString(),
        telephone2: row.getCell(7).value?.toString(),
        email: row.getCell(8).isHyperlink
          ? row.getCell(8).toCsvString().replace("mailto:", "")
          : row.getCell(8).value?.toString(),
        website: row.getCell(9).isHyperlink
          ? row.getCell(9).toCsvString().replace("mailto:", "")
          : row.getCell(9).value?.toString(),
        nameContactPerson: row.getCell(10).value?.toString(),
        designationContactPerson: row.getCell(11).value?.toString(),
        emailContactPerson: row.getCell(12).isHyperlink
          ? row.getCell(12).toCsvString().replace("mailto:", "")
          : row.getCell(12).value?.toString(),
        phoneContactPerson: row.getCell(13).value?.toString(),
        officerAssigned: row.getCell(14).value?.toString(),
        registrarMasterId: Number(row.getCell(15).value?.toString()),
      };
      registrarMasterBranchInsertData.push(registrarMasterData);
    }
  });
  for (let i = 0; i < registrarMasterBranchInsertData.length; i++) {
    try {
      await createRegistrarMasterBranchBodySchema.parseAsync(
        registrarMasterBranchInsertData[i]
      );
      await registrarMasterIdSchema.parseAsync({
        registrarMasterId: registrarMasterBranchInsertData[i].registrarMasterId,
      });
      await createRegistrarMasterBranch({
        ...registrarMasterBranchInsertData[i],
        pincode: registrarMasterBranchInsertData[i].pincode?.toString(),
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
      failedRegistrarMasterBranchImport.push({
        ...registrarMasterBranchInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedRegistrarMasterBranchImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<
      RegistrarMasterBranchExcelData & { error: string }
    >(
      "Registrar_Master_Branch",
      ExcelFailedRegistrarMasterBranchColumn,
      failedRegistrarMasterBranchImport,
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
