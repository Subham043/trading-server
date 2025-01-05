import {
  count,
  createNomination,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateNomination,
} from "./nomination.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  NominationCreateType,
  NominationType,
  NominationUpdateType,
} from "../../@types/nomination.type";
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
  ExcelNominationsColumns,
} from "./nomination.model";

/**
 * Create a new nomination with the provided nomination information.
 *
 * @param {NominationCreateType} nomination - the nomination information
 * @return {Promise<NominationType>} a promise that resolves with the created nomination data
 */
export async function create(
  data: NominationCreateType,
  projectID: number
): Promise<NominationType | null> {
  const nomination = await createNomination({
    ...data,
    projectID,
  });
  if(!nomination){
    throw new NotFoundError();
  }
  return findById({ id: nomination.id });
}

/**
 * Update NominationType information.
 *
 * @param {CreateNominationBody} NominationType - the NominationType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the NominationType to be updated
 * @return {Promise<NominationType>} the updated NominationType information
 */
export async function update(
  data: NominationUpdateType,
  param: GetIdParam
): Promise<NominationType | null> {
  const nomination = await updateNomination(data, param.id);
  if (!nomination) {
    throw new NotFoundError();
  }
  return findById({ id: nomination.id });
}

/**
 * Find a nomination by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the nomination
 * @return {Promise<NominationType>} the nomination found by ID
 */
export async function findById(params: GetIdParam): Promise<
  NominationType
> {
  const { id } = params;

  const nomination = await getById(id);
  if (!nomination) {
    throw new NotFoundError();
  }
  return {
    ...nomination,
  };
}

/**
 * Find nomination by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the nomination
 * @return {Promise<{nomination:NominationType[]} & PaginationType>} the nomination found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  projectID: number
): Promise<
  {
    nominations: (NominationType)[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const nominations = await paginate(
    limit,
    offset,
    projectID,
    querystring.search
  );
  const nominationCount = await count(
    projectID,
    querystring.search
  );
  return {
    nominations,
    ...getPaginationKeys({
      count: nominationCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Export nomination by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the nomination
 * @return {Promise<{file: ExcelBuffer}>} the nomination found by ID
 */
export async function exportExcel(
  querystring: GetSearchQuery,
  projectID: number
): Promise<{
  file: ExcelBuffer;
}> {
  const nominations = await getAll(projectID, querystring.search);

  const buffer = await generateExcel<NominationType>(
    "Iepf Trackers",
    ExcelNominationsColumns,
    nominations
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a nomination based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the nomination
 * @return {Promise<NominationType>} the destroyed nomination
 */
export async function destroy(
  params: GetIdParam
): Promise<NominationType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}