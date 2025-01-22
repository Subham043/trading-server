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
  fullName: string | null | undefined;
  fatherName: string | null | undefined;
  occupation: string | null | undefined;
  nationality: string | null | undefined;
  email: string | null | undefined;
  relationship: string | null | undefined;
  mobile: string | null | undefined;
  pan: string | null | undefined;
  address: string | null | undefined;
  isMinor: string | null | undefined;
  dobMinor: Date | null | undefined;
  dateMajority: Date | null | undefined;
  gurdianName: string | null | undefined;
  gurdianAddress: string | null | undefined;
  isDeceased: string | null | undefined;
  deceasedName: string | null | undefined;
  dobDeceased: Date | null | undefined;
  deceasedFatherName: string | null | undefined;
  deceasedOccupation: string | null | undefined;
  deceasedNationality: string | null | undefined;
  deceasedEmail: string | null | undefined;
  deceasedRelationship: string | null | undefined;
  deceasedRelationshipMinor: string | null | undefined;
  projectID: number | null | undefined;
};

export const ExcelNominationsColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "fullName", header: "Full Name" },
  { key: "fatherName", header: "Father/Mother/Spouse Name" },
  { key: "occupation", header: "Occupation" },
  { key: "nationality", header: "Nationality" },
  { key: "email", header: "Email" },
  { key: "relationship", header: "Relationship with the security holder" },
  { key: "mobile", header: "Mobile" },
  { key: "pan", header: "PAN" },
  { key: "address", header: "Address" },
  { key: "isMinor", header: "Is Minor" },
  { key: "dobMinor", header: "Date of Birth" },
  { key: "dateMajority", header: "Date of attaining Majority" },
  { key: "gurdianName", header: "Gurdian Address" },
  { key: "gurdianAddress", header: "Gurdian Address" },
  { key: "isDeceased", header: "Is Deceased" },
  { key: "deceasedName", header: "Name" },
  { key: "dobDeceased", header: "Date of Birth" },
  { key: "deceasedFatherName", header: "Father/Mother/Spouse Name" },
  { key: "deceasedOccupation", header: "Occupation" },
  { key: "deceasedNationality", header: "Nationality" },
  { key: "deceasedEmail", header: "Email" },
  {
    key: "deceasedRelationship",
    header: "Relationship with the security holder",
  },
  {
    key: "deceasedRelationshipMinor",
    header: "Relationship with the minor nominee",
  },
  { key: "projectID", header: "Project Id" },
];

export const NominationColumn = {
  id: true,
  fullName: true,
  fatherName: true,
  occupation: true,
  nationality: true,
  email: true,
  relationship: true,
  mobile: true,
  pan: true,
  address: true,
  isMinor: true,
  dobMinor: true,
  dateMajority: true,
  gurdianName: true,
  gurdianAddress: true,
  isDeceased: true,
  deceasedName: true,
  dobDeceased: true,
  deceasedFatherName: true,
  deceasedOccupation: true,
  deceasedNationality: true,
  deceasedEmail: true,
  deceasedRelationship: true,
  deceasedRelationshipMinor: true,
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
