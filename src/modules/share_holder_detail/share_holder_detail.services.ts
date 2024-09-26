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
 * Create a new shareCertificateMaster with the provided shareCertificateMaster information.
 *
 * @param {ShareHolderDetailRepoCreateType} shareCertificateMaster - the shareCertificateMaster information
 * @return {Promise<ShareHolderDetailType>} a promise that resolves with the created shareCertificateMaster data
 */
export async function create(
  data: Omit<ShareHolderDetailRepoCreateType, "shareHolderMasterID">,
  shareHolderMasterID: number
): Promise<ShareHolderDetailType | null> {
  return await createShareHolderDetail({
    ...data,
    shareHolderMasterID,
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
  return await updateShareHolderDetail(data, param.id);
}

/**
 * Find a shareCertificateMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareCertificateMaster
 * @return {Promise<ShareHolderDetailType>} the shareCertificateMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<ShareHolderDetailType> {
  const { id } = params;

  const shareCertificateMaster = await getById(id);
  if (!shareCertificateMaster) {
    throw new NotFoundError();
  }
  return shareCertificateMaster;
}

/**
 * Find shareCertificateMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareCertificateMaster
 * @return {Promise<{shareCertificateMaster:ShareHolderDetailType[]} & PaginationType>} the shareCertificateMaster found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  shareHolderMasterID: number
): Promise<
  {
    shareCertificateMaster: ShareHolderDetailType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareCertificateMaster = await paginate(
    limit,
    offset,
    shareHolderMasterID,
    querystring.search
  );
  const shareCertificateMasterCount = await count(
    shareHolderMasterID,
    querystring.search
  );
  return {
    shareCertificateMaster,
    ...getPaginationKeys({
      count: shareCertificateMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Destroys a shareCertificateMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the shareCertificateMaster
 * @return {Promise<ShareHolderDetailType>} the destroyed shareCertificateMaster
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
