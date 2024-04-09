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
} from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { ExcelBuffer, generateExcel } from "../../utils/excel";

const nameChangeMastersColumns = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "New Name" },
  { key: "previousName", header: "Previous Name" },
  { key: "dateNameChange", header: "Date of Name Change" },
  { key: "companyId", header: "Company Master Id" },
  { key: "createdAt", header: "Created At" },
];

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
  return await createNameChangeMaster({ ...data, companyID: companyId });
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
  NameChangeMasterType & {
    companyId?: number | null | undefined;
    CIN?: string | null | undefined;
    ISIN?: string | null | undefined;
    faceValue?: number | null | undefined;
  }
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
    nameChangeMastersColumns,
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
      faceValue?: number | null | undefined;
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

  const nameChangeCompanyColumns = [
    ...nameChangeMastersColumns,
    { key: "CIN", header: "CIN" },
    { key: "ISIN", header: "ISIN" },
    { key: "faceValue", header: "Face Value" },
  ];

  const buffer = await generateExcel<NameChangeMasterType>(
    "Name Change Masters",
    nameChangeCompanyColumns,
    nameChangeMasters
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
    nameChangeMaster.companyId ? nameChangeMaster.companyId : 0,
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
