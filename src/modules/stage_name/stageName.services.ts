import {
  count,
  createStageName,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateStageName,
} from "./stageName.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  StageNameCreateType,
  StageNameType,
  StageNameUpdateType,
} from "../../@types/stage_name.type";
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
  StageNameExportExcelData,
  ExcelStageNamesColumns,
} from "./stageName.model";

/**
 * Create a new project with the provided project information.
 *
 * @param {StageNameCreateType} project - the project information
 * @return {Promise<StageNameType>} a promise that resolves with the created project data
 */
export async function create(
  data: StageNameCreateType,
): Promise<StageNameType | null> {
  return await createStageName({ ...data });
}

/**
 * Update StageNameType information.
 *
 * @param {CreateStageNameBody} StageNameType - the StageNameType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the StageNameType to be updated
 * @return {Promise<StageNameType>} the updated StageNameType information
 */
export async function update(
  data: StageNameUpdateType,
  param: GetIdParam
): Promise<StageNameType | null> {
  return await updateStageName(data, param.id);
}

/**
 * Find a project by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the project
 * @return {Promise<StageNameType>} the project found by ID
 */
export async function findById(params: GetIdParam): Promise<StageNameType> {
  const { id } = params;

  const project = await getById(id);
  if (!project) {
    throw new NotFoundError();
  }
  return project;
}

/**
 * Find project by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the project
 * @return {Promise<{project:StageNameType[]} & PaginationType>} the project found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    stageName: StageNameType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const stageName = await paginate(limit, offset, querystring.search);
  const stageNameCount = await count(querystring.search);
  return {
    stageName,
    ...getPaginationKeys({
      count: stageNameCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

export async function all(querystring: GetSearchQuery): Promise<StageNameType[]> {
  return await getAll(querystring.search);
}

/**
 * Export project by pagination.
 *
 * @param {GetSearchQuery} querystring - the parameters for finding the project
 * @return {Promise<{file: ExcelBuffer}>} the project found by ID
 */
export async function exportExcel(querystring: GetSearchQuery): Promise<{
  file: ExcelBuffer;
}> {
  const projects = await getAll(querystring.search);

  const excelData = projects.map((project) => {
    return {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
    };
  });

  const buffer = await generateExcel<StageNameExportExcelData>(
    "StageNames",
    ExcelStageNamesColumns,
    excelData
  );

  return {
    file: buffer,
  };
}

/**
 * Destroys a project based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the project
 * @return {Promise<StageNameType>} the destroyed project
 */
export async function destroy(params: GetIdParam): Promise<StageNameType> {
  const { id } = params;

  const project = await findById(params);
  await remove(id);
  return project;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}
