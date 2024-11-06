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
 * Create a new shareHolderDetail with the provided shareHolderDetail information.
 *
 * @param {LegalHeirDetailRepoCreateType} shareHolderDetail - the shareHolderDetail information
 * @return {Promise<LegalHeirDetailType>} a promise that resolves with the created shareHolderDetail data
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
 * Find a shareHolderDetail by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareHolderDetail
 * @return {Promise<LegalHeirDetailType>} the shareHolderDetail found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<LegalHeirDetailType> {
  const { id } = params;

  const shareHolderDetail = await getById(id);
  if (!shareHolderDetail) {
    throw new NotFoundError();
  }
  return shareHolderDetail;
}

/**
 * Find shareHolderDetail by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareHolderDetail
 * @return {Promise<{shareHolderDetail:LegalHeirDetailType[]} & PaginationType>} the shareHolderDetail found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    shareHolderDetail: LegalHeirDetailType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareHolderDetail = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const shareHolderDetailCount = await count(
    projectID,
    querystring.search
  );
  return {
    shareHolderDetail,
    ...getPaginationKeys({
      count: shareHolderDetailCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Destroys a shareHolderDetail based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the shareHolderDetail
 * @return {Promise<LegalHeirDetailType>} the destroyed shareHolderDetail
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
