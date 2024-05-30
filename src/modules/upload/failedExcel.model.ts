import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";

export type FailedExcel = {
  id: number;
  file_name: string;
  file_of: string;
  createdAt: Date | null;
};

export const FailedExcelColumn = {
  id: true,
  file_name: true,
  file_of: true,
  createdAt: true,
} as const;

export class FailedExcelModel {
  constructor(
    protected readonly prismaFailedExcel: PrismaClient["failedExcel"]
  ) {}

  searchQuery(userId: number, search?: string): Prisma.FailedExcelWhereInput {
    return search
      ? {
          createdBy: userId,
          OR: [
            {
              file_name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              file_of: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {
          createdBy: userId,
        };
  }

  // create a new user
  async store(
    data: Prisma.Args<typeof prisma.failedExcel, "create">["data"]
  ): Promise<FailedExcel> {
    // do some custom validation...
    return await this.prismaFailedExcel.create({
      data,
      select: FailedExcelColumn,
    });
  }

  async updateById(
    data: Omit<FailedExcel, "id" | "createdAt">,
    id: number
  ): Promise<FailedExcel> {
    // do some custom validation...
    return await this.prismaFailedExcel.update({
      where: { id },
      data,
      select: FailedExcelColumn,
    });
  }

  async findById(id: number): Promise<FailedExcel | null> {
    // do some custom validation...
    return await this.prismaFailedExcel.findFirst({
      where: { id },
      select: FailedExcelColumn,
    });
  }

  async deleteById(id: number): Promise<FailedExcel> {
    // do some custom validation...
    return await this.prismaFailedExcel.delete({
      where: { id },
      select: FailedExcelColumn,
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaFailedExcel.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async deleteByFileName(file_name: string): Promise<FailedExcel | null> {
    const data = await this.prismaFailedExcel.findFirst({
      where: { file_name },
      select: FailedExcelColumn,
    });
    if (data) {
      return await this.prismaFailedExcel.delete({
        where: { id: data.id },
        select: FailedExcelColumn,
      });
    }
    return null;
  }

  async totalCount(userId: number, search?: string): Promise<number> {
    // do some custom validation...
    return await this.prismaFailedExcel.count({
      where: this.searchQuery(userId, search),
    });
  }

  async paginate(
    userId: number,
    limit: number,
    offset: number,
    search?: string
  ): Promise<FailedExcel[]> {
    // do some custom validation...
    return await this.prismaFailedExcel.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery(userId, search),
      select: FailedExcelColumn,
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const failedExcelModel = new FailedExcelModel(prisma.failedExcel);
