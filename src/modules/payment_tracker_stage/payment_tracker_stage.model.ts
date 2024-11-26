import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  PaymentTrackerStageCreateType,
  PaymentTrackerStageType,
  PaymentTrackerStageUpdateType,
} from "../../@types/payment_tracker_stage.type";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentTrackerStageExcelData = {
  amount: Decimal | null | undefined;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  paymentTrackerID: number;
};

export type PaymentTrackerStageExportExcelData = {
  id: number;
  amount: Decimal | null | undefined;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid"
    | null
    | undefined;
  paymentTrackerID: number | null | undefined;
  createdAt: Date | null | undefined;
};

export const ExcelPaymentTrackerStageesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "amount", header: "Amount" },
  { key: "status", header: "Status" },
  { key: "paymentTrackerID", header: "Payment Tracker Id" },
  { key: "createdAt", header: "Created At" },
];

export const PaymentTrackerStageColumn = {
  id: true,
  amount: true,
  status: true,
  paymentTrackerID: true,
  createdAt: true,
};

export class PaymentTrackerStageModel {
  constructor(protected readonly prismaPaymentTrackerStage: PrismaClient["paymentTrackerStages"]) {}

  searchQuery({
    paymentTrackerId,
    search,
  }: {
    paymentTrackerId?: number;
    search?: string;
  }): Prisma.PaymentTrackerStagesWhereInput {
    const wherepaymentTrackerId = paymentTrackerId
      ? { paymentTrackerID: paymentTrackerId }
      : {};

    return search
      ? {
          ...wherepaymentTrackerId,
        }
      : {
          ...wherepaymentTrackerId,
        };
  }

  // create a new user
  async store(
    data: PaymentTrackerStageCreateType & { paymentTrackerId: number }
  ): Promise<PaymentTrackerStageType> {
    // do some custom validation...
    const { paymentTrackerId, ...rest } = data;
    return await this.prismaPaymentTrackerStage.create({
      data: { ...rest, paymentTrackerID: data.paymentTrackerId },
      select: {
        ...PaymentTrackerStageColumn,
      },
    });
  }

  async updateById(data: PaymentTrackerStageUpdateType, id: number): Promise<PaymentTrackerStageType> {
    // do some custom validation...
    console.log(data);
    return await this.prismaPaymentTrackerStage.update({
      where: { id },
      data,
      select: {
        ...PaymentTrackerStageColumn,
      },
    });
  }

  async findById(id: number): Promise<PaymentTrackerStageType | null> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.findFirst({
      where: { id },
      select: {
        ...PaymentTrackerStageColumn,
      },
    });
  }

  async findByPaymentTrackerId(paymentTrackerId: number): Promise<{
    id: number;
    paymentTrackerID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaPaymentTrackerStage.findFirst({
      where: { paymentTrackerID: paymentTrackerId },
      select: {
        ...PaymentTrackerStageColumn,
      },
    });
  }

  async deleteById(id: number): Promise<PaymentTrackerStageType> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.delete({
      where: { id },
      select: {
        ...PaymentTrackerStageColumn,
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async totalCount(params: {
    paymentTrackerId?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    paymentTrackerId?: number;
    search?: string;
  }): Promise<PaymentTrackerStageType[]> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.findMany({
      where: this.searchQuery(params),
      select: {
        ...PaymentTrackerStageColumn,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async paginate(params: {
    limit: number;
    offset: number;
    paymentTrackerId?: number;
    search?: string;
  }): Promise<PaymentTrackerStageType[]> {
    // do some custom validation...
    return await this.prismaPaymentTrackerStage.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        paymentTrackerId: params.paymentTrackerId,
      }),
      select: {
        ...PaymentTrackerStageColumn,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}

export const paymentTrackerStagesModel = new PaymentTrackerStageModel(prisma.paymentTrackerStages);
