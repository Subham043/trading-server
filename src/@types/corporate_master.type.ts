import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type CorporateMasterType = {
  id: number;
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator?: string | null;
  denominator?: string | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export type CorporateMasterCreateType = Omit<
  CorporateMasterType,
  "id" | "date" | "createdAt"
> & {
  date: Date | string | undefined;
};

export interface CorporateMasterUpdateType extends CorporateMasterCreateType {}

export type CorporateMasterRepoCreateType = Prisma.Args<
  typeof prisma.securityTypeMaster,
  "create"
>["data"];
export type CorporateMasterRepoUpdateType = Prisma.Args<
  typeof prisma.securityTypeMaster,
  "update"
>["data"];
