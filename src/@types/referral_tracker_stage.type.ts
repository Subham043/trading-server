import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { Decimal } from "@prisma/client/runtime/library";

export type ReferralTrackerStageType = {
  id: number;
  amount: Decimal | null | undefined;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  paymentTrackerID?: number | null;
  createdAt?: Date | null | undefined;
};

export type ReferralTrackerStageCreateType = Omit<
  ReferralTrackerStageType,
  | "id"
  | "createdAt"
>;

export interface ReferralTrackerStageUpdateType extends ReferralTrackerStageCreateType {}

export type ReferralTrackerStageRepoCreateType = Prisma.Args<
  typeof prisma.referralTrackerStages,
  "create"
>["data"];
export type ReferralTrackerStageRepoUpdateType = Prisma.Args<
  typeof prisma.referralTrackerStages,
  "update"
>["data"];
