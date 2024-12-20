import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  ShareCertificateMasterRepoCreateType,
  ShareCertificateMasterRepoUpdateType,
  ShareCertificateMasterType,
} from "../../@types/share_certificate_master.type";
import { NameChangeMasterColumn } from "../company_master/company_master.model";

export type ShareCertificateMasterExcelData = {
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  companyID: number;
  projectID: number;
};

export type ShareCertificateMasterExportExcelData = {
  id: number;
  companyID: number | null | undefined;
  projectID: number | null | undefined;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
};

export const ExcelFailedShareCertificateMasterColumn: WorksheetColumnsType = [
  { key: "instrumentType", header: "Instrument Type" },
  { key: "companyID", header: "Company Master Id" },
  { key: "projectID", header: "Project Id" },
  { key: "error", header: "Error" },
];

export const ExcelShareCertificateMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "instrumentType", header: "Instrument Type" },
  { key: "companyID", header: "Company Master Id" },
  { key: "projectID", header: "Project Id" },
];

export const ShareCertificateMasterColumn = {
  id: true,
  instrumentType: true,
  projectID: true,
  createdAt: true,
};

export class ShareCertificateMasterModel {
  constructor(
    protected readonly prismaShareCertificateMaster: PrismaClient["shareCertificateMaster"]
  ) {}

  searchQuery({
    companyID,
    projectID,
    search,
  }: {
    companyID?: number;
    projectID?: number;
    search?: string;
  }): Prisma.ShareCertificateMasterWhereInput {
    const wherecompanyID = companyID ? { companyID: companyID } : {};
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...wherecompanyID,
          ...whereProjectID,
        }
      : {
          ...wherecompanyID,
          ...whereProjectID,
        };
  }

  // create a new user
  async store(
    data: ShareCertificateMasterRepoCreateType
  ): Promise<ShareCertificateMasterType | null> {
    // do some custom validation...
    const result = await this.prismaShareCertificateMaster.create({
      data,
      select: ShareCertificateMasterColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: ShareCertificateMasterRepoUpdateType,
    id: number
  ): Promise<ShareCertificateMasterType | null> {
    // do some custom validation...
    await this.prismaShareCertificateMaster.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<ShareCertificateMasterType | null> {
    // do some custom validation...
    const data = await this.prismaShareCertificateMaster.findFirst({
      where: { id },
      include: {
        companyMaster: {
          include: {
            nameChangeMasters: {
              select: NameChangeMasterColumn,
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (data)
      return {
        ...data,
        companyMaster: {
          ...data.companyMaster,
          currentNameChangeMasters: data.companyMaster
            ? data.companyMaster.nameChangeMasters[0]
            : null,
        },
      };
    return null;
  }

  async deleteById(id: number): Promise<ShareCertificateMasterType | null> {
    // do some custom validation...
    const data = await this.prismaShareCertificateMaster.delete({
      where: { id },
      include: {
        companyMaster: {
          include: {
            nameChangeMasters: {
              select: NameChangeMasterColumn,
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });
    if (data)
      return {
        ...data,
        companyMaster: {
          ...data.companyMaster,
          currentNameChangeMasters: data.companyMaster
            ? data.companyMaster.nameChangeMasters[0]
            : null,
        },
      };
    return null;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaShareCertificateMaster.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    companyID?: number;
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaShareCertificateMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    companyID?: number;
    projectID?: number;
    search?: string;
  }): Promise<ShareCertificateMasterType[]> {
    // do some custom validation...
    const data = await this.prismaShareCertificateMaster.findMany({
      where: this.searchQuery(params),
      include: {
        companyMaster: {
          include: {
            nameChangeMasters: {
              select: NameChangeMasterColumn,
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
      companyMaster: {
        ...x.companyMaster,
        currentNameChangeMasters: x.companyMaster
          ? x.companyMaster.nameChangeMasters[0]
          : null,
      },
    }));
  }

  async paginate(params: {
    limit: number;
    offset: number;
    companyID?: number;
    projectID?: number;
    search?: string;
  }): Promise<ShareCertificateMasterType[]> {
    // do some custom validation...
    const data = await this.prismaShareCertificateMaster.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        companyID: params.companyID,
        projectID: params.projectID,
      }),
      include: {
        companyMaster: {
          include: {
            nameChangeMasters: {
              select: NameChangeMasterColumn,
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
      companyMaster: {
        ...x.companyMaster,
        currentNameChangeMasters: x.companyMaster
          ? x.companyMaster.nameChangeMasters[0]
          : null,
      },
    }));
  }
}

export const shareCertificateMasterModel = new ShareCertificateMasterModel(
  prisma.shareCertificateMaster
);
