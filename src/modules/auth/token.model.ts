import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";

export const AuthTokenColumn = {
  id: true,
  token: true,
  createdAt: true,
};

export class TokensModel {
  constructor(protected readonly prismaToken: PrismaClient["token"]) {}

  async store(
    data: Prisma.Args<typeof prisma.token, "create">["data"]
  ): Promise<void> {
    // do some custom validation...
    await this.prismaToken.create({
      data,
    });
  }

  async findManyByTokenAndUserId(
    token: string,
    userId: number
  ): Promise<{ id: number; token: string }[]> {
    // do some custom validation...
    return await this.prismaToken.findMany({
      select: {
        id: true,
        token: true,
        createdAt: true,
      },
      where: {
        token: token,
        userId: userId,
      },
    });
  }

  async deleteByTokenAndUserId(
    token: string,
    userId: number
  ): Promise<{ id: number; token: string; createdAt: Date | null } | null> {
    // do some custom validation...
    const result = await this.prismaToken.findFirst({
      select: AuthTokenColumn,
      where: {
        token: token,
        userId: userId,
      },
    });
    if (result !== null) {
      return await this.prismaToken.delete({
        select: AuthTokenColumn,
        where: {
          id: result.id,
          token: token,
          userId: userId,
        },
      });
    }
    return result;
  }
}

export const tokensModel = new TokensModel(prisma.token);
