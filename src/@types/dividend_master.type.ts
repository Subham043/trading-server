import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type DividendMasterType = {
  id: number;
  recorded_date: Date;
  financial_year?: string | null;
  dividend_per_share?: string | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export type DividendMasterCreateType = Omit<
  DividendMasterType,
  "id" | "recorded_date" | "createdAt"
> & {
  recorded_date: Date | string | undefined;
};

export interface DividendMasterUpdateType extends DividendMasterCreateType {}

export type DividendMasterRepoCreateType = Prisma.Args<
  typeof prisma.dividendMaster,
  "create"
>["data"];
export type DividendMasterRepoUpdateType = Prisma.Args<
  typeof prisma.dividendMaster,
  "update"
>["data"];
