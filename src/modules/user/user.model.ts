import {
  UserCreateType,
  UserType,
  UserUpdateType,
} from "../../@types/user.type";
import { WorksheetColumnsType } from "../../utils/excel";
import { Prisma, PrismaClient } from "@prisma/client";
import { createUserUniqueEmailSchema } from "./schemas/create.schema";
import { updateUserUniqueEmailSchema } from "./schemas/update.schema";
import { prisma } from "../../db";

export type UserExcelData = {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirm_password: string | undefined;
};

export const ExcelFailedUsersColumn: WorksheetColumnsType = [
  { key: "name", header: "Name*" },
  { key: "email", header: "Email*" },
  { key: "password", header: "Password*" },
  { key: "confirm_password", header: "Confirm Password*" },
  { key: "error", header: "Error" },
];

export const ExcelUsersColumn: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "status", header: "Status" },
  { key: "role", header: "Role" },
  { key: "createdAt", header: "Created At" },
];

export const UserColumn = {
  id: true,
  name: true,
  email: true,
  status: true,
  role: true,
  createdAt: true,
} as const;

export class UsersModel {
  constructor(protected readonly prismaUser: PrismaClient["user"]) {}

  searchQuery(search?: string): Prisma.UserWhereInput {
    return search
      ? {
          OR: [
            {
              name: {
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
          ],
        }
      : {};
  }

  // create a new user
  async store(data: UserCreateType): Promise<UserType> {
    // do some custom validation...
    await createUserUniqueEmailSchema.parseAsync(data.email);
    return await this.prismaUser.create({
      data,
      select: UserColumn,
    });
  }

  async updateById(data: UserUpdateType, id: number): Promise<UserType> {
    // do some custom validation...
    await updateUserUniqueEmailSchema.parseAsync({
      id: id,
      email: data.email,
    });
    return await this.prismaUser.update({
      where: { id },
      data,
      select: UserColumn,
    });
  }

  async findById(id: number): Promise<UserType | null> {
    // do some custom validation...
    return await this.prismaUser.findFirst({
      where: { id },
      select: UserColumn,
    });
  }

  async findByEmail(email: string): Promise<UserType | null> {
    // do some custom validation...
    return await this.prismaUser.findFirst({
      where: { email },
      select: UserColumn,
    });
  }

  async deleteById(id: number): Promise<UserType> {
    // do some custom validation...
    return await this.prismaUser.delete({
      where: { id },
      select: UserColumn,
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaUser.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(search?: string): Promise<number> {
    // do some custom validation...
    return await this.prismaUser.count({
      where: this.searchQuery(search),
    });
  }

  async all(search?: string): Promise<UserType[]> {
    // do some custom validation...
    return await this.prismaUser.findMany({
      where: this.searchQuery(search),
      select: UserColumn,
      orderBy: {
        id: "desc",
      },
    });
  }

  async paginate(
    limit: number,
    offset: number,
    search?: string
  ): Promise<UserType[]> {
    // do some custom validation...
    return await this.prismaUser.findMany({
      skip: offset,
      take: limit,
      where: this.searchQuery(search),
      select: UserColumn,
      orderBy: {
        id: "desc",
      },
    });
  }
}

export const usersModel = new UsersModel(prisma.user);
