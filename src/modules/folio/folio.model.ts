import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  FolioCreateType,
  FolioType,
  FolioUpdateType,
} from "../../@types/folio.type";
import { Decimal } from "@prisma/client/runtime/library";

export type FolioExcelData = {
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio: string;
  certificateNumber: string | undefined;
  certificateSerialNumber: string | undefined;
  shareholderName1: number | undefined;
  shareholderName2: number | undefined;
  shareholderName3: number | undefined;
  noOfShares: string | undefined;
  noOfSharesWords: string | undefined;
  dateOfAllotment: string | undefined;
  faceValue: number | undefined;
  distinctiveNosFrom: string | undefined;
  distinctiveNosTo: string | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | undefined;
  endorsementDate?: string | undefined;
  endorsementShareholderName1?: number | undefined;
  endorsementShareholderName2?: number | undefined;
  endorsementShareholderName3?: number | undefined;
  shareCertificateID: number;
};

export type FolioExportExcelData = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant"
    | null
    | undefined;
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio: string;
  certificateNumber: string | null | undefined;
  certificateSerialNumber: string | null | undefined;
  shareholderName1ID: number | null | undefined;
  shareholderName1: string | null | undefined;
  shareholderName2ID: number | null | undefined;
  shareholderName2: string | null | undefined;
  shareholderName3ID: number | null | undefined;
  shareholderName3: string | null | undefined;
  noOfShares: string | null | undefined;
  noOfSharesWords: string | null | undefined;
  dateOfAllotment: Date | null | undefined;
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
  shareCertificateID: number | null | undefined;
  createdAt: Date | null | undefined;
};

export const ExcelFailedFolioColumn: WorksheetColumnsType = [
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
  { key: "shareCertificateID", header: "Share Certificate Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelFolioesColumns: WorksheetColumnsType = [
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
  { key: "shareCertificateID", header: "Share Certificate Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const ShareCertificateMasterColumn = {
  instrumentType: true,
};

export const FolioColumn = {
  id: true,
  equityType: true,
  Folio: true,
  certificateNumber: true,
  certificateSerialNumber: true,
  shareholderName1ID: true,
  shareholderName1: true,
  shareholderName2: true,
  shareholderName2ID: true,
  shareholderName3: true,
  shareholderName3ID: true,
  noOfShares: true,
  noOfSharesWords: true,
  dateOfAllotment: true,
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
  shareCertificateID: true,
  createdAt: true,
};

export class FolioModel {
  constructor(protected readonly prismaFolio: PrismaClient["folio"]) {}

  searchQuery({
    shareCertificateId,
    search,
  }: {
    shareCertificateId?: number;
    search?: string;
  }): Prisma.FolioWhereInput {
    const whereshareCertificateId = shareCertificateId
      ? { shareCertificateID: shareCertificateId }
      : {};

    return search
      ? {
          ...whereshareCertificateId,
          OR: [
            {
              Folio: {
                contains: search,
              },
            },
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
              shareholderName1: {
                shareholderName: {
                  contains: search,
                },
              },
            },
            {
              shareholderName2: {
                shareholderName: {
                  contains: search,
                },
              },
            },
            {
              shareholderName3: {
                shareholderName: {
                  contains: search,
                },
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
          ...whereshareCertificateId,
        };
  }

  // create a new user
  async store(
    data: FolioCreateType & { shareCertificateId: number }
  ): Promise<FolioType> {
    // do some custom validation...
    const { shareCertificateId, ...rest } = data;
    return await this.prismaFolio.create({
      data: { ...rest, shareCertificateID: data.shareCertificateId },
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
    });
  }

  async updateById(data: FolioUpdateType, id: number): Promise<FolioType> {
    // do some custom validation...
    console.log(data);
    return await this.prismaFolio.update({
      where: { id },
      data,
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
    });
  }

  async findById(id: number): Promise<FolioType | null> {
    // do some custom validation...
    return await this.prismaFolio.findFirst({
      where: { id },
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
    });
  }

  async findByShareCertificateMasterId(shareCertificateId: number): Promise<{
    id: number;
    Folio: string | null;
    shareCertificateID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaFolio.findFirst({
      where: { shareCertificateID: shareCertificateId },
      select: {
        id: true,
        Folio: true,
        shareCertificateID: true,
        createdAt: true,
      },
    });
  }

  async deleteById(id: number): Promise<FolioType> {
    // do some custom validation...
    return await this.prismaFolio.delete({
      where: { id },
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaFolio.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(params: {
    shareCertificateId?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaFolio.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    shareCertificateId?: number;
    search?: string;
  }): Promise<FolioType[]> {
    // do some custom validation...
    return await this.prismaFolio.findMany({
      where: this.searchQuery(params),
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
      orderBy: {
        dateOfAllotment: "asc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    shareCertificateId?: number;
    search?: string;
  }): Promise<FolioType[]> {
    // do some custom validation...
    return await this.prismaFolio.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        shareCertificateId: params.shareCertificateId,
      }),
      select: {
        ...FolioColumn,
        shareCertificateMaster: {
          select: ShareCertificateMasterColumn,
        },
      },
      orderBy: {
        dateOfAllotment: "asc",
      },
    });
  }
}

export const folioModel = new FolioModel(prisma.folio);
