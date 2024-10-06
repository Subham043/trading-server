import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type LegalHeirDetailRepoCreateType = Prisma.Args<
  typeof prisma.legalHeirDetail,
  "create"
>["data"];
export type LegalHeirDetailRepoUpdateType = Prisma.Args<
  typeof prisma.legalHeirDetail,
  "update"
>["data"];
export type LegalHeirDetailType = Prisma.LegalHeirDetailGetPayload<{}>;
