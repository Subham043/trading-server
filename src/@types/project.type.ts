import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type ProjectType = {
  id: number;
  name: string;
  userID?: number | null;
  createdAt?: Date | null;
};

export type ProjectCreateType = Omit<
  ProjectType,
  "id" | "userID" | "createdAt"
>;

export interface ProjectUpdateType extends ProjectCreateType {}

export type ProjectRepoCreateType = Prisma.Args<
  typeof prisma.project,
  "create"
>["data"];
export type ProjectRepoUpdateType = Prisma.Args<
  typeof prisma.project,
  "update"
>["data"];
