import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type NameChangeMasterType = {
  id: number;
  NSE?: string | null;
  BSE?: string | null;
  previousName?: string | null;
  currentName?: string | null;
  dateNameChange?: Date | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export type NameChangeMasterCreateType = Omit<
  NameChangeMasterType,
  "id" | "dateNameChange" | "createdAt"
> & {
  dateNameChange: Date | string | undefined;
};

export interface NameChangeMasterUpdateType
  extends NameChangeMasterCreateType {}

export type NameChangeMasterRepoCreateType = Prisma.Args<
  typeof prisma.nameChangeMaster,
  "create"
>["data"];
export type NameChangeMasterRepoUpdateType = Prisma.Args<
  typeof prisma.nameChangeMaster,
  "update"
>["data"];
