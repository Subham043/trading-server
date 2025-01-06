import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  CertificateCreateType,
  CertificateType,
  CertificateUpdateType,
} from "../../@types/certificate.type";

export type CertificateExcelData = {
  certificateNumber: string;
  certificateSerialNumber: string | undefined;
  folioID: number;
};

export type CertificateExportExcelData = {
  id: number;
  certificateNumber: string;
  certificateSerialNumber?: string | null | undefined;
  folioID?: number | null;
  createdAt?: Date | null | undefined;
};

export const ExcelFailedCertificateColumn: WorksheetColumnsType = [
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "folioID", header: "Certificate Id" },
  { key: "error", header: "Error" },
];

export const ExcelCertificateesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "certificateNumber", header: "Certificate Number" },
  { key: "certificateSerialNumber", header: "Certificate Serial Number" },
  { key: "folioID", header: "Certificate Id" },
  { key: "createdAt", header: "Created At" },
];

export const CertificateColumn = {
  id: true,
  certificateNumber: true,
  certificateSerialNumber: true,
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
        id: "asc",
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
        id: "asc",
      },
    });
  }
}

export const certificateModel = new CertificateModel(prisma.certificate);
