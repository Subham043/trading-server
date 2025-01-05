import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type SuretyType = Prisma.SuretyGetPayload<{}>;

export type SuretyCreateType = Omit<
  SuretyType,
  "id" | "createdAt" | "projectID"
>;

export interface SuretyUpdateType
  extends SuretyCreateType {}

export type SuretyRepoCreateType = Prisma.Args<
  typeof prisma.surety,
  "create"
>["data"];
export type SuretyRepoUpdateType = Prisma.Args<
  typeof prisma.surety,
  "update"
>["data"];
