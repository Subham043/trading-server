import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type StageNameType = {
  id: number;
  name: string;
  createdAt?: Date | null;
};

export type StageNameCreateType = Omit<
  StageNameType,
  "id" | "createdAt"
>;

export interface StageNameUpdateType extends StageNameCreateType {}

export type StageNameRepoCreateType = Prisma.Args<
  typeof prisma.stageNames,
  "create"
>["data"];
export type StageNameRepoUpdateType = Prisma.Args<
  typeof prisma.stageNames,
  "update"
>["data"];
