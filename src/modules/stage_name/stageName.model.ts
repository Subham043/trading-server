import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  StageNameCreateType,
  StageNameType,
  StageNameUpdateType,
} from "../../@types/stage_name.type";

export type StageNameExportExcelData = {
  id: number;
  name: string | null | undefined;
  createdAt: Date | null | undefined;
};

export type StageNameExcelData = {
  name: string;
};

export const ExcelFailedStageNameColumn: WorksheetColumnsType = [
  { key: "name", header: "Name" },
  { key: "error", header: "Error" },
];

export const ExcelStageNamesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "createdAt", header: "Created At" },
];

export const StageNameColumn = {
  id: true,
  name: true,
  createdAt: true,
} as const;

export class StageNameModel {
  constructor(protected readonly prismaStageName: PrismaClient["stageNames"]) {}

  searchQuery({ search }: { search?: string }): Prisma.StageNamesWhereInput {
    return search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },
          ],
        }
      : {};
  }

  // create a new user
  async store(
    data: StageNameCreateType
  ): Promise<StageNameType | null> {
    // do some custom validation...
    const { ...projectData } = data;
    return await prisma.stageNames.create({
      data: {
        ...projectData,
      },
      select: {
        ...StageNameColumn,
      },
    });
  }

  async updateById(
    data: StageNameUpdateType,
    id: number
  ): Promise<StageNameType | null> {
    // do some custom validation...
    return await prisma.stageNames.update({
      where: {
        id,
      },
      data,
      select: {
        ...StageNameColumn,
      },
    });
  }

  async findById(id: number): Promise<StageNameType | null> {
    // do some custom validation...
    return await this.prismaStageName.findFirst({
      select: {
        ...StageNameColumn,
      },
      orderBy: {
        id: "desc",
      },
      where: { id },
    });
  }

  async deleteById(id: number): Promise<StageNameType> {
    // do some custom validation...
    return await this.prismaStageName.delete({
      select: {
        ...StageNameColumn,
      },
      where: { id },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaStageName.deleteMany({
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
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaStageName.count({
      where: this.searchQuery({ search }),
    });
  }

  async all({ search }: { search?: string }): Promise<StageNameType[]> {
    // do some custom validation...
    return await this.prismaStageName.findMany({
      where: this.searchQuery({ search }),
      select: {
        ...StageNameColumn,
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
  }): Promise<StageNameType[]> {
    // do some custom validation...
    return await this.prismaStageName.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery({ search }),
      select: {
        ...StageNameColumn,
      },
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const stageNameModel = new StageNameModel(prisma.stageNames);
