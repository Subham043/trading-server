import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import {
  ShareHolderDetailRepoCreateType,
  ShareHolderDetailRepoUpdateType,
  ShareHolderDetailType,
} from "../../@types/share_holder_detail.type";

export class ShareHolderDetailModel {
  constructor(
    protected readonly prismaShareHolderDetail: PrismaClient["shareHolderDetail"],
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.ShareHolderDetailWhereInput {
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...whereProjectID,
          OR: [
            {
              shareholderName: {
                contains: search,
              },
            },
            {
              namePan: {
                contains: search,
              },
            },
            {
              nameAadhar: {
                contains: search,
              },
            },
            {
              nameCml: {
                contains: search,
              },
            },
            {
              phone: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
            {
              aadhar: {
                contains: search,
              },
            },
            {
              dematAccountNo: {
                contains: search,
              },
            },
            {
              bankName: {
                contains: search,
              },
            },
            {
              bankAccountNo: {
                contains: search,
              },
            },
            {
              DPID: {
                contains: search,
              },
            },
            {
              bankIFS: {
                contains: search,
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
    data: ShareHolderDetailRepoCreateType
  ): Promise<ShareHolderDetailType | null> {
    // do some custom validation...
    const result = await this.prismaShareHolderDetail.create({
      data,
    });

    return result;
  }

  async updateById(
    data: ShareHolderDetailRepoUpdateType,
    id: number
  ): Promise<ShareHolderDetailType | null> {
    // do some custom validation...
    await this.prismaShareHolderDetail.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<ShareHolderDetailType | null> {
    // do some custom validation...
    const data = await this.prismaShareHolderDetail.findFirst({
      where: { id },
    });
    return data;
  }

  async deleteById(id: number): Promise<ShareHolderDetailType | null> {
    // do some custom validation...
    const data = await this.prismaShareHolderDetail.delete({
      where: { id },
    });
    return data;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaShareHolderDetail.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaShareHolderDetail.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<ShareHolderDetailType[]> {
    // do some custom validation...
    const data = await this.prismaShareHolderDetail.findMany({
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
  }): Promise<ShareHolderDetailType[]> {
    // do some custom validation...
    const data = await this.prismaShareHolderDetail.findMany({
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

export const shareHolderDetailModel = new ShareHolderDetailModel(
  prisma.shareHolderDetail
);
