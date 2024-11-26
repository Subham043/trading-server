import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../db";
import { WorksheetColumnsType } from "../../utils/excel";
import {
  PaymentTrackerRepoCreateType,
  PaymentTrackerRepoUpdateType,
  PaymentTrackerType,
} from "../../@types/payment_tracker.type";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentTrackerExcelData = {
  gstFlag: "Yes" | "No";
  valuation: Decimal;
  percentageTotal: Decimal;
  noOfStages: number;
  percentageStage: Decimal;
  noOfStagesReferral: number;
  percentageStageReferral: Decimal;
  amountReferral: Decimal;
  projectID: number;
};

export type PaymentTrackerExportExcelData = {
  id: number;
  valuation: Decimal | null | undefined;
  percentageTotal: Decimal | null | undefined;
  noOfStages: number | null | undefined;
  percentageStage: Decimal | null | undefined;
  noOfStagesReferral: number | null | undefined;
  percentageStageReferral: Decimal | null | undefined;
  amountReferral: Decimal | null | undefined;
  projectID: number | null | undefined;
  gstFlag: "Yes" | "No";
};

export const ExcelPaymentTrackersColumns: WorksheetColumnsType = [
  { key: "id", header: "ID" },
  { key: "valuation", header: "Valuation" },
  { key: "percentageTotal", header: "Percentage Of Total Billing" },
  { key: "noOfStages", header: "No. Of Stages" },
  { key: "percentageStage", header: "Percentage Each Stage" },
  { key: "noOfStagesReferral", header: "No. Of Stages For Referral" },
  {
    key: "percentageStageReferral",
    header: "Percentage Each Stage For Referral",
  },
  {
    key: "amountReferral",
    header: "Amount For Referral",
  },
  { key: "gstFlag", header: "GST Flag" },
  { key: "projectID", header: "Project Id" },
];

export const PaymentTrackerColumn = {
  id: true,
  valuation: true,
  percentageTotal: true,
  noOfStages: true,
  percentageStage: true,
  noOfStagesReferral: true,
  percentageStageReferral: true,
  amountReferral: true,
  gstFlag: true,
  projectID: true,
  createdAt: true,
};

export class PaymentTrackerModel {
  constructor(
    protected readonly prismaPaymentTracker: PrismaClient["paymentTracker"]
  ) {}

  searchQuery({
    projectID,
    search,
  }: {
    projectID?: number;
    search?: string;
  }): Prisma.PaymentTrackerWhereInput {
    const whereProjectID = projectID ? { projectID: projectID } : {};

    return search
      ? {
          ...whereProjectID,
        }
      : {
          ...whereProjectID,
        };
  }

  // create a new user
  async store(
    data: PaymentTrackerRepoCreateType
  ): Promise<PaymentTrackerType | null> {
    // do some custom validation...
    const result = await this.prismaPaymentTracker.create({
      data,
      select: PaymentTrackerColumn,
    });

    return await this.findById(result.id);
  }

  async updateById(
    data: PaymentTrackerRepoUpdateType,
    id: number
  ): Promise<PaymentTrackerType | null> {
    // do some custom validation...
    await this.prismaPaymentTracker.update({
      where: { id },
      data,
    });

    return await this.findById(id);
  }

  async findById(id: number): Promise<PaymentTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaPaymentTracker.findFirst({
      where: { id },
      include: {
        project:{
          include:{
            shareCertificateMasters: true
          }
        }
      },
    });

    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteById(id: number): Promise<PaymentTrackerType | null> {
    // do some custom validation...
    const data = await this.prismaPaymentTracker.delete({
      where: { id },
      include: {
        project: {
          include: {
            shareCertificateMasters: true,
          },
        },
      },
    });
    if (data)
      return {
        ...data,
      };
    return null;
  }

  async deleteManyByIds(ids: number[]): Promise<void> {
    // do some custom validation...
    await this.prismaPaymentTracker.deleteMany({
      where: { id: { in: ids } },
    });
    return;
  }

  async totalCount(params: {
    projectID?: number;
    search?: string;
  }): Promise<number> {
    // do some custom validation...
    return await this.prismaPaymentTracker.count({
      where: this.searchQuery(params),
    });
  }

  async all(params: {
    projectID?: number;
    search?: string;
  }): Promise<PaymentTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaPaymentTracker.findMany({
      where: this.searchQuery(params),
      include: {
        project: {
          include: {
            shareCertificateMasters: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }

  async paginate(params: {
    limit: number;
    offset: number;
    projectID?: number;
    search?: string;
  }): Promise<PaymentTrackerType[]> {
    // do some custom validation...
    const data = await this.prismaPaymentTracker.findMany({
      skip: params.offset,
      take: params.limit,
      where: this.searchQuery({
        search: params.search,
        projectID: params.projectID,
      }),
      include: {
        project: {
          include: {
            shareCertificateMasters: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return data.map((x) => ({
      ...x,
    }));
  }
}

export const paymentTrackerModel = new PaymentTrackerModel(
  prisma.paymentTracker
);
