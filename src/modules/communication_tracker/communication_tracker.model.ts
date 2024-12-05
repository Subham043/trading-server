import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  CommunicationTrackerRepoCreateType,
  CommunicationTrackerRepoUpdateType,
  CommunicationTrackerType,
} from "../../@types/communication_tracker.type";

export type CommunicationTrackerExcelData = {
  stage: "DocumentsCouriered" | "DocumentsReceived";
  comments?: string;
  dateSent?: string;
  dateReceived?: string;
  folios?: string;
  projectID: number;
};

export type CommunicationTrackerExportExcelData = {
  id: number;
  comments: string | null | undefined;
  dateSent: string | null | undefined;
  dateReceived: string | null | undefined;
  folios: string | null | undefined;
  projectID: number | null | undefined;
  stage: "DocumentsCouriered" | "DocumentsReceived";
};

export const ExcelCommunicationTrackersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "stage", header: "Stage" },
  { key: "folios", header: "folios" },
  { key: "dateSent", header: "Date Sent" },
  { key: "dateReceived", header: "Date Received" },
  { key: "comments", header: "Comments" },
  { key: "projectID", header: "Project Id" },
];

export const CommunicationTrackerColumn = {
  id: true,
  stage: true,
  folios: true,
  dateSent: true,
  dateReceived: true,
  comments: true,
  projectID: true,
  createdAt: true,
};

export class CommunicationTrackerModel {
  constructor(
    protected readonly prismaCommunicationTracker: PrismaClient["communicationTracker"]
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.CommunicationTrackerWhereInput {
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
    data: CommunicationTrackerRepoCreateType
  ): Promise<CommunicationTrackerType | null> {
    // do some custom validation...
    const result = await this.prismaCommunicationTracker.create({
      data,
      select: CommunicationTrackerColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: CommunicationTrackerRepoUpdateType,
    id: number
  ): Promise<CommunicationTrackerType | null> {
    // do some custom validation...
    await this.prismaCommunicationTracker.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<CommunicationTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaCommunicationTracker.findFirst({
      where: { id },
    });

    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteById(id: number): Promise<CommunicationTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaCommunicationTracker.delete({
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
    await this.prismaCommunicationTracker.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaCommunicationTracker.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<CommunicationTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaCommunicationTracker.findMany({
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
  }): Promise<CommunicationTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaCommunicationTracker.findMany({
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

export const communicationTrackerModel = new CommunicationTrackerModel(
  prisma.communicationTracker
);
