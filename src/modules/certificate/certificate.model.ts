import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  CertificateCreateType,
  CertificateType,
  CertificateUpdateType,
} from "../../@types/certificate.type";
import { Decimal } from "@prisma/client/runtime/library";

export type CertificateExcelData = {
  equityType: "Bonus" | "ShareBought" | "Equity" | "Splits" | "Rights";
  certificateNumber: string;
  certificateSerialNumber: string | undefined;
  noOfShares: string | undefined;
  noOfSharesWords: string | undefined;
  dateOfAllotment: string | undefined;
  dateOfAction: string | undefined;
  faceValue: number | undefined;
  distinctiveNosFrom: string | undefined;
  distinctiveNosTo: string | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1ID?: number | undefined;
  endorsementShareholderName2ID?: number | undefined;
  endorsementShareholderName3ID?: number | undefined;
  folioID: number;
};

export type CertificateExportExcelData = {
  id: number;
  equityType: "Bonus" | "ShareBought" | "Equity" | "Splits" | "Rights";
  certificateNumber: string;
  certificateSerialNumber?: string | null | undefined;
  shareholderName1Txt: string | null | undefined;
  shareholderName2Txt: string | null | undefined;
  shareholderName3Txt: string | null | undefined;
  noOfShares: string | null | undefined;
  noOfSharesWords: string | null | undefined;
  dateOfAllotment: Date | null | undefined;
  dateOfAction: Date | null | undefined;
  faceValue: Decimal | null | undefined;
  distinctiveNosFrom: string | null | undefined;
  distinctiveNosTo: string | null | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null | undefined;
  endorsementDate?: Date | null | undefined;
  endorsementShareholderName1ID?: number | null | undefined;
  endorsementShareholderName1?: string | null | undefined;
  endorsementShareholderName2ID?: number | null | undefined;
  endorsementShareholderName2?: string | null | undefined;
  endorsementShareholderName3ID?: number | null | undefined;
  endorsementShareholderName3?: string | null | undefined;
  folioID?: number | null;
  createdAt?: Date | null | undefined;
};

export const ExcelFailedCertificateColumn: WorksheetColumnsType = [
  { key: "equityType", header: "Equity Type" },
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "noOfShares", header: "No. of Shares" },
  { key: "noOfSharesWords", header: "No. of Shares in Words" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "dateOfAction", header: "Date of Action" },
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
  { key: "folioID", header: "Folio Id" },
  { key: "error", header: "Error" },
];

export const ExcelCertificateesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "equityType", header: "Equity Type" },
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "noOfShares", header: "No. of Shares" },
  { key: "noOfSharesWords", header: "No. of Shares in Words" },
  { key: "dateOfAllotment", header: "Date of Allotment" },
  { key: "dateOfAction", header: "Date of Action" },
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
  { key: "folioID", header: "Folio Id" },
  { key: "createdAt", header: "Created At" },
];

export const CertificateColumn = {
  id: true,
  equityType: true,
  certificateNumber: true,
  certificateSerialNumber: true,
  shareholderName1Txt: true,
  shareholderName2Txt: true,
  shareholderName3Txt: true,
  noOfShares: true,
  noOfSharesWords: true,
  dateOfAllotment: true,
  dateOfAction: true,
  faceValue: true,
  distinctiveNosFrom: true,
  distinctiveNosTo: true,
  endorsement: true,
  endorsementFolio: true,
  endorsementDate: true,
  endorsementShareholderName1ID: true,
  endorsementShareholderName1: true,
  endorsementShareholderName2ID: true,
  endorsementShareholderName2: true,
  endorsementShareholderName3ID: true,
  endorsementShareholderName3: true,
  folioID: true,
  createdAt: true,
};

export class CertificateModel {
  constructor(protected readonly prismaCertificate: PrismaClient["certificate"]) {}

  searchQuery({
    folioId,
    search,
  }: {
    folioId?: number;
    search?: string;
  }): Prisma.CertificateWhereInput {
    const wherefolioId = folioId ? { folioID: folioId } : {};

    return search
      ? {
          ...wherefolioId,
          OR: [
            {
              certificateNumber: {
                contains: search,
              },
            },
            {
              certificateSerialNumber: {
                contains: search,
              },
            },
            {
              noOfShares: {
                contains: search,
              },
            },
            {
              noOfSharesWords: {
                contains: search,
              },
            },
            {
              endorsementFolio: {
                contains: search,
              },
            },
            {
              endorsementShareholderName1: {
                shareholderName: {
                  contains: search,
                },
              },
            },
            {
              endorsementShareholderName2: {
                shareholderName: {
                  contains: search,
                },
              },
            },
            {
              endorsementShareholderName3: {
                shareholderName: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {
          ...wherefolioId,
        };
  }

  // create a new user
  async store(data: CertificateCreateType & { folioId: number }): Promise<CertificateType> {
    // do some custom validation...
    const { folioId, ...rest } = data;
    return await this.prismaCertificate.create({
      data: { ...rest, folioID: data.folioId },
      select: {
        ...CertificateColumn,
      },
    });
  }

  async updateById(data: CertificateUpdateType, id: number): Promise<CertificateType> {
    // do some custom validation...
    console.log(data);
    return await this.prismaCertificate.update({
      where: { id },
      data,
      select: {
        ...CertificateColumn,
      },
    });
  }

  async findById(id: number): Promise<CertificateType | null> {
    // do some custom validation...
    return await this.prismaCertificate.findFirst({
      where: { id },
      select: {
        ...CertificateColumn,
      },
    });
  }

  async findByFolioId(folioId: number): Promise<{
    id: number;
    certificateNumber: string;
    folioID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaCertificate.findFirst({
      where: { folioID: folioId },
      select: {
        id: true,
        certificateNumber: true,
        folioID: true,
        createdAt: true,
      },
    });
  }

  async deleteById(id: number): Promise<CertificateType> {
    // do some custom validation...
    return await this.prismaCertificate.delete({
      where: { id },
      select: {
        ...CertificateColumn,
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaCertificate.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(params: {
    folioId?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaCertificate.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    folioId?: number;
    search?: string;
  }): Promise<CertificateType[]> {
    // do some custom validation...
    return await this.prismaCertificate.findMany({
      where: this.searchQuery(params),
      select: {
        ...CertificateColumn,
      },
      orderBy: {
        dateOfAction: "asc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    folioId?: number;
    search?: string;
  }): Promise<CertificateType[]> {
    // do some custom validation...
    return await this.prismaCertificate.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        folioId: params.folioId,
      }),
      select: {
        ...CertificateColumn,
      },
      orderBy: {
        dateOfAction: "asc",
      },
    });
  }
}

export const certificateModel = new CertificateModel(prisma.certificate);
