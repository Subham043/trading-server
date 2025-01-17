import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type CorporateMasterType = {
  id: number;
  type: "Bonus" | "Splits" | "Rights";
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
  typeof prisma.corporateMaster,
  "create"
>["data"];
export type CorporateMasterRepoUpdateType = Prisma.Args<
  typeof prisma.corporateMaster,
  "update"
>["data"];
