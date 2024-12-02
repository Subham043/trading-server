import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  ReferralTrackerStageCreateType,
  ReferralTrackerStageType,
  ReferralTrackerStageUpdateType,
} from "../../@types/referral_tracker_stage.type";
import { Decimal } from "@prisma/client/runtime/library";

export type ReferralTrackerStageExcelData = {
  amount: Decimal | null | undefined;
  status: "InvoiceSent" | "Paid" | "ReceiptSent" | "ToBePaid";
  date: string | undefined;
  paymentTrackerID: number;
};

export type ReferralTrackerStageExportExcelData = {
  id: number;
  amount: Decimal | null | undefined;
  status:
    | "InvoiceSent"
    | "Paid"
    | "ReceiptSent"
    | "ToBePaid"
    | null
    | undefined;
  date: string | null | undefined;
  paymentTrackerID: number | null | undefined;
  createdAt: Date | null | undefined;
};

export const ExcelReferralTrackerStageesColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "amount", header: "Amount" },
  { key: "status", header: "Status" },
  { key: "date", header: "Date" },
  { key: "paymentTrackerID", header: "Referral Tracker Id" },
  { key: "createdAt", header: "Created At" },
];

export const ReferralTrackerStageColumn = {
  id: true,
  amount: true,
  status: true,
  date: true,
  paymentTrackerID: true,
  createdAt: true,
};

export class ReferralTrackerStageModel {
  constructor(
    protected readonly prismaReferralTrackerStage: PrismaClient["referralTrackerStages"]
  ) {}

  searchQuery({
    paymentTrackerId,
    search,
  }: {
    paymentTrackerId?: number;
    search?: string;
  }): Prisma.ReferralTrackerStagesWhereInput {
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
    data: ReferralTrackerStageCreateType & { paymentTrackerId: number }
  ): Promise<ReferralTrackerStageType> {
    // do some custom validation...
    const { paymentTrackerId, ...rest } = data;
    return await this.prismaReferralTrackerStage.create({
      data: { ...rest, paymentTrackerID: data.paymentTrackerId },
      select: {
        ...ReferralTrackerStageColumn,
      },
    });
  }

  async updateById(
    data: ReferralTrackerStageUpdateType,
    id: number
  ): Promise<ReferralTrackerStageType> {
    // do some custom validation...
    console.log(data);
    return await this.prismaReferralTrackerStage.update({
      where: { id },
      data,
      select: {
        ...ReferralTrackerStageColumn,
      },
    });
  }

  async findById(id: number): Promise<ReferralTrackerStageType | null> {
    // do some custom validation...
    return await this.prismaReferralTrackerStage.findFirst({
      where: { id },
      select: {
        ...ReferralTrackerStageColumn,
      },
    });
  }

  async findByReferralTrackerId(paymentTrackerId: number): Promise<{
    id: number;
    paymentTrackerID: number | null;
    createdAt: Date;
  } | null> {
    return await this.prismaReferralTrackerStage.findFirst({
      where: { paymentTrackerID: paymentTrackerId },
      select: {
        ...ReferralTrackerStageColumn,
      },
    });
  }

  async deleteById(id: number): Promise<ReferralTrackerStageType> {
    // do some custom validation...
    return await this.prismaReferralTrackerStage.delete({
      where: { id },
      select: {
        ...ReferralTrackerStageColumn,
      },
    });
  }

  async deleteManyByIds(ids: number[]): Promise<Prisma.BatchPayload> {
    // do some custom validation...
    return await this.prismaReferralTrackerStage.deleteMany({
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
    return await this.prismaReferralTrackerStage.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    paymentTrackerId?: number;
    search?: string;
  }): Promise<ReferralTrackerStageType[]> {
    // do some custom validation...
    return await this.prismaReferralTrackerStage.findMany({
      where: this.searchQuery(params),
      select: {
        ...ReferralTrackerStageColumn,
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
  }): Promise<ReferralTrackerStageType[]> {
    // do some custom validation...
    return await this.prismaReferralTrackerStage.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        paymentTrackerId: params.paymentTrackerId,
      }),
      select: {
        ...ReferralTrackerStageColumn,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}

export const referralTrackerStagesModel = new ReferralTrackerStageModel(prisma.referralTrackerStages);
