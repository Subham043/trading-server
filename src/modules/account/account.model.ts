import { PrismaClient } from "@prisma/client";
import { UsersModel } from "../user/user.model";
import { prisma } from "../../db";
import { UpdateProfileBody } from "./schemas/profile.schema";

export class AccountModel extends UsersModel {
  constructor(protected readonly prismaUser: PrismaClient["user"]) {
    super(prismaUser);
  }

  async findPasswordById(
    id: number
  ): Promise<{ id: number; password: string } | null> {
    // do some custom validation...
    return await this.prismaUser.findFirst({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    });
  }

  async updateProfile(
    data: UpdateProfileBody,
    id: number
  ): Promise<{
    name: string;
    email: string;
  }> {
    return await this.prismaUser.update({
      where: { id },
      data: data,
      select: {
        name: true,
        email: true,
      },
    });
  }

  async updatePassword(data: { password: string }, id: number): Promise<void> {
    await this.prismaUser.update({
      where: { id },
      data: data,
    });
  }
}

export const accountModel = new AccountModel(prisma.user);
