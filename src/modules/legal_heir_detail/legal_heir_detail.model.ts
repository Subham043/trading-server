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
    shareHolderMasterID,
    search,
  }: {
    shareHolderMasterID?: number;
    search?: string;
  }): Prisma.LegalHeirDetailWhereInput {
    const whereProjectID = shareHolderMasterID ? { shareHolderMasterID: shareHolderMasterID } : {};

    return search
      ? {
          ...whereProjectID,
          OR: [
            {
              shareholderNameDeath: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              guardianName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              guardianRelationship: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              guardianPan: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              taxStatus: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              selectClaimant: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              statusClaimant: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              occupationClaimant: {
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
    shareHolderMasterID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaLegalHeirDetail.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    shareHolderMasterID?: number;
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
    shareHolderMasterID?: number;
    search?: string;
  }): Promise<LegalHeirDetailType[]> {
    // do some custom validation...
    const data = await this.prismaLegalHeirDetail.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        shareHolderMasterID: params.shareHolderMasterID,
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
