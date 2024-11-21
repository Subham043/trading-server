import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  RegistrarMasterBranchCreateType,
  RegistrarMasterBranchType,
  RegistrarMasterBranchUpdateType,
} from "../../@types/registrar_master_branch.type";

export type RegistrarMasterBranchExcelData = {
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone1: string | undefined;
  telephone2: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  officerAssigned: string | undefined;
  branch: string | undefined;
  registrarMasterId: number;
};

export type RegistrarMasterBranchExportExcelData = {
  id: number;
  registrar_name: string | null | undefined;
  sebi_regn_id: string | null | undefined;
  address: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  pincode: string | null | undefined;
  telephone1: string | null | undefined;
  telephone2: string | null | undefined;
  email: string | null | undefined;
  website: string | null | undefined;
  nameContactPerson: string | null | undefined;
  emailContactPerson: string | null | undefined;
  phoneContactPerson: string | null | undefined;
  designationContactPerson: string | null | undefined;
  officerAssigned: string | null | undefined;
  branch: string | null | undefined;
  createdAt: Date | null | undefined;
  registrarMasterID: number | null | undefined;
};

export const ExcelFailedRegistrarMasterBranchColumn: WorksheetColumnsType = [
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "address", header: "Address" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephon1", header: "Telephone 1" },
  { key: "telephon2", header: "Telephone 2" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  {
    key: "officerAssigned",
    header: "Officer Assigned",
  },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "registrarMasterId", header: "Registrar Master Id" },
  { key: "error", header: "Error" },
];

export const ExcelRegistrarMasterBranchesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "address", header: "Address" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephon1", header: "Telephone 1" },
  { key: "telephon2", header: "Telephone 2" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  {
    key: "officerAssigned",
    header: "Officer Assigned",
  },
  {
    key: "branch",
    header: "Branch",
  },
  { key: "registrarMasterID", header: "Registrar Master Id" },
  { key: "createdAt", header: "Created At" },
];

export const RegistrarMasterColumn = {
  registrar_name: true,
  sebi_regn_id: true,
};

export const RegistrarMasterBranchColumn = {
  id: true,
  address: true,
  city: true,
  state: true,
  pincode: true,
  telephone1: true,
  telephone2: true,
  email: true,
  website: true,
  nameContactPerson: true,
  designationContactPerson: true,
  emailContactPerson: true,
  phoneContactPerson: true,
  officerAssigned: true,
  branch: true,
  registrarMasterID: true,
  createdAt: true,
};

export class RegistrarMasterBranchModel {
  constructor(
    protected readonly prismaRegistrarMasterBranch: PrismaClient["registrarMasterBranch"]
  ) {}

  searchQuery({
    registrarMasterId,
    search,
  }: {
    registrarMasterId?: number;
    search?: string;
  }): Prisma.RegistrarMasterBranchWhereInput {
    const whereregistrarMasterId = registrarMasterId
      ? { registrarMasterID: registrarMasterId }
      : {};

    return search
      ? {
          ...whereregistrarMasterId,
          OR: [
            {
              address: {
                contains: search,
              },
            },
            {
              city: {
                contains: search,
              },
            },
            {
              state: {
                contains: search,
              },
            },
            {
              pincode: {
                contains: search,
              },
            },
            {
              telephone1: {
                contains: search,
              },
            },
            {
              telephone2: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              website: {
                contains: search,
              },
            },
            {
              nameContactPerson: {
                contains: search,
              },
            },
            {
              designationContactPerson: {
                contains: search,
              },
            },
            {
              emailContactPerson: {
                contains: search,
              },
            },
            {
              phoneContactPerson: {
                contains: search,
              },
            },
            {
              officerAssigned: {
                contains: search,
              },
            },
            {
              branch: {
                contains: search,
              },
            },
            {
              registrarMaster: {
                sebi_regn_id: {
                  contains: search,
                },
              },
            },
            {
              registrarMaster: {
                registrar_name: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {
          ...whereregistrarMasterId,
        };
  }

  // create a new user
  async store(
    data: RegistrarMasterBranchCreateType & { registrarMasterId: number }
  ): Promise<RegistrarMasterBranchType> {
    // do some custom validation...
    const { registrarMasterId, ...rest } = data;
    return await this.prismaRegistrarMasterBranch.create({
      data: { ...rest, registrarMasterID: data.registrarMasterId },
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
        },
      },
    });
  }

  async updateById(
    data: RegistrarMasterBranchUpdateType,
    id: number
  ): Promise<RegistrarMasterBranchType> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.update({
      where: { id },
      data,
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
        },
      },
    });
  }

  async findById(id: number): Promise<RegistrarMasterBranchType | null> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.findFirst({
      where: { id },
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
        },
      },
    });
  }

  async findByRegistrarMasterId(registrarMasterId: number): Promise<{
    id: number;
    branch: string | null;
    registrarMasterID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaRegistrarMasterBranch.findFirst({
      where: { registrarMasterID: registrarMasterId },
      select: {
        id: true,
        branch: true,
        registrarMasterID: true,
        createdAt: true,
      },
    });
  }

  async deleteById(id: number): Promise<RegistrarMasterBranchType> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.delete({
      where: { id },
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
        },
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(params: {
    registrarMasterId?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    registrarMasterId?: number;
    search?: string;
  }): Promise<RegistrarMasterBranchType[]> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.findMany({
      where: this.searchQuery(params),
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
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
    registrarMasterId?: number;
    search?: string;
  }): Promise<RegistrarMasterBranchType[]> {
    // do some custom validation...
    return await this.prismaRegistrarMasterBranch.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        registrarMasterId: params.registrarMasterId,
      }),
      select: {
        ...RegistrarMasterBranchColumn,
        registrarMaster: {
          select: RegistrarMasterColumn,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const registrarMasterBranchModel = new RegistrarMasterBranchModel(
  prisma.registrarMasterBranch
);
