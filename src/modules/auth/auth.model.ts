import { PrismaClient } from "@prisma/client";
import { UsersModel } from "../user/user.model";
import { UserType } from "../../@types/user.type";
import { ForgotPasswordBody } from "./schemas/forgot_password.schema";
import { prisma } from "../../db";

export const AuthColumn = {
  id: true,
  name: true,
  email: true,
  status: true,
  role: true,
  password: true,
  createdAt: true,
} as const;

export class AuthModel extends UsersModel {
  constructor(protected readonly prismaUser: PrismaClient["user"]) {
    super(prismaUser);
  }

  async findByEmail(
    email: string
  ): Promise<(UserType & { password: string }) | null> {
    // do some custom validation...
    return await this.prismaUser.findFirst({
      where: { email },
      select: AuthColumn,
    });
  }

  async forgotPassword(
    data: ForgotPasswordBody & { key: string }
  ): Promise<void> {
    // do some custom validation...
    await this.prismaUser.update({
      where: { email: data.email },
      data: {
        key: data.key,
      },
    });
  }

  async resetPassword(
    data: { password: string; key: string },
    id: number
  ): Promise<void> {
    await this.prismaUser.update({
      where: { id },
      data,
    });
  }

  async findByKey(key: string): Promise<{ id: number } | null> {
    // do some custom validation...
    return await this.prismaUser.findFirst({
      where: { key },
      select: {
        id: true,
      },
    });
  }
}

export const authModel = new AuthModel(prisma.user);
