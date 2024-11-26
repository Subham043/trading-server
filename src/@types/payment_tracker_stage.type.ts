import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentTrackerStageType = {
  id: number;
  amount: Decimal | null | undefined;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  paymentTrackerID?: number | null;
  createdAt?: Date | null | undefined;
};

export type PaymentTrackerStageCreateType = Omit<
  PaymentTrackerStageType,
  | "id"
  | "createdAt"
>;

export interface PaymentTrackerStageUpdateType extends PaymentTrackerStageCreateType {}

export type PaymentTrackerStageRepoCreateType = Prisma.Args<
  typeof prisma.paymentTrackerStages,
  "create"
>["data"];
export type PaymentTrackerStageRepoUpdateType = Prisma.Args<
  typeof prisma.paymentTrackerStages,
  "update"
>["data"];
