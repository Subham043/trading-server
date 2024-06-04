import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  SecurityMasterRepoCreateType,
  SecurityMasterRepoUpdateType,
  SecurityMasterType,
} from "../../@types/security_master.type";
import { NameChangeMasterColumn } from "../company_master/company_master.model";

export type SecurityMasterExcelData = {
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio?: string | undefined;
  certificateNumber?: string | undefined;
  certificateSerialNumber?: string | undefined;
  shareholderName1?: string | undefined;
  shareholderName2?: string | undefined;
  shareholderName3?: string | undefined;
  noOfShares?: string | undefined;
  noOfSharesWords?: string | undefined;
  dateOfAllotment?: string | undefined;
  faceValue: number | undefined;
  distinctiveNosFrom?: string | undefined;
  distinctiveNosTo?: string | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1?: string | undefined;
  endorsementShareholderName2?: string | undefined;
  endorsementShareholderName3?: string | undefined;
  companyID: number;
};

export type SecurityMasterExportExcelData = {
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
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio?: string | null | undefined;
  certificateNumber?: string | null | undefined;
  certificateSerialNumber?: string | null | undefined;
  shareholderName1?: string | null | undefined;
  shareholderName2?: string | null | undefined;
  shareholderName3?: string | null | undefined;
  noOfShares?: string | null | undefined;
  noOfSharesWords?: string | null | undefined;
  dateOfAllotment?: string | null | undefined;
  faceValue: number | null | undefined;
  distinctiveNosFrom?: string | null | undefined;
  distinctiveNosTo?: string | null | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null | undefined;
  endorsementDate?: string | null | undefined;
  endorsementShareholderName1?: string | null | undefined;
  endorsementShareholderName2?: string | null | undefined;
  endorsementShareholderName3?: string | null | undefined;
};

export const ExcelFailedSecurityMasterColumn: WorksheetColumnsType = [
  { key: "instrumentType", header: "Instrument Type" },
  { key: "equityType", header: "Equity Type" },
  { key: "Folio", header: "Folio" },
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "shareholderName1", header: "Shareholder Name 1" },
  { key: "shareholderName2", header: "Shareholder Name 2" },
  { key: "shareholderName3", header: "Shareholder Name 3" },
  { key: "noOfShares", header: "No. of Shares" },
  { key: "noOfSharesWords", header: "No. of Shares in Words" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "faceValue", header: "Face Value" },
  { key: "distinctiveNosFrom", header: "Distinctive Numbers From" },
  { key: "distinctiveNosTo", header: "Distinctive Numbers To" },
  { key: "endorsement", header: "Endorsement" },
  { key: "endorsementFolio", header: "Endorsement Folio" },
  { key: "endorsementDate", header: "Endorsement Date" },
  {
    key: "endorsementShareholderName1",
    header: "Endorsement Shareholder Name 1",
  },
  {
    key: "endorsementShareholderName2",
    header: "Endorsement Shareholder Name 2",
  },
  {
    key: "endorsementShareholderName3",
    header: "Endorsement Shareholder Name 3",
  },
  { key: "companyID", header: "Company Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelSecurityMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "instrumentType", header: "Instrument Type" },
  { key: "equityType", header: "Equity Type" },
  { key: "Folio", header: "Folio" },
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "shareholderName1", header: "Shareholder Name 1" },
  { key: "shareholderName2", header: "Shareholder Name 2" },
  { key: "shareholderName3", header: "Shareholder Name 3" },
  { key: "noOfShares", header: "No. of Shares" },
  { key: "noOfSharesWords", header: "No. of Shares in Words" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "faceValue", header: "Face Value" },
  { key: "distinctiveNosFrom", header: "Distinctive Numbers From" },
  { key: "distinctiveNosTo", header: "Distinctive Numbers To" },
  { key: "endorsement", header: "Endorsement" },
  { key: "endorsementFolio", header: "Endorsement Folio" },
  { key: "endorsementDate", header: "Endorsement Date" },
  {
    key: "endorsementShareholderName1",
    header: "Endorsement Shareholder Name 1",
  },
  {
    key: "endorsementShareholderName2",
    header: "Endorsement Shareholder Name 2",
  },
  {
    key: "endorsementShareholderName3",
    header: "Endorsement Shareholder Name 3",
  },
  { key: "companyID", header: "Company Master Id" },
];

export const SecurityMasterColumn = {
  id: true,
  instrumentType: true,
  equityType: true,
  Folio: true,
  certificateNumber: true,
  certificateSerialNumber: true,
  shareholderName1: true,
  shareholderName2: true,
  shareholderName3: true,
  noOfShares: true,
  noOfSharesWords: true,
  dateOfAllotment: true,
  faceValue: true,
  distinctiveNosFrom: true,
  distinctiveNosTo: true,
  endorsement: true,
  endorsementFolio: true,
  endorsementDate: true,
  endorsementShareholderName1: true,
  endorsementShareholderName2: true,
  endorsementShareholderName3: true,
  createdAt: true,
};

export class SecurityMasterModel {
  constructor(
    protected readonly prismaSecurityMaster: PrismaClient["securityMaster"]
  ) {}

  searchQuery({
    companyID,
    search,
  }: {
    companyID?: number;
    search?: string;
  }): Prisma.SecurityMasterWhereInput {
    const wherecompanyID = companyID ? { companyID: companyID } : {};

    return search
      ? {
          ...wherecompanyID,
          OR: [
            {
              Folio: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              certificateNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              certificateSerialNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shareholderName1: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shareholderName2: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              shareholderName3: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              noOfShares: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              noOfSharesWords: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              endorsementFolio: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              endorsementShareholderName1: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              endorsementShareholderName2: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              endorsementShareholderName3: {
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
    data: SecurityMasterRepoCreateType
  ): Promise<SecurityMasterType | null> {
    // do some custom validation...
    const result = await this.prismaSecurityMaster.create({
      data,
      select: SecurityMasterColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: SecurityMasterRepoUpdateType,
    id: number
  ): Promise<SecurityMasterType | null> {
    // do some custom validation...
    await this.prismaSecurityMaster.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<SecurityMasterType | null> {
    // do some custom validation...
    const data = await this.prismaSecurityMaster.findFirst({
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

  async deleteById(id: number): Promise<SecurityMasterType | null> {
    // do some custom validation...
    const data = await this.prismaSecurityMaster.delete({
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
    await this.prismaSecurityMaster.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    companyID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaSecurityMaster.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    companyID?: number;
    search?: string;
  }): Promise<SecurityMasterType[]> {
    // do some custom validation...
    const data = await this.prismaSecurityMaster.findMany({
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
  }): Promise<SecurityMasterType[]> {
    // do some custom validation...
    const data = await this.prismaSecurityMaster.findMany({
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

export const securityMasterModel = new SecurityMasterModel(
  prisma.securityMaster
);
