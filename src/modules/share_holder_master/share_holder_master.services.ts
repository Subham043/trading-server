import {
  count,
  createShareHolderMaster,
  getById,
  getInfoById,
  paginate,
  remove,
  removeMultiple,
  updateShareHolderMaster,
} from "./share_holder_master.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  ShareHolderMasterCreateType,
  ShareHolderMasterMainType,
  ShareHolderMasterType,
  ShareHolderMasterUpdateType,
} from "../../@types/share_holder_master.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";

/**
 * Create a new shareHolderMaster with the provided shareHolderMaster information.
 *
 * @param {ShareHolderMasterCreateType} shareHolderMaster - the shareHolderMaster information
 * @return {Promise<ShareHolderMasterType>} a promise that resolves with the created shareHolderMaster data
 */
export async function create(
  data: ShareHolderMasterCreateType,
  projectID: number
): Promise<ShareHolderMasterType | null> {
  return await createShareHolderMaster({
    ...data,
    projectID,
  });
}

/**
 * Update ShareHolderMasterType information.
 *
 * @param {CreateShareHolderMasterBody} ShareHolderMasterType - the ShareHolderMasterType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the ShareHolderMasterType to be updated
 * @return {Promise<ShareHolderMasterType>} the updated ShareHolderMasterType information
 */
export async function update(
  data: ShareHolderMasterUpdateType,
  param: GetIdParam
): Promise<ShareHolderMasterType | null> {
  return await updateShareHolderMaster(data, param.id);
}

export async function updateTransposition(
  data: { transpositionOrder: string },
  param: GetIdParam
): Promise<ShareHolderMasterType | null> {
  return await updateShareHolderMaster(data, param.id);
}

/**
 * Find a shareHolderMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareHolderMaster
 * @return {Promise<ShareHolderMasterType>} the shareHolderMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<ShareHolderMasterType> {
  const { id } = params;

  const shareHolderMaster = await getById(id);
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }
  return shareHolderMaster;
}

export async function findInfoById(
  params: GetIdParam
): Promise<ShareHolderMasterMainType> {
  const { id } = params;

  const shareHolderMaster = await getInfoById(id);
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }
  return shareHolderMaster;
}

/**
 * Find shareHolderMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareHolderMaster
 * @return {Promise<{shareHolderMaster:ShareHolderMasterType[]} & PaginationType>} the shareHolderMaster found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    shareHolderMaster: ShareHolderMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareHolderMaster = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const shareHolderMasterCount = await count(
    projectID,
    querystring.search
  );
  return {
    shareHolderMaster,
    ...getPaginationKeys({
      count: shareHolderMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Destroys a shareHolderMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the shareHolderMaster
 * @return {Promise<ShareHolderMasterType>} the destroyed shareHolderMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<ShareHolderMasterType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
