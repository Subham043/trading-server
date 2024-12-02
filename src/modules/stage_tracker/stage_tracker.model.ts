import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  StageTrackerRepoCreateType,
  StageTrackerRepoUpdateType,
  StageTrackerType,
} from "../../@types/stage_tracker.type";

export type StageTrackerExcelData = {
  pendingFrom: "Client" | "RTA" | "IEPF" | "ServiceProvider";
  stage: string;
  comments?: string;
  date?: string;
  projectID: number;
};

export type StageTrackerExportExcelData = {
  id: number;
  stage: string;
  comments: string | null | undefined;
  date: string | null | undefined;
  projectID: number | null | undefined;
  pendingFrom: "Client" | "RTA" | "IEPF" | "ServiceProvider";
};

export const ExcelStageTrackersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "stage", header: "Stage" },
  { key: "pendingFrom", header: "Pending From" },
  { key: "date", header: "Date" },
  { key: "comments", header: "Comments" },
  { key: "projectID", header: "Project Id" },
];

export const StageTrackerColumn = {
  id: true,
  stage: true,
  pendingFrom: true,
  date: true,
  comments: true,
  projectID: true,
  createdAt: true,
};

export class StageTrackerModel {
  constructor(
    protected readonly prismaStageTracker: PrismaClient["stageTracker"]
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.StageTrackerWhereInput {
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...whereProjectID,
        }
      : {
          ...whereProjectID,
        };
  }

  // create a new user
  async store(
    data: StageTrackerRepoCreateType
  ): Promise<StageTrackerType | null> {
    // do some custom validation...
    const result = await this.prismaStageTracker.create({
      data,
      select: StageTrackerColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: StageTrackerRepoUpdateType,
    id: number
  ): Promise<StageTrackerType | null> {
    // do some custom validation...
    await this.prismaStageTracker.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<StageTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaStageTracker.findFirst({
      where: { id },
    });

    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteById(id: number): Promise<StageTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaStageTracker.delete({
      where: { id },
    });
    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaStageTracker.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaStageTracker.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<StageTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaStageTracker.findMany({
      where: this.searchQuery(params),
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }

  async paginate(params: {
    limit: number;
    offset: number;
    projectID?: number;
    search?: string;
  }): Promise<StageTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaStageTracker.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        projectID: params.projectID,
      }),
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }
}

export const stageTrackerModel = new StageTrackerModel(
  prisma.stageTracker
);
