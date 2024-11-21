import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  NameChangeMasterRepoCreateType,
  NameChangeMasterRepoUpdateType,
  NameChangeMasterType,
} from "../../@types/name_change_master.type";
import { Decimal } from "@prisma/client/runtime/library";

export type NameChangeMasterExcelData = {
  NSE: string | undefined;
  BSE: string | undefined;
  currentName: string | undefined;
  previousName: string | undefined;
  dateNameChange: string | undefined;
  companyId: number;
};

export type NameChangeMasterExportExcelData = {
  id: number | null | undefined;
  currentName: string | null | undefined;
  previousName: string | null | undefined;
  NSE: string | null | undefined;
  BSE: string | null | undefined;
  ISIN: string | null | undefined;
  CIN: string | null | undefined;
  faceValue: Decimal | null;
  companyId: number;
  dateNameChange: Date | null | undefined;
};

export const ExcelFailedNameChangeMasterColumn: WorksheetColumnsType = [
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "New Name" },
  { key: "previousName", header: "Previous Name" },
  { key: "dateNameChange", header: "Date of Name Change" },
  { key: "companyId", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelNameChangeMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "New Name" },
  { key: "previousName", header: "Previous Name" },
  { key: "dateNameChange", header: "Date of Name Change" },
  { key: "companyId", header: "Company Master Id" },
];

export const ExcelNameChangeCompanyColumns: WorksheetColumnsType = [
  ...ExcelNameChangeMastersColumns,
  { key: "CIN", header: "CIN" },
  { key: "ISIN", header: "ISIN" },
  { key: "faceValue", header: "Face Value" },
];

export const NameChangeMasterColumn = {
  id: true,
  NSE: true,
  BSE: true,
  currentName: true,
  previousName: true,
  dateNameChange: true,
  createdAt: true,
};

export const CompanyMasterColumn = {
  id: true,
  CIN: true,
  ISIN: true,
  faceValue: true,
};

export class NameChangeMasterModel {
  constructor(
    protected readonly prismaNameChangeMaster: PrismaClient["nameChangeMaster"]
  ) {}

  searchQuery({
    companyID,
    search,
  }: {
    companyID?: number;
    search?: string;
  }): Prisma.NameChangeMasterWhereInput {
    const wherecompanyID = companyID ? { companyID: companyID } : {};

    return search
      ? {
          ...wherecompanyID,
          OR: [
            {
              BSE: {
                contains: search,
              },
            },
            {
              NSE: {
                contains: search,
              },
            },
            {
              previousName: {
                contains: search,
              },
            },
            {
              currentName: {
                contains: search,
              },
            },
          ],
        }
      : {
          ...wherecompanyID,
        };
  }

  // create a new user
  async store(
    data: NameChangeMasterRepoCreateType
  ): Promise<NameChangeMasterType> {
    // do some custom validation...
    return await this.prismaNameChangeMaster.create({
      data,
      select: NameChangeMasterColumn,
    });
  }

  async updateById(
    data: NameChangeMasterRepoUpdateType,
    id: number
  ): Promise<NameChangeMasterType> {
    // do some custom validation...
    return await this.prismaNameChangeMaster.update({
      where: { id },
      data,
      select: NameChangeMasterColumn,
    });
  }

  async findById(id: number): Promise<NameChangeMasterType | null> {
    // do some custom validation...
    return await this.prismaNameChangeMaster.findFirst({
      where: { id },
      select: NameChangeMasterColumn,
    });
  }

  async findByNSE(NSE: string): Promise<{
    id: number;
    companyID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaNameChangeMaster.findFirst({
      where: { NSE },
      select: {
        id: true,
        companyID: true,
        createdAt: true,
      },
    });
  }

  async findByBSE(BSE: string): Promise<{
    id: number;
    companyID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaNameChangeMaster.findFirst({
      where: { BSE },
      select: {
        id: true,
        companyID: true,
        createdAt: true,
      },
    });
  }

  async findByCompanyId(companyID: number): Promise<
    | (NameChangeMasterType & {
        companyMaster: {
          CIN: string | null;
          ISIN: string | null;
          faceValue: Decimal | null;
          id: number;
        } | null;
      })
    | null
  > {
    return await this.prismaNameChangeMaster.findFirst({
      where: { companyID },
      include: {
        companyMaster: {
          select: CompanyMasterColumn,
          where: {
            id: companyID,
          },
        },
      },
    });
  }

  async deleteById(id: number): Promise<NameChangeMasterType> {
    // do some custom validation...
    return await this.prismaNameChangeMaster.delete({
      where: { id },
      select: NameChangeMasterColumn,
    });
  }

  async deleteManyByIds(ids: number[], companyID: number): Promise<void> {
    // do some custom validation...
    const nameChangeMaster = await this.prismaNameChangeMaster.findFirst({
      where: { companyID },
      select: {
        id: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    if (nameChangeMaster) {
      const filteredIds = ids.filter((id) => id !== nameChangeMaster.id);
      if (filteredIds.length === 0) return;
      await this.prismaNameChangeMaster.deleteMany({
        where: { id: { in: filteredIds } },
      });
      return;
    }
    await this.prismaNameChangeMaster.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    companyID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaNameChangeMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: { companyID?: number; search?: string }): Promise<
    | (NameChangeMasterType & {
        CIN?: string | null | undefined;
        ISIN?: string | null | undefined;
        faceValue?: number | null | undefined;
        companyId?: number | null | undefined;
      })[]
    | NameChangeMasterType[]
  > {
    // do some custom validation...
    return await this.prismaNameChangeMaster.findMany({
      where: this.searchQuery(params),
      select: params.companyID
        ? NameChangeMasterColumn
        : {
            ...NameChangeMasterColumn,
            companyMaster: {
              select: CompanyMasterColumn,
            },
          },
      orderBy: {
        id: "desc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    companyID?: number;
    search?: string;
  }): Promise<
    | (NameChangeMasterType & {
        CIN?: string | null | undefined;
        ISIN?: string | null | undefined;
        faceValue?: number | null | undefined;
        companyId?: number | null | undefined;
      })[]
    | NameChangeMasterType[]
  > {
    // do some custom validation...
    return await this.prismaNameChangeMaster.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        companyID: params.companyID,
      }),
      select: params.companyID
        ? NameChangeMasterColumn
        : {
            ...NameChangeMasterColumn,
            companyMaster: {
              select: CompanyMasterColumn,
            },
          },
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const nameChangeMasterModel = new NameChangeMasterModel(
  prisma.nameChangeMaster
);
