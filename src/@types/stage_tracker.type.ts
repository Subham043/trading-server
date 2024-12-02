import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type StageTrackerType = {
  id: number;
  stage: string;
  comments?: string | null;
  date?: string | null;
  pendingFrom: "Client" | "RTA" | "IEPF" | "ServiceProvider";
  projectID?: number | null;
  createdAt?: Date | null;
};

export type StageTrackerCreateType = Omit<
  StageTrackerType,
  "id" | "createdAt" | "projectID"
>;

export interface StageTrackerUpdateType
  extends StageTrackerCreateType {}

export type StageTrackerRepoCreateType = Prisma.Args<
  typeof prisma.stageTracker,
  "create"
>["data"];
export type StageTrackerRepoUpdateType = Prisma.Args<
  typeof prisma.stageTracker,
  "update"
>["data"];
