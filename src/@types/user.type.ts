import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type UserType = {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked" | null;
  role: "user" | "admin" | null;
  createdAt: Date | null;
};

export type AuthType = UserType & {
  access_token: string;
};

export type UserCreateType = Prisma.Args<typeof prisma.user, "create">["data"];
export type UserUpdateType = Prisma.Args<typeof prisma.user, "update">["data"];
