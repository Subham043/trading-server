import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  NominationRepoCreateType,
  NominationRepoUpdateType,
  NominationType,
} from "../../@types/nomination.type";

export type NominationExcelData = NominationType;

export type NominationExportExcelData = {
  id: number;
  companyName: string | null | undefined;
  fullName: string | null | undefined;
  age: string | null | undefined;
  address: string | null | undefined;
  isEmployed: string | null | undefined;
  employerName: string | null | undefined;
  salary: string | null | undefined;
  employerAddress: string | null | undefined;
  isBusiness: string | null | undefined;
  businessName: string | null | undefined;
  businessNature: string | null | undefined;
  businessIncome: string | null | undefined;
  businessProfit: string | null | undefined;
  businessAddress: string | null | undefined;
  isProperty: string | null | undefined;
  propertyType: string | null | undefined;
  propertySituation: string | null | undefined;
  propertyValue: string | null | undefined;
  propertyRent: string | null | undefined;
  projectID: number | null | undefined;
  stage: "DocumentsCouriered" | "DocumentsReceived";
};

export const ExcelNominationsColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "companyName", header: "Company Name" },
  { key: "fullName", header: "Full Name" },
  { key: "age", header: "Age" },
  { key: "address", header: "Address" },
  { key: "isEmployed", header: "Is Employed" },
  { key: "employerName", header: "Employer Name" },
  { key: "salary", header: "Salary" },
  { key: "employerAddress", header: "Employer Address" },
  { key: "isBusiness", header: "Is Business" },
  { key: "businessName", header: "Business Name" },
  { key: "businessNature", header: "Business Nature" },
  { key: "businessIncome", header: "Business Income" },
  { key: "businessProfit", header: "Business Profit" },
  { key: "businessAddress", header: "Business Address" }, 
  { key: "isProperty", header: "Is Property" },
  { key: "propertyType", header: "Property Type" },
  { key: "propertySituation", header: "Property Situation" },
  { key: "propertyValue", header: "Property Value" },
  { key: "propertyRent", header: "Property Rent" },
  { key: "projectID", header: "Project Id" },
];

export const NominationColumn = {
  id: true,
  companyName: true,
  fullName: true,
  age: true,
  address: true,
  isEmployed: true,
  employerName: true,
  salary: true,
  employerAddress: true,
  isBusiness: true,
  businessName: true,
  businessNature: true,
  businessIncome: true,
  businessProfit: true,
  businessAddress: true,
  isProperty: true,
  propertyType: true,
  propertySituation: true,
  propertyValue: true,
  propertyRent: true,
  projectID: true,
  createdAt: true,
};

export class NominationModel {
  constructor(
    protected readonly prismaNomination: PrismaClient["nomination"]
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.NominationWhereInput {
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...whereProjectID,
        }
      : {
          ...whereProjectID,
        };
  }

  // create a new user
  async store(
    data: NominationRepoCreateType
  ): Promise<NominationType | null> {
    // do some custom validation...
    const result = await this.prismaNomination.create({
      data,
      select: NominationColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: NominationRepoUpdateType,
    id: number
  ): Promise<NominationType | null> {
    // do some custom validation...
    await this.prismaNomination.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<NominationType | null> {
    // do some custom validation...
    const data = await this.prismaNomination.findFirst({
      where: { id },
    });

    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteById(id: number): Promise<NominationType | null> {
    // do some custom validation...
    const data = await this.prismaNomination.delete({
      where: { id },
    });
    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaNomination.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaNomination.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<NominationType[]> {
    // do some custom validation...
    const data = await this.prismaNomination.findMany({
      where: this.searchQuery(params),
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }

  async paginate(params: {
    limit: number;
    offset: number;
    projectID?: number;
    search?: string;
  }): Promise<NominationType[]> {
    // do some custom validation...
    const data = await this.prismaNomination.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        projectID: params.projectID,
      }),
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }
}

export const nominationModel = new NominationModel(
  prisma.nomination
);