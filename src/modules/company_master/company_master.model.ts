import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  CompanyMasterCreateType,
  CompanyMasterQueryType,
  CompanyMasterUpdateType,
} from "../../@types/company_master.type";

export type CompanyMasterExportExcelData = {
  id: number;
  currentName: string | null | undefined;
  NSE: string | null | undefined;
  BSE: string | null | undefined;
  ISIN: string | null | undefined;
  CIN: string | null | undefined;
  faceValue: number | null;
  closingPriceNSE: number | null;
  closingPriceBSE: number | null;
  registeredOffice: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  pincode: string | null | undefined;
  telephone: string | null | undefined;
  fax: string | null | undefined;
  email: string | null | undefined;
  website: string | null | undefined;
  nameContactPerson: string | null | undefined;
  emailContactPerson: string | null | undefined;
  phoneContactPerson: string | null | undefined;
  designationContactPerson: string | null | undefined;
  registrarMasterBranchId: number | null | undefined;
  registrar_branch: string | null | undefined;
  registrar_city: string | null | undefined;
  registrar_state: string | null | undefined;
  registrar_pincode: string | null | undefined;
  registrar_name: string | null | undefined;
  sebi_regn_id: string | null | undefined;
  registrarMasterId: number | null | undefined;
  createdAt: Date | null | undefined;
};

export type CompanyMasterExcelData = {
  currentName: string | undefined;
  NSE: string | undefined;
  BSE: string | undefined;
  ISIN: string | undefined;
  CIN: string | undefined;
  faceValue: number;
  closingPriceNSE: number;
  closingPriceBSE: number;
  registeredOffice: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone: string | undefined;
  fax: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  registrarMasterBranchId: number | undefined;
  createdBy: number;
};

export type CompanyMasterExcelUpdateData = {
  id: number;
  currentName: string | undefined;
  NSE: string | undefined;
  BSE: string | undefined;
  ISIN: string | undefined;
  CIN: string | undefined;
  faceValue: number | undefined;
  closingPriceNSE: number | undefined;
  closingPriceBSE: number | undefined;
  registeredOffice: string | undefined;
  city: string | undefined;
  state: string | undefined;
  pincode: number | undefined;
  telephone: string | undefined;
  fax: string | undefined;
  email: string | undefined;
  website: string | undefined;
  nameContactPerson: string | undefined;
  emailContactPerson: string | undefined;
  phoneContactPerson: string | undefined;
  designationContactPerson: string | undefined;
  registrarMasterBranchId: number | undefined;
};

export interface CompanyMasterExcelUpdateRepoData
  extends Omit<CompanyMasterExcelUpdateData, "pincode"> {
  pincode?: string | undefined;
}

export const ExcelFailedCompanyMasterColumn: WorksheetColumnsType = [
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
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
    key: "registrarMasterBranchId",
    header: "Registrar Master Branch Id",
  },
  { key: "error", header: "Error" },
];

export const ExcelFailedCompanyMasterUpdateColumn: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
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
    key: "registrarMasterBranchId",
    header: "Registrar Master Branch Id",
  },
  { key: "error", header: "Error" },
];

export const ExcelCompanyMastersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "NSE", header: "NSE" },
  { key: "BSE", header: "BSE" },
  { key: "currentName", header: "Current Name of the Company" },
  { key: "ISIN", header: "ISIN" },
  { key: "CIN", header: "CIN" },
  { key: "faceValue", header: "Face Value" },
  { key: "closingPriceNSE", header: "Closing Price in NSE" },
  { key: "closingPriceBSE", header: "Closing Price in BSE" },
  { key: "registeredOffice", header: "Registered Office" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "pincode", header: "Pincode" },
  { key: "telephone", header: "Telephone" },
  { key: "fax", header: "Fax" },
  { key: "email", header: "Email" },
  { key: "website", header: "Website" },
  { key: "nameContactPerson", header: "Name of Contact Person" },
  { key: "emailContactPerson", header: "Email of Contact Person" },
  { key: "phoneContactPerson", header: "Phone of Contact Person" },
  {
    key: "designationContactPerson",
    header: "Designation of Contact Person",
  },
  { key: "nameChangeMasterId", header: "Name Change Master Id" },
  { key: "registrar_name", header: "Registrar Name" },
  { key: "sebi_regn_id", header: "SEBI Regn. ID" },
  { key: "registrarMasterId", header: "Registrar Master Id" },
  { key: "registrar_branch", header: "Registrar Branch" },
  { key: "registrar_city", header: "Registrar City" },
  { key: "registrar_state", header: "Registrar State" },
  { key: "registrar_pincodes", header: "Registrar Pincode" },
  { key: "registrarMasterBranchId", header: "Registrar Master Branch Id" },
  { key: "createdAt", header: "Created At" },
];

export const CompanyMasterColumn = {
  id: true,
  ISIN: true,
  CIN: true,
  faceValue: true,
  closingPriceNSE: true,
  closingPriceBSE: true,
  registeredOffice: true,
  city: true,
  state: true,
  pincode: true,
  telephone: true,
  fax: true,
  email: true,
  website: true,
  nameContactPerson: true,
  designationContactPerson: true,
  emailContactPerson: true,
  phoneContactPerson: true,
  createdAt: true,
} as const;

export const NameChangeMasterColumn = {
  id: true,
  currentName: true,
  previousName: true,
  dateNameChange: true,
  NSE: true,
  BSE: true,
} as const;

export const RegistrarMasterBranchColumn = {
  branch: true,
  city: true,
  pincode: true,
  state: true,
  id: true,
} as const;

export const RegistrarMasterColumn = {
  id: true,
  registrar_name: true,
  sebi_regn_id: true,
} as const;

export class CompanyMasterModel {
  constructor(
    protected readonly prismaCompanyMaster: PrismaClient["companyMaster"]
  ) {}

  searchQuery({
    search,
    isNameChangeMaster = false,
  }: {
    search?: string;
    isNameChangeMaster?: boolean;
  }): Prisma.CompanyMasterWhereInput {
    const isNameChangeMasterQuery = isNameChangeMaster
      ? {
          nameChangeMasters: {
            some: {
              previousName: {
                not: null,
              },
            },
          },
        }
      : {};
    return search
      ? {
          ...isNameChangeMasterQuery,
          OR: [
            {
              ISIN: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              CIN: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              registeredOffice: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              state: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              pincode: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              telephone: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              fax: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              website: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              nameContactPerson: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              designationContactPerson: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              emailContactPerson: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phoneContactPerson: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              registrarMasterBranch: {
                branch: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              registrarMasterBranch: {
                city: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              registrarMasterBranch: {
                state: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              registrarMasterBranch: {
                pincode: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              registrarMasterBranch: {
                registrarMaster: {
                  sebi_regn_id: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              registrarMasterBranch: {
                registrarMaster: {
                  registrar_name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              nameChangeMasters: {
                some: {
                  currentName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              nameChangeMasters: {
                some: {
                  NSE: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              nameChangeMasters: {
                some: {
                  BSE: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {
          ...isNameChangeMasterQuery,
        };
  }

  // create a new user
  async store(
    data: CompanyMasterCreateType & { createdBy: number }
  ): Promise<CompanyMasterQueryType | null> {
    // do some custom validation...
    const { currentName, NSE, BSE, registrarMasterBranchId, ...companyData } =
      data;
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        const company_master = await tx.companyMaster.create({
          data:
            typeof registrarMasterBranchId === "number"
              ? {
                  ...companyData,
                  registrarMasterBranchId: registrarMasterBranchId
                    ? registrarMasterBranchId
                    : null,
                }
              : companyData,
          select: {
            id: true,
          },
        });

        await tx.nameChangeMaster.create({
          data: {
            companyID: company_master.id,
            currentName: currentName,
            NSE: NSE,
            BSE: BSE,
          },
        });

        return company_master;
      });

      return await this.findById(result.id);
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    data: CompanyMasterUpdateType,
    id: number
  ): Promise<CompanyMasterQueryType | null> {
    // do some custom validation...
    const { currentName, NSE, BSE, ...companyData } = data;
    try {
      await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        await tx.companyMaster.update({
          data: {
            ...companyData,
          },
          where: {
            id,
          },
        });
        const nameChangeMasterIds = await tx.nameChangeMaster.findMany({
          take: 1,
          orderBy: {
            id: "desc",
          },
          where: {
            companyID: id,
          },
          select: {
            id: true,
          },
        });
        await tx.nameChangeMaster.updateMany({
          where: {
            companyID: id,
            id: {
              in: nameChangeMasterIds.map((x) => x.id),
            },
          },
          data: {
            currentName: currentName,
            NSE: NSE,
            BSE: BSE,
          },
        });
      });

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<CompanyMasterQueryType | null> {
    // do some custom validation...
    const data = await this.prismaCompanyMaster.findFirst({
      include: {
        registrarMasterBranch: {
          include: {
            registrarMaster: {
              select: RegistrarMasterColumn,
            },
          },
        },
        nameChangeMasters: {
          select: NameChangeMasterColumn,
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
      where: { id },
    });

    if (data)
      return {
        ...data,
        currentNameChangeMasters:
          data?.nameChangeMasters.length > 0
            ? data?.nameChangeMasters[0]
            : null,
      };
    return null;
  }

  async findByCIN(
    CIN: string
  ): Promise<{ id: number; createdAt: Date | null } | null> {
    return await this.prismaCompanyMaster.findFirst({
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        id: "desc",
      },
      where: {
        CIN,
      },
    });
  }

  async findByISIN(
    ISIN: string
  ): Promise<{ id: number; createdAt: Date | null } | null> {
    return await this.prismaCompanyMaster.findFirst({
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        id: "desc",
      },
      where: {
        ISIN,
      },
    });
  }

  async deleteById(id: number): Promise<CompanyMasterQueryType> {
    // do some custom validation...
    const data = await this.prismaCompanyMaster.delete({
      include: {
        registrarMasterBranch: {
          include: {
            registrarMaster: {
              select: RegistrarMasterColumn,
            },
          },
        },
        nameChangeMasters: {
          select: NameChangeMasterColumn,
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      where: { id },
    });
    return {
      ...data,
      currentNameChangeMasters:
        data.nameChangeMasters.length > 0 ? data.nameChangeMasters[0] : null,
    };
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaCompanyMaster.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount({
    search,
    isNameChangeMaster = false,
  }: {
    search?: string;
    isNameChangeMaster?: boolean;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaCompanyMaster.count({
      where: this.searchQuery({ search, isNameChangeMaster }),
    });
  }

  async all({
    search,
    isNameChangeMaster = false,
  }: {
    search?: string;
    isNameChangeMaster?: boolean;
  }): Promise<CompanyMasterQueryType[]> {
    // do some custom validation...
    const data = await this.prismaCompanyMaster.findMany({
      where: this.searchQuery({ search, isNameChangeMaster }),
      include: {
        registrarMasterBranch: {
          include: {
            registrarMaster: {
              select: RegistrarMasterColumn,
            },
          },
        },
        nameChangeMasters: {
          select: NameChangeMasterColumn,
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
      currentNameChangeMasters:
        x.nameChangeMasters.length > 0 ? x.nameChangeMasters[0] : null,
    }));
  }

  async paginate({
    limit,
    offset,
    search,
    isNameChangeMaster = false,
  }: {
    limit: number;
    offset: number;
    search?: string;
    isNameChangeMaster?: boolean;
  }): Promise<CompanyMasterQueryType[]> {
    // do some custom validation...
    const data = await this.prismaCompanyMaster.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery({ search, isNameChangeMaster }),
      include: {
        registrarMasterBranch: {
          include: {
            registrarMaster: {
              select: RegistrarMasterColumn,
            },
          },
        },
        nameChangeMasters: {
          select: NameChangeMasterColumn,
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return data.map((x) => ({
      ...x,
      currentNameChangeMasters:
        x.nameChangeMasters.length > 0 ? x.nameChangeMasters[0] : null,
    }));
  }

  isObjectEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }

  async updateCompanyMasterImport(
    data: CompanyMasterExcelUpdateRepoData
  ): Promise<CompanyMasterQueryType | null> {
    const { currentName, NSE, BSE, ...companyData } = data;
    const nameChangeUpdateData = { currentName, NSE, BSE };
    try {
      await prisma.$transaction(async (tx) => {
        // Code running in a transaction...
        Object.keys(companyData).forEach(function (key) {
          if (typeof companyData[key] === "undefined") {
            delete companyData[key];
          }
        });
        Object.keys(nameChangeUpdateData).forEach(function (key) {
          if (typeof nameChangeUpdateData[key] === "undefined") {
            delete nameChangeUpdateData[key];
          }
        });
        if (!this.isObjectEmpty(companyData)) {
          await tx.companyMaster.update({
            data: {
              ...companyData,
            },
            where: {
              id: data.id,
            },
          });
        }
        if (!this.isObjectEmpty(nameChangeUpdateData)) {
          const nameChangeMasterIds = await tx.nameChangeMaster.findMany({
            take: 1,
            orderBy: {
              id: "desc",
            },
            where: {
              companyID: data.id,
            },
            select: {
              id: true,
            },
          });
          await tx.nameChangeMaster.updateMany({
            where: {
              companyID: data.id,
              id: {
                in: nameChangeMasterIds.map((x) => x.id),
              },
            },
            data: nameChangeUpdateData,
          });
        }
      });
      return await this.findById(data.id);
    } catch (error) {
      throw error;
    }
  }
}

export const companyMasterModel = new CompanyMasterModel(prisma.companyMaster);
