import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  IepfTrackerRepoCreateType,
  IepfTrackerRepoUpdateType,
  IepfTrackerType,
} from "../../@types/iepf_tracker.type";

export type IepfTrackerExcelData = {
  shareHolderDetails?: string;
  legalHeirDetails?: string;
  projectID: number;
};

export type IepfTrackerExportExcelData = {
  id: number;
  shareHolderDetails: string | null | undefined;
  legalHeirDetails: string | null | undefined;
  projectID: number | null | undefined;
  stage: "DocumentsCouriered" | "DocumentsReceived";
};

export const ExcelIepfTrackersDocColumns: WorksheetColumnsType = [
  { key: "pan", header: "Income Tax PAN" },
  { key: "CIN", header: "CIN/LLPIN/FLLPIN/FCRN " },
  { key: "LLP", header: "Company/LLP Name" },
  { key: "addressAadhar", header: "Address" },
  { key: "phone", header: "Mobile" },
  { key: "email", header: "Email ID" },
  { key: "password", header: "Password" },
  { key: "confirmPassword", header: "Confirm Password" },
  { key: "hintQuestion", header: "Hint Questions" },
  { key: "hintAnswer", header: "Hint Answers" },
  {
    key: "dematAccountNo",
    header: "DP ID/Demat account number in which shares shall be credited",
  },
  {
    key: "bankAccountNo",
    header: "Bank account number",
  },
  {
    key: "bankIFS",
    header: "IFS Code",
  },
  {
    key: "bankName",
    header: "Bank Name",
  },
  {
    key: "branchName",
    header: "Bank Branch",
  },
  {
    key: "firstName",
    header: "First Name",
  },
  {
    key: "middleName",
    header: "Middle Name",
  },
  {
    key: "lastName",
    header: "Last Name",
  },
  {
    key: "fatherFirstName",
    header: "Father's First Name",
  },
  {
    key: "fatherMiddleName",
    header: "Father's Middle Name",
  },
  {
    key: "fatherLastName",
    header: "Father's Last Name",
  },
  {
    key: "dob",
    header: "Date of Birth",
  },
  {
    key: "aadhar",
    header: "Aadhaar Number",
  },
  {
    key: "companyCIN",
    header: "CIN Of The Company",
  },
];

export const ExcelIepfTrackersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "shareHolderDetails", header: "Share Holders" },
  { key: "legalHeirDetails", header: "Legal Heirs" },
  { key: "projectID", header: "Project Id" },
];

export const IepfTrackerColumn = {
  id: true,
  shareHolderDetails: true,
  legalHeirDetails: true,
  projectID: true,
  createdAt: true,
};

export class IepfTrackerModel {
  constructor(
    protected readonly prismaIepfTracker: PrismaClient["iEPFTracker"]
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.IEPFTrackerWhereInput {
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
    data: IepfTrackerRepoCreateType
  ): Promise<IepfTrackerType | null> {
    // do some custom validation...
    const result = await this.prismaIepfTracker.create({
      data,
      select: IepfTrackerColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: IepfTrackerRepoUpdateType,
    id: number
  ): Promise<IepfTrackerType | null> {
    // do some custom validation...
    await this.prismaIepfTracker.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<IepfTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaIepfTracker.findFirst({
      where: { id },
    });

    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteById(id: number): Promise<IepfTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaIepfTracker.delete({
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
    await this.prismaIepfTracker.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaIepfTracker.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<IepfTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaIepfTracker.findMany({
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
  }): Promise<IepfTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaIepfTracker.findMany({
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

export const iepfTrackerModel = new IepfTrackerModel(
  prisma.iEPFTracker
);
