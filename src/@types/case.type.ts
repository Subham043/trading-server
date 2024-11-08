import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type CaseRepoCreateType = Prisma.Args<
  typeof prisma.case,
  "create"
>["data"];
export type CaseRepoUpdateType = Prisma.Args<
  typeof prisma.case,
  "update"
>["data"];
export type CaseType = Prisma.CaseGetPayload<{}>;