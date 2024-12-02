import {
  count,
  createStageTracker,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateStageTracker,
} from "./stage_tracker.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  StageTrackerCreateType,
  StageTrackerType,
  StageTrackerUpdateType,
} from "../../@types/stage_tracker.type";
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
  ExcelStageTrackersColumns,
} from "./stage_tracker.model";

/**
 * Create a new stageTracker with the provided stageTracker information.
 *
 * @param {StageTrackerCreateType} stageTracker - the stageTracker information
 * @return {Promise<StageTrackerType>} a promise that resolves with the created stageTracker data
 */
export async function create(
  data: StageTrackerCreateType,
  projectID: number
): Promise<StageTrackerType | null> {
  return await createStageTracker({
    ...data,
    projectID,
  });
}

/**
 * Update StageTrackerType information.
 *
 * @param {CreateStageTrackerBody} StageTrackerType - the StageTrackerType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the StageTrackerType to be updated
 * @return {Promise<StageTrackerType>} the updated StageTrackerType information
 */
export async function update(
  data: StageTrackerUpdateType,
  param: GetIdParam
): Promise<StageTrackerType | null> {
  return await updateStageTracker(data, param.id);
}

/**
 * Find a stageTracker by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the stageTracker
 * @return {Promise<StageTrackerType>} the stageTracker found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<StageTrackerType> {
  const { id } = params;

  const stageTracker = await getById(id);
  if (!stageTracker) {
    throw new NotFoundError();
  }
  return stageTracker;
}

/**
 * Find stageTracker by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the stageTracker
 * @return {Promise<{stageTracker:StageTrackerType[]} & PaginationType>} the stageTracker found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    stageTracker: StageTrackerType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const stageTracker = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const stageTrackerCount = await count(
    projectID,
    querystring.search
  );
  return {
    stageTracker,
    ...getPaginationKeys({
      count: stageTrackerCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export stageTracker by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the stageTracker
 * @return {Promise<{file: ExcelBuffer}>} the stageTracker found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const stageTrackers = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<StageTrackerType>(
    "Stage Trackers",
    ExcelStageTrackersColumns,
    stageTrackers
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a stageTracker based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the stageTracker
 * @return {Promise<StageTrackerType>} the destroyed stageTracker
 */
export async function destroy(
  params: GetIdParam
): Promise<StageTrackerType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}
