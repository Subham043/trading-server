import {
  count,
  createLegalHeirDetail,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateLegalHeirDetail,
} from "./legal_heir_detail.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  LegalHeirDetailRepoCreateType,
  LegalHeirDetailType,
  LegalHeirDetailRepoUpdateType,
} from "../../@types/legal_heir_detail.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";

/**
 * Create a new legalHeirDetail with the provided legalHeirDetail information.
 *
 * @param {LegalHeirDetailRepoCreateType} legalHeirDetail - the legalHeirDetail information
 * @return {Promise<LegalHeirDetailType>} a promise that resolves with the created legalHeirDetail data
 */
export async function create(
  data: Omit<LegalHeirDetailRepoCreateType, "projectID">,
  projectID: number
): Promise<LegalHeirDetailType | null> {
  return await createLegalHeirDetail({
    ...data,
    projectID,
  });
}

/**
 * Update LegalHeirDetailType information.
 *
 * @param {CreateLegalHeirDetailBody} LegalHeirDetailType - the LegalHeirDetailType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the LegalHeirDetailType to be updated
 * @return {Promise<LegalHeirDetailType>} the updated LegalHeirDetailType information
 */
export async function update(
  data: LegalHeirDetailRepoUpdateType,
  param: GetIdParam
): Promise<LegalHeirDetailType | null> {
  return await updateLegalHeirDetail({...data}, param.id);
}

/**
 * Find a legalHeirDetail by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the legalHeirDetail
 * @return {Promise<LegalHeirDetailType>} the legalHeirDetail found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<LegalHeirDetailType> {
  const { id } = params;

  const legalHeirDetail = await getById(id);
  if (!legalHeirDetail) {
    throw new NotFoundError();
  }
  return legalHeirDetail;
}

/**
 * Find legalHeirDetail by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the legalHeirDetail
 * @return {Promise<{legalHeirDetail:LegalHeirDetailType[]} & PaginationType>} the legalHeirDetail found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    legalHeirDetail: LegalHeirDetailType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const legalHeirDetail = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const legalHeirDetailCount = await count(
    projectID,
    querystring.search
  );
  return {
    legalHeirDetail,
    ...getPaginationKeys({
      count: legalHeirDetailCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Destroys a legalHeirDetail based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the legalHeirDetail
 * @return {Promise<LegalHeirDetailType>} the destroyed legalHeirDetail
 */
export async function destroy(
  params: GetIdParam
): Promise<LegalHeirDetailType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
