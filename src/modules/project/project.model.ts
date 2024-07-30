import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  ProjectCreateType,
  ProjectType,
  ProjectUpdateType,
} from "../../@types/project.type";

export type ProjectExportExcelData = {
  id: number;
  name: string | null | undefined;
  userId: number | null | undefined;
  createdAt: Date | null | undefined;
};

export type ProjectExcelData = {
  name: string;
  userID: number;
};

export const ExcelFailedProjectColumn: WorksheetColumnsType = [
  { key: "name", header: "Name" },
  {
    key: "userId",
    header: "User Id",
  },
  { key: "error", header: "Error" },
];

export const ExcelProjectsColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  {
    key: "userId",
    header: "User Id",
  },
  { key: "createdAt", header: "Created At" },
];

export const ProjectColumn = {
  id: true,
  name: true,
  userID: true,
  createdAt: true,
} as const;

export class ProjectModel {
  constructor(protected readonly prismaProject: PrismaClient["project"]) {}

  searchQuery({ search }: { search?: string }): Prisma.ProjectWhereInput {
    return search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};
  }

  // create a new user
  async store(
    data: ProjectCreateType & { createdBy: number }
  ): Promise<ProjectType | null> {
    // do some custom validation...
    const { createdBy, ...projectData } = data;
    return await prisma.project.create({
      data: {
        ...projectData,
        userID: createdBy,
      },
      select: {
        ...ProjectColumn,
      },
    });
  }

  async updateById(
    data: ProjectUpdateType,
    id: number
  ): Promise<ProjectType | null> {
    // do some custom validation...
    return await prisma.project.update({
      where: {
        id,
      },
      data,
      select: {
        ...ProjectColumn,
      },
    });
  }

  async findById(id: number): Promise<ProjectType | null> {
    // do some custom validation...
    return await this.prismaProject.findFirst({
      select: {
        ...ProjectColumn,
      },
      orderBy: {
        id: "desc",
      },
      where: { id },
    });
  }

  async deleteById(id: number): Promise<ProjectType> {
    // do some custom validation...
    return await this.prismaProject.delete({
      select: {
        ...ProjectColumn,
      },
      where: { id },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaProject.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount({
    search,
  }: {
    search?: string;
    isNameChangeMaster?: boolean;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaProject.count({
      where: this.searchQuery({ search }),
    });
  }

  async all({ search }: { search?: string }): Promise<ProjectType[]> {
    // do some custom validation...
    return await this.prismaProject.findMany({
      where: this.searchQuery({ search }),
      select: {
        ...ProjectColumn,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async paginate({
    limit,
    offset,
    search,
  }: {
    limit: number;
    offset: number;
    search?: string;
  }): Promise<ProjectType[]> {
    // do some custom validation...
    return await this.prismaProject.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery({ search }),
      select: {
        ...ProjectColumn,
      },
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const projectModel = new ProjectModel(prisma.project);
