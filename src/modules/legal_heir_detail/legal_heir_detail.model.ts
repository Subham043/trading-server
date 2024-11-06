import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import {
  LegalHeirDetailRepoCreateType,
  LegalHeirDetailRepoUpdateType,
  LegalHeirDetailType,
} from "../../@types/legal_heir_detail.type";

export class LegalHeirDetailModel {
  constructor(
    protected readonly prismaLegalHeirDetail: PrismaClient["legalHeirDetail"],
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.LegalHeirDetailWhereInput {
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...whereProjectID,
          OR: [
            {
              namePan: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              nameAadhar: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              nameCml: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              phone: {
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
              aadhar: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              dematAccountNo: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              bankName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              bankAccountNo: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              DPID: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              bankIFS: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {
          ...whereProjectID,
        };
  }

  // create a new user
  async store(
    data: LegalHeirDetailRepoCreateType
  ): Promise<LegalHeirDetailType | null> {
    // do some custom validation...
    const result = await this.prismaLegalHeirDetail.create({
      data,
    });

    return result;
  }

  async updateById(
    data: LegalHeirDetailRepoUpdateType,
    id: number
  ): Promise<LegalHeirDetailType | null> {
    // do some custom validation...
    await this.prismaLegalHeirDetail.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<LegalHeirDetailType | null> {
    // do some custom validation...
    const data = await this.prismaLegalHeirDetail.findFirst({
      where: { id },
    });
    return data;
  }

  async deleteById(id: number): Promise<LegalHeirDetailType | null> {
    // do some custom validation...
    const data = await this.prismaLegalHeirDetail.delete({
      where: { id },
    });
    return data;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaLegalHeirDetail.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaLegalHeirDetail.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<LegalHeirDetailType[]> {
    // do some custom validation...
    const data = await this.prismaLegalHeirDetail.findMany({
      where: this.searchQuery(params),
      orderBy: {
        id: "desc",
      },
    });
    return data;
  }

  async paginate(params: {
    limit: number;
    offset: number;
    projectID?: number;
    search?: string;
  }): Promise<LegalHeirDetailType[]> {
    // do some custom validation...
    const data = await this.prismaLegalHeirDetail.findMany({
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
    return data;
  }
}

export const legalHeirDetailModel = new LegalHeirDetailModel(
  prisma.legalHeirDetail
);
