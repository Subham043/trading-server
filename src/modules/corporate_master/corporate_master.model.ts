import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  CorporateMasterCreateType,
  CorporateMasterType,
  CorporateMasterUpdateType,
} from "../../@types/corporate_master.type";

export type CorporateMasterExcelData = {
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator: string | undefined;
  denominator: string | undefined;
  companyID: number;
};

export type CorporateMasterExportExcelData = {
  id: number;
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator?: string | null | undefined;
  denominator?: string | null | undefined;
  companyID?: number | null | undefined;
};

export const ExcelFailedCorporateMasterColumn: WorksheetColumnsType = [
  { key: "type", header: "Type" },
  { key: "date", header: "Date" },
  { key: "numerator", header: "Numerator" },
  { key: "denominator", header: "Denominator" },
  { key: "companyID", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelCorporateMasteresColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "type", header: "Type" },
  { key: "date", header: "Date" },
  { key: "numerator", header: "Numerator" },
  { key: "denominator", header: "Denominator" },
  { key: "companyID", header: "Company Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const CorporateMasterColumn = {
  id: true,
  type: true,
  date: true,
  numerator: true,
  denominator: true,
  companyID: true,
  createdAt: true,
};

export class CorporateMasterModel {
  constructor(
    protected readonly prismaCorporateMaster: PrismaClient["corporateMaster"]
  ) {}

  searchQuery({
    companyMasterId,
    search,
  }: {
    companyMasterId?: number;
    search?: string;
  }): Prisma.CorporateMasterWhereInput {
    const wherecompanyMasterId = companyMasterId
      ? { companyID: companyMasterId }
      : {};

    return search
      ? {
          ...wherecompanyMasterId,
          OR: [
            {
              numerator: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              denominator: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {
          ...wherecompanyMasterId,
        };
  }

  // create a new user
  async store(
    data: CorporateMasterCreateType & { companyMasterId: number }
  ): Promise<CorporateMasterType> {
    // do some custom validation...
    const { companyMasterId, ...rest } = data;
    return await this.prismaCorporateMaster.create({
      data: { ...rest, companyID: data.companyMasterId },
      select: {
        ...CorporateMasterColumn,
      },
    });
  }

  async updateById(
    data: CorporateMasterUpdateType,
    id: number
  ): Promise<CorporateMasterType> {
    // do some custom validation...
    return await this.prismaCorporateMaster.update({
      where: { id },
      data,
      select: {
        ...CorporateMasterColumn,
      },
    });
  }

  async findById(id: number): Promise<CorporateMasterType | null> {
    // do some custom validation...
    return await this.prismaCorporateMaster.findFirst({
      where: { id },
      select: {
        ...CorporateMasterColumn,
      },
    });
  }

  async findByCompanyMasterId(
    companyMasterId: number
  ): Promise<CorporateMasterType | null> {
    return await this.prismaCorporateMaster.findFirst({
      where: { companyID: companyMasterId },
      select: {
        ...CorporateMasterColumn,
      },
    });
  }

  async deleteById(id: number): Promise<CorporateMasterType> {
    // do some custom validation...
    return await this.prismaCorporateMaster.delete({
      where: { id },
      select: {
        ...CorporateMasterColumn,
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaCorporateMaster.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(params: {
    companyMasterId?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaCorporateMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    companyMasterId?: number;
    search?: string;
  }): Promise<CorporateMasterType[]> {
    // do some custom validation...
    return await this.prismaCorporateMaster.findMany({
      where: this.searchQuery(params),
      select: {
        ...CorporateMasterColumn,
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    companyMasterId?: number;
    search?: string;
  }): Promise<CorporateMasterType[]> {
    // do some custom validation...
    return await this.prismaCorporateMaster.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        companyMasterId: params.companyMasterId,
      }),
      select: {
        ...CorporateMasterColumn,
      },
      orderBy: {
        date: "asc",
      },
    });
  }
}

export const corporateMasterModel = new CorporateMasterModel(
  prisma.corporateMaster
);
