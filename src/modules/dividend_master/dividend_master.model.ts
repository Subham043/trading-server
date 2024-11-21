import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  DividendMasterCreateType,
  DividendMasterType,
  DividendMasterUpdateType,
} from "../../@types/dividend_master.type";

export type DividendMasterExcelData = {
  recorded_date: string | undefined;
  financial_year: string | undefined;
  dividend_per_share: number | undefined;
  companyID: number;
};

export type DividendMasterExportExcelData = {
  id: number;
  recorded_date: Date;
  financial_year?: string | null | undefined;
  dividend_per_share?: string | null | undefined;
  companyID?: number | null | undefined;
};

export const ExcelFailedDividendMasterColumn: WorksheetColumnsType = [
  { key: "recorded_date", header: "Recorded Date" },
  { key: "financial_year", header: "Financial Year" },
  { key: "dividend_per_share", header: "Dividend Per Share" },
  { key: "companyID", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelDividendMasteresColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "recorded_date", header: "Recorded Date" },
  { key: "financial_year", header: "Financial Year" },
  { key: "dividend_per_share", header: "Dividend Per Share" },
  { key: "companyID", header: "Company Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const DividendMasterColumn = {
  id: true,
  recorded_date: true,
  financial_year: true,
  dividend_per_share: true,
  companyID: true,
  createdAt: true,
};

export class DividendMasterModel {
  constructor(
    protected readonly prismaDividendMaster: PrismaClient["dividendMaster"]
  ) {}

  searchQuery({
    companyMasterId,
    search,
  }: {
    companyMasterId?: number;
    search?: string;
  }): Prisma.DividendMasterWhereInput {
    const wherecompanyMasterId = companyMasterId
      ? { companyID: companyMasterId }
      : {};

    return search
      ? {
          ...wherecompanyMasterId,
          OR: [
            {
              financial_year: {
                contains: search,
              },
            },
            {
              dividend_per_share: {
                contains: search,
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
    data: DividendMasterCreateType & { companyMasterId: number }
  ): Promise<DividendMasterType> {
    // do some custom validation...
    const { companyMasterId, ...rest } = data;
    return await this.prismaDividendMaster.create({
      data: { ...rest, companyID: data.companyMasterId },
      select: {
        ...DividendMasterColumn,
      },
    });
  }

  async updateById(
    data: DividendMasterUpdateType,
    id: number
  ): Promise<DividendMasterType> {
    // do some custom validation...
    return await this.prismaDividendMaster.update({
      where: { id },
      data,
      select: {
        ...DividendMasterColumn,
      },
    });
  }

  async findById(id: number): Promise<DividendMasterType | null> {
    // do some custom validation...
    return await this.prismaDividendMaster.findFirst({
      where: { id },
      select: {
        ...DividendMasterColumn,
      },
    });
  }

  async findByCompanyMasterId(
    companyMasterId: number
  ): Promise<DividendMasterType | null> {
    return await this.prismaDividendMaster.findFirst({
      where: { companyID: companyMasterId },
      select: {
        ...DividendMasterColumn,
      },
    });
  }

  async deleteById(id: number): Promise<DividendMasterType> {
    // do some custom validation...
    return await this.prismaDividendMaster.delete({
      where: { id },
      select: {
        ...DividendMasterColumn,
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaDividendMaster.deleteMany({
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
    return await this.prismaDividendMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    companyMasterId?: number;
    search?: string;
  }): Promise<DividendMasterType[]> {
    // do some custom validation...
    return await this.prismaDividendMaster.findMany({
      where: this.searchQuery(params),
      select: {
        ...DividendMasterColumn,
      },
      orderBy: {
        recorded_date: "asc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    companyMasterId?: number;
    search?: string;
  }): Promise<DividendMasterType[]> {
    // do some custom validation...
    return await this.prismaDividendMaster.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        companyMasterId: params.companyMasterId,
      }),
      select: {
        ...DividendMasterColumn,
      },
      orderBy: {
        recorded_date: "asc",
      },
    });
  }
}

export const dividendMasterModel = new DividendMasterModel(
  prisma.dividendMaster
);
