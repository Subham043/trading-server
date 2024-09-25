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
 * Create a new shareCertificateMaster with the provided shareCertificateMaster information.
 *
 * @param {ShareHolderMasterCreateType} shareCertificateMaster - the shareCertificateMaster information
 * @return {Promise<ShareHolderMasterType>} a promise that resolves with the created shareCertificateMaster data
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

/**
 * Find a shareCertificateMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareCertificateMaster
 * @return {Promise<ShareHolderMasterType>} the shareCertificateMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<ShareHolderMasterType> {
  const { id } = params;

  const shareCertificateMaster = await getById(id);
  if (!shareCertificateMaster) {
    throw new NotFoundError();
  }
  return shareCertificateMaster;
}

export async function findInfoById(
  params: GetIdParam
): Promise<ShareHolderMasterMainType> {
  const { id } = params;

  const shareCertificateMaster = await getInfoById(id);
  if (!shareCertificateMaster) {
    throw new NotFoundError();
  }
  return shareCertificateMaster;
}

/**
 * Find shareCertificateMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareCertificateMaster
 * @return {Promise<{shareCertificateMaster:ShareHolderMasterType[]} & PaginationType>} the shareCertificateMaster found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    shareCertificateMaster: ShareHolderMasterType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareCertificateMaster = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const shareCertificateMasterCount = await count(
    projectID,
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
 * @return {Promise<ShareHolderMasterType>} the destroyed shareCertificateMaster
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
