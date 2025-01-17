import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  FolioCreateType,
  FolioType,
  FolioUpdateType,
} from "../../@types/folio.type";

export type FolioExcelData = {
  Folio: string;
  shareholderName1ID: number | undefined;
  shareholderName2ID: number | undefined;
  shareholderName3ID: number | undefined;
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
  Folio: string;
  shareholderName1ID: number | null | undefined;
  shareholderName1: string | null | undefined;
  shareholderName2ID: number | null | undefined;
  shareholderName2: string | null | undefined;
  shareholderName3ID: number | null | undefined;
  shareholderName3: string | null | undefined;
  shareCertificateID: number | null | undefined;
  createdAt: Date | null | undefined;
};

export const ExcelFailedFolioColumn: WorksheetColumnsType = [
  { key: "Folio", header: "Folio" },
  { key: "shareholderName1", header: "Shareholder Name 1" },
  { key: "shareholderName2", header: "Shareholder Name 2" },
  { key: "shareholderName3", header: "Shareholder Name 3" },
  { key: "shareCertificateID", header: "Share Certificate Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelFolioesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "instrumentType", header: "Instrument Type" },
  { key: "equityType", header: "Equity Type" },
  { key: "Folio", header: "Folio" },
  { key: "shareholderName1", header: "Shareholder Name 1" },
  { key: "shareholderName2", header: "Shareholder Name 2" },
  { key: "shareholderName3", header: "Shareholder Name 3" },
  { key: "shareCertificateID", header: "Share Certificate Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const ShareCertificateMasterColumn = {
  instrumentType: true,
};

export const FolioColumn = {
  id: true,
  Folio: true,
  shareholderName1ID: true,
  shareholderName1: true,
  shareholderName2: true,
  shareholderName2ID: true,
  shareholderName3: true,
  shareholderName3ID: true,
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
        id: "desc",
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
        id: "desc",
      },
    });
  }
}

export const folioModel = new FolioModel(prisma.folio);
