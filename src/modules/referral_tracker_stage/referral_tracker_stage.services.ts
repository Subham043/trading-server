import {
  count,
  countAll,
  createReferralTrackerStage,
  getAll,
  getById,
  paginate,
  paginateAll,
  remove,
  removeMultiple,
  updateReferralTrackerStage,
} from "./referral_tracker_stage.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  ReferralTrackerStageCreateType,
  ReferralTrackerStageType,
  ReferralTrackerStageUpdateType,
} from "../../@types/referral_tracker_stage.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
} from "../../utils/excel";
import {
  ExcelReferralTrackerStageesColumns,
  ReferralTrackerStageExportExcelData,
} from "./referral_tracker_stage.model";

/**
 * Create a new paymentTrackerStage with the provided paymentTrackerStage information.
 *
 * @param {ReferralTrackerStageCreateType} paymentTrackerStage - the paymentTrackerStage information
 * @return {Promise<ReferralTrackerStageType>} a promise that resolves with the created paymentTrackerStage data
 */
export async function create(
  data: ReferralTrackerStageCreateType,
  paymentTrackerId: number
): Promise<ReferralTrackerStageType> {
  return await createReferralTrackerStage({ ...data, paymentTrackerId });
}

/**
 * Update ReferralTrackerStageType information.
 *
 * @param {CreateReferralTrackerStageBody} ReferralTrackerStageType - the ReferralTrackerStageType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the ReferralTrackerStageType to be updated
 * @return {Promise<ReferralTrackerStageType>} the updated ReferralTrackerStageType information
 */
export async function update(
  data: ReferralTrackerStageUpdateType,
  param: GetIdParam
): Promise<ReferralTrackerStageType> {
  return await updateReferralTrackerStage(data, param.id);
}

/**
 * Find a paymentTrackerStage by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the paymentTrackerStage
 * @return {Promise<ReferralTrackerStageType>} the paymentTrackerStage found by ID
 */
export async function findById(params: GetIdParam): Promise<ReferralTrackerStageType> {
  const { id } = params;

  const paymentTrackerStage = await getById(id);
  if (!paymentTrackerStage) {
    throw new NotFoundError();
  }
  return paymentTrackerStage;
}

/**
 * Find paymentTrackerStage by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the paymentTrackerStage
 * @return {Promise<{paymentTrackerStage:ReferralTrackerStageType[]} & PaginationType>} the paymentTrackerStage found by ID
 */
export async function list(
  paymentTrackerId: number,
  querystring: GetPaginationQuery
): Promise<
  {
    referralTrackerStage: ReferralTrackerStageType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const referralTrackerStage = await paginate(
    paymentTrackerId,
    limit,
    offset,
    querystring.search
  );
  const referralTrackerStageCount = await count(
    paymentTrackerId,
    querystring.search
  );
  return {
    referralTrackerStage,
    ...getPaginationKeys({
      count: referralTrackerStageCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function listAll(querystring: GetPaginationQuery): Promise<
  {
    referralTrackerStage: ReferralTrackerStageType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const referralTrackerStage = await paginateAll(
    limit,
    offset,
    querystring.search
  );
  const referralTrackerStageCount = await countAll(querystring.search);
  return {
    referralTrackerStage,
    ...getPaginationKeys({
      count: referralTrackerStageCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export paymentTrackerStage by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the paymentTrackerStage
 * @return {Promise<{file: ExcelBuffer}>} the paymentTrackerStage found by ID
 */
export async function exportExcel(
  paymentTrackerId: number,
  querystring: GetSearchQuery
): Promise<{
  file: ExcelBuffer;
}> {
  const paymentTrackerStages = await getAll(paymentTrackerId, querystring.search);

  const excelData = paymentTrackerStages.map((paymentTrackerStage) => {
    return {
      id: paymentTrackerStage.id,
      amount: paymentTrackerStage.amount,
      status: paymentTrackerStage.status,
      createdAt: paymentTrackerStage.createdAt,
      paymentTrackerID: paymentTrackerStage.paymentTrackerID,
    };
  });

  const buffer = await generateExcel<ReferralTrackerStageExportExcelData>(
    "ReferralTrackerStages",
    ExcelReferralTrackerStageesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a paymentTrackerStage based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the paymentTrackerStage
 * @return {Promise<ReferralTrackerStageType>} the destroyed paymentTrackerStage
 */
export async function destroy(params: GetIdParam): Promise<ReferralTrackerStageType> {
  const { id } = params;

  const paymentTrackerStage = await findById(params);
  await remove(id);
  return paymentTrackerStage;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}