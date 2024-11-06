import {
  count,
  createShareHolderDetail,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateShareHolderDetail,
} from "./share_holder_detail.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  ShareHolderDetailRepoCreateType,
  ShareHolderDetailType,
  ShareHolderDetailRepoUpdateType,
} from "../../@types/share_holder_detail.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";

/**
 * Create a new shareHolderDetail with the provided shareHolderDetail information.
 *
 * @param {ShareHolderDetailRepoCreateType} shareHolderDetail - the shareHolderDetail information
 * @return {Promise<ShareHolderDetailType>} a promise that resolves with the created shareHolderDetail data
 */
export async function create(
  data: Omit<ShareHolderDetailRepoCreateType, "projectID">,
  projectID: number
): Promise<ShareHolderDetailType | null> {
  return await createShareHolderDetail({
    ...data,
    projectID,
  });
}

/**
 * Update ShareHolderDetailType information.
 *
 * @param {CreateShareHolderDetailBody} ShareHolderDetailType - the ShareHolderDetailType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the ShareHolderDetailType to be updated
 * @return {Promise<ShareHolderDetailType>} the updated ShareHolderDetailType information
 */
export async function update(
  data: ShareHolderDetailRepoUpdateType,
  param: GetIdParam
): Promise<ShareHolderDetailType | null> {
  return await updateShareHolderDetail({...data}, param.id);
}

/**
 * Find a shareHolderDetail by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareHolderDetail
 * @return {Promise<ShareHolderDetailType>} the shareHolderDetail found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<ShareHolderDetailType> {
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
 * @return {Promise<{shareHolderDetail:ShareHolderDetailType[]} & PaginationType>} the shareHolderDetail found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    shareHolderDetail: ShareHolderDetailType[];
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
 * @return {Promise<ShareHolderDetailType>} the destroyed shareHolderDetail
 */
export async function destroy(
  params: GetIdParam
): Promise<ShareHolderDetailType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
