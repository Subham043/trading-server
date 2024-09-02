import {
  count,
  createProject,
  getAll,
  getById,
  paginate,
  remove,
  removeMultiple,
  updateProject,
} from "./project.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  ProjectCreateType,
  ProjectType,
  ProjectUpdateType,
} from "../../@types/project.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { GetSearchQuery } from "../../common/schemas/search_query.schema";
import {
  ExcelBuffer,
  generateExcel,
  readExcel,
  storeExcel,
} from "../../utils/excel";
import {
  ProjectExcelData,
  ProjectExportExcelData,
  ExcelProjectsColumns,
  ExcelFailedProjectColumn,
} from "./project.model";
import { PostExcelBody } from "../../common/schemas/excel.schema";
import { createProjectBodySchema } from "./schemas/create.schema";
import { ZodError } from "zod";
import { prisma } from "../../db";

/**
 * Create a new project with the provided project information.
 *
 * @param {ProjectCreateType} project - the project information
 * @return {Promise<ProjectType>} a promise that resolves with the created project data
 */
export async function create(
  data: ProjectCreateType,
  userId: number
): Promise<ProjectType | null> {
  return await createProject({ ...data, createdBy: userId });
}

/**
 * Update ProjectType information.
 *
 * @param {CreateProjectBody} ProjectType - the ProjectType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the ProjectType to be updated
 * @return {Promise<ProjectType>} the updated ProjectType information
 */
export async function update(
  data: ProjectUpdateType,
  param: GetIdParam
): Promise<ProjectType | null> {
  return await updateProject(data, param.id);
}

/**
 * Find a project by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the project
 * @return {Promise<ProjectType>} the project found by ID
 */
export async function findById(params: GetIdParam): Promise<ProjectType> {
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
 * @return {Promise<{project:ProjectType[]} & PaginationType>} the project found by ID
 */
export async function list(querystring: GetPaginationQuery): Promise<
  {
    project: ProjectType[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const projectData = await paginate(limit, offset, querystring.search);
  const project = await Promise.all(projectData.map(async (project) => {
    const share_certificate_master = await prisma.shareCertificateMaster.findMany({
      where: {
        projectID: project.id
      },
      select: {
        id: true,
        companyID: true,
      },
    })
    const noOfCompanies = [...new Set(share_certificate_master.map((x) => x.companyID))].length ?? 0;
    return {
      ...project,
      noOfCompanies,
    };
  }));
  const projectCount = await count(querystring.search);
  return {
    project,
    ...getPaginationKeys({
      count: projectCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
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
      userId: project.userID,
      createdAt: project.createdAt,
    };
  });

  const buffer = await generateExcel<ProjectExportExcelData>(
    "Projects",
    ExcelProjectsColumns,
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
 * @return {Promise<ProjectType>} the destroyed project
 */
export async function destroy(params: GetIdParam): Promise<ProjectType> {
  const { id } = params;

  const project = await findById(params);
  await remove(id);
  return project;
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;
  await removeMultiple(id);
}

export async function importExcel(
  data: PostExcelBody,
  userId: number
): Promise<{
  successCount: number;
  errorCount: number;
  fileName: string | null;
}> {
  let successCount = 0;
  let errorCount = 0;
  const projectInsertData: ProjectExcelData[] = [];
  const failedProjectImport: (ProjectExcelData & {
    error: string;
  })[] = [];
  const worksheet = await readExcel(data.file);
  worksheet?.eachRow(async function (row, rowNumber) {
    if (rowNumber > 1) {
      const projectData = {
        name: row.getCell(1).value?.toString() ?? "",
        userID: userId,
      };
      projectInsertData.push(projectData);
    }
  });
  for (let i = 0; i < projectInsertData.length; i++) {
    try {
      await createProjectBodySchema.parseAsync(projectInsertData[i]);
      await createProject({
        ...projectInsertData[i],
        createdBy: userId,
      });
      successCount = successCount + 1;
    } catch (error) {
      let errorData: unknown = error;
      if (error instanceof ZodError) {
        errorData = error.issues
          .map((issue) => issue.message)
          .join(", ")
          .replace('"', "");
      }
      failedProjectImport.push({
        ...projectInsertData[i],
        error: JSON.stringify(errorData),
      });
      errorCount = errorCount + 1;
    }
  }
  if (failedProjectImport.length > 0 && errorCount > 0) {
    const fileName = await storeExcel<ProjectExcelData & { error: string }>(
      "Failed Project Import",
      ExcelFailedProjectColumn,
      failedProjectImport,
      userId
    );
    return {
      successCount,
      errorCount,
      fileName,
    };
  }
  return {
    successCount,
    errorCount,
    fileName: null,
  };
}
