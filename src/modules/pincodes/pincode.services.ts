import {
  count,
  createPincode,
  getAll,
  getAllDistinct,
  getById,
  paginate,
  remove,
  updatePincode,
} from "./pincode.repository";
import { NotFoundError } from "../../utils/exceptions";
import { CreatePincodeBody } from "./schemas/create.schema";
import { PincodeType } from "../../@types/pincode.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { UpdatePincodeBody } from "./schemas/update.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import { ExcelBuffer, generateExcel } from "../../utils/excel";
import { ExcelPincodesColumn } from "./pincode.model";

/**
 * Create a new pincode with the provided pincode information.
 *
 * @param {CreatePincodeBody} data - the pincode information
 * @return {Promise<PincodeType>} a promise that resolves with the created pincode data
 */
export async function create(data: CreatePincodeBody): Promise<PincodeType> {
  return await createPincode(data);
}

/**
 * Update pincode information.
 *
 * @param {CreatePincodeBody} data - the pincode information to be updated
 * @param {GetIdParam} param - the parameter used to identify the pincode to be updated
 * @return {Promise<PincodeType>} the updated pincode information
 */
export async function update(
  data: UpdatePincodeBody,
  param: GetIdParam
): Promise<PincodeType> {
  return await updatePincode(data, param.id);
}

/**
 * Find a pincode by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the pincode
 * @return {Promise<PincodeType>} the pincode found by ID
 */
export async function findById(params: GetIdParam): Promise<PincodeType> {
  const { id } = params;

  const pincode = await getById(id);
  if (!pincode) {
    throw new NotFoundError();
  }
  return pincode;
}

/**
 * Find pincodes by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the pincode
 * @return {Promise<{pincode:PincodeType[]} & PaginationType>} the pincode found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    pincode: PincodeType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const pincode = await paginate(limit, offset, querystring.search);
  const pincodeCount = await count(querystring.search);
  return {
    pincode,
    ...getPaginationKeys({
      count: pincodeCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export pincodes by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the pincode
 * @return {Promise<{file: ExcelBuffer}>} the pincode found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const pincodes = await getAll(querystring.search);

  const buffer = await generateExcel<PincodeType>(
    "Pincodes",
    ExcelPincodesColumn,
    pincodes
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a pincode based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the pincode
 * @return {Promise<PincodeType>} the destroyed pincode
 */
export async function destroy(params: GetIdParam): Promise<PincodeType> {
  const { id } = params;

  const pincode = await findById(params);
  await remove(id);
  return pincode;
}

export async function getPincodesSelect(querystring: GetSearchQuery): Promise<
  {
    id: number;
    pincode: string;
    state_name: string;
  }[]
> {
  return await getAllDistinct(querystring.search);
}
