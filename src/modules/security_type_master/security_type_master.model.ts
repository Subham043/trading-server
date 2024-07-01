import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  SecurityTypeMasterRepoCreateType,
  SecurityTypeMasterRepoUpdateType,
  SecurityTypeMasterType,
} from "../../@types/security_type_master.type";
import { NameChangeMasterColumn } from "../company_master/company_master.model";

export type SecurityTypeMasterExcelData = {
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  Symbol?: string | undefined;
  Series?: string | undefined;
  securityName?: string | undefined;
  dateOfListing?: string | undefined;
  dateOfAllotment?: string | undefined;
  redemptionDate?: string | undefined;
  conversionDate?: string | undefined;
  paidUpValue: number | undefined;
  dividend: number | undefined;
  redemptionAmount: number | undefined;
  conversionAmount: number | undefined;
  marketLot?: string | undefined;
  isinNumber?: string | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
  companyID: number;
};

export type SecurityTypeMasterExportExcelData = {
  id: number;
  companyID: number | null | undefined;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  Symbol?: string | null | undefined;
  Series?: string | null | undefined;
  securityName?: string | null | undefined;
  dateOfListing?: Date | null | undefined;
  dateOfAllotment?: Date | null | undefined;
  redemptionDate?: Date | null | undefined;
  conversionDate?: Date | null | undefined;
  paidUpValue: number | null | undefined;
  dividend: number | null | undefined;
  redemptionAmount: number | null | undefined;
  conversionAmount: number | null | undefined;
  marketLot?: string | null | undefined;
  isinNumber?: string | null | undefined;
  distinctiveNosFrom?: string | null | undefined;
  distinctiveNosTo?: string | null | undefined;
};

export const ExcelFailedSecurityTypeMasterColumn: WorksheetColumnsType = [
  { key: "instrumentType", header: "Instrument Type" },
  { key: "Symbol", header: "Symbol" },
  { key: "Series", header: "Series" },
  { key: "securityName", header: "Security Name" },
  { key: "dateOfListing", header: "Date of Listing" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "redemptionDate", header: "Redemption Date" },
  { key: "conversionDate", header: "Conversion Date" },
  { key: "paidUpValue", header: "Paid Up Value" },
  { key: "dividend", header: "Dividend" },
  { key: "redemptionAmount", header: "Redemption Amount" },
  { key: "conversionAmount", header: "Conversion Amount" },
  { key: "marketLot", header: "Market Lot" },
  { key: "isinNumber", header: "ISIN Number" },
  { key: "distinctiveNosFrom", header: "Distinctive Numbers From" },
  { key: "distinctiveNosTo", header: "Distinctive Numbers To" },
  { key: "companyID", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelSecurityTypeMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "instrumentType", header: "Instrument Type" },
  { key: "Symbol", header: "Symbol" },
  { key: "Series", header: "Series" },
  { key: "securityName", header: "Security Name" },
  { key: "dateOfListing", header: "Date of Listing" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "redemptionDate", header: "Redemption Date" },
  { key: "conversionDate", header: "Conversion Date" },
  { key: "paidUpValue", header: "Paid Up Value" },
  { key: "dividend", header: "Dividend" },
  { key: "redemptionAmount", header: "Redemption Amount" },
  { key: "conversionAmount", header: "Conversion Amount" },
  { key: "marketLot", header: "Market Lot" },
  { key: "isinNumber", header: "ISIN Number" },
  { key: "distinctiveNosFrom", header: "Distinctive Numbers From" },
  { key: "distinctiveNosTo", header: "Distinctive Numbers To" },
  { key: "companyID", header: "Company Master Id" },
];

export const SecurityTypeMasterColumn = {
  id: true,
  instrumentType: true,
  Symbol: true,
  Series: true,
  securityName: true,
  dateOfListing: true,
  dateOfAllotment: true,
  redemptionDate: true,
  conversionDate: true,
  paidUpValue: true,
  dividend: true,
  redemptionAmount: true,
  conversionAmount: true,
  marketLot: true,
  isinNumber: true,
  distinctiveNosFrom: true,
  distinctiveNosTo: true,
  createdAt: true,
};

export class SecurityTypeMasterModel {
  constructor(
    protected readonly prismaSecurityTypeMaster: PrismaClient["securityTypeMaster"]
  ) {}

  searchQuery({
    companyID,
    search,
  }: {
    companyID?: number;
    search?: string;
  }): Prisma.SecurityTypeMasterWhereInput {
    const wherecompanyID = companyID ? { companyID: companyID } : {};

    return search
      ? {
          ...wherecompanyID,
          OR: [
            {
              Symbol: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              Series: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              securityName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              marketLot: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              isinNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              distinctiveNosFrom: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              distinctiveNosTo: {
                contains: search,
                mode: "insensitive",
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
    data: SecurityTypeMasterRepoCreateType
  ): Promise<SecurityTypeMasterType | null> {
    // do some custom validation...
    const result = await this.prismaSecurityTypeMaster.create({
      data,
      select: SecurityTypeMasterColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: SecurityTypeMasterRepoUpdateType,
    id: number
  ): Promise<SecurityTypeMasterType | null> {
    // do some custom validation...
    await this.prismaSecurityTypeMaster.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<SecurityTypeMasterType | null> {
    // do some custom validation...
    const data = await this.prismaSecurityTypeMaster.findFirst({
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

  async deleteById(id: number): Promise<SecurityTypeMasterType | null> {
    // do some custom validation...
    const data = await this.prismaSecurityTypeMaster.delete({
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
    await this.prismaSecurityTypeMaster.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    companyID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaSecurityTypeMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    companyID?: number;
    search?: string;
  }): Promise<SecurityTypeMasterType[]> {
    // do some custom validation...
    const data = await this.prismaSecurityTypeMaster.findMany({
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
    search?: string;
  }): Promise<SecurityTypeMasterType[]> {
    // do some custom validation...
    const data = await this.prismaSecurityTypeMaster.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        companyID: params.companyID,
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

export const securityTypeMasterModel = new SecurityTypeMasterModel(
  prisma.securityTypeMaster
);
