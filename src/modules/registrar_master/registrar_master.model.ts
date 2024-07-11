import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  RegistrarMasterCreateType,
  RegistrarMasterType,
  RegistrarMasterUpdateType,
} from "../../@types/registrar_master.type";

export type RegistrarMasterExcelData = {
  registrar_name: string;
  sebi_regn_id: string;
  createdBy: number;
};
export type RegistrarMasterExportExcelData = {
  id: number | null | undefined;
  registrar_name: string | undefined;
  sebi_regn_id: string | undefined;
  registrarMasterID: number;
  branch: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  pincode: string | null | undefined;
  address: string | null | undefined;
};

export const ExcelFailedRegistrarMasterColumn: WorksheetColumnsType = [
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "error", header: "Error" },
];

export const ExcelRegistrarMastersColumns: WorksheetColumnsType = [
  { key: "registrarMasterID", header: "ID" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "id", header: "Registrar Master Branch Id" },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "address", header: "Address" },
];

export const RegistrarMasterColumn = {
  id: true,
  registrar_name: true,
  sebi_regn_id: true,
  createdAt: true,
};

export class RegistrarMasterModel {
  constructor(
    protected readonly prismaRegistrarMaster: PrismaClient["registrarMaster"]
  ) {}

  searchQuery(search?: string): Prisma.RegistrarMasterWhereInput {
    return search
      ? {
          OR: [
            {
              registrar_name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              sebi_regn_id: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};
  }

  // create a new user
  async store(
    data: RegistrarMasterCreateType & { createdBy: number }
  ): Promise<RegistrarMasterType> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.create({
      data,
      select: RegistrarMasterColumn,
    });
  }

  async updateById(
    data: RegistrarMasterUpdateType,
    id: number
  ): Promise<RegistrarMasterType> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.update({
      where: { id },
      data,
      select: RegistrarMasterColumn,
    });
  }

  async findById(id: number): Promise<RegistrarMasterType | null> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.findFirst({
      where: { id },
      select: RegistrarMasterColumn,
    });
  }

  async deleteById(id: number): Promise<RegistrarMasterType> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.delete({
      where: { id },
      select: RegistrarMasterColumn,
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(search?: string): Promise<number> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.count({
      where: this.searchQuery(search),
    });
  }

  async all(search?: string): Promise<RegistrarMasterType[]> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.findMany({
      where: this.searchQuery(search),
      select: RegistrarMasterColumn,
      orderBy: {
        id: "desc",
      },
    });
  }

  async excelQuery(search?: string): Promise<
    (RegistrarMasterType & {
      registrarMasterBranches: {
        id: number;
        branch: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        address: string | null;
      }[];
    })[]
  > {
    // do some custom validation...
    return await this.prismaRegistrarMaster.findMany({
      where: this.searchQuery(search),
      select: {
        ...RegistrarMasterColumn,
        registrarMasterBranches: {
          select: {
            id: true,
            branch: true,
            city: true,
            state: true,
            pincode: true,
            address: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async paginate(
    limit: number,
    offset: number,
    search?: string
  ): Promise<RegistrarMasterType[]> {
    // do some custom validation...
    return await this.prismaRegistrarMaster.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery(search),
      select: RegistrarMasterColumn,
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const registrarMasterModel = new RegistrarMasterModel(
  prisma.registrarMaster
);
