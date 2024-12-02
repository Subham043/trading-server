import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentTrackerType = {
  id: number;
  valuation?: Decimal | null;
  percentageTotal?: Decimal | null;
  noOfStages?: number | null;
  percentageStage?: Decimal | null;
  noOfStagesReferral?: number | null;
  percentageStageReferral?: Decimal | null;
  amountReferral?: Decimal | null;
  tdsPercentage?: Decimal | null;
  tdsFlag: "Yes" | "No";
  projectID?: number | null;
  createdAt?: Date | null;
};

export type PaymentTrackerCreateType = Omit<
  PaymentTrackerType,
  "id" | "createdAt" | "projectID"
>;

export interface PaymentTrackerUpdateType
  extends PaymentTrackerCreateType {}

export type PaymentTrackerRepoCreateType = Prisma.Args<
  typeof prisma.paymentTracker,
  "create"
>["data"];
export type PaymentTrackerRepoUpdateType = Prisma.Args<
  typeof prisma.paymentTracker,
  "update"
>["data"];
