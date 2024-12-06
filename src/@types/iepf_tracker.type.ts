import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type IepfTrackerType = {
  id: number;
  shareHolderDetails: string | null;
  legalHeirDetails: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
};

export type IepfTrackerCreateType = Omit<
  IepfTrackerType,
  "id" | "createdAt" | "projectID"
>;

export interface IepfTrackerUpdateType
  extends IepfTrackerCreateType {}

export type IepfTrackerRepoCreateType = Prisma.Args<
  typeof prisma.iEPFTracker,
  "create"
>["data"];
export type IepfTrackerRepoUpdateType = Prisma.Args<
  typeof prisma.iEPFTracker,
  "update"
>["data"];
