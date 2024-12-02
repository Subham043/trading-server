import { z } from "zod";
import { getById } from "../payment_tracker.repository";

export const updatePaymentTrackerBodySchema = z.object({
  tdsFlag: z.enum(["Yes", "No"], {
    errorMap: () => ({
      message: "GST Flag must be one of [Yes, No]",
    }),
  }),
  valuation: z.number({
    errorMap: () => ({ message: "Valuation must be number" }),
  }),
  percentageTotal: z.number({
    errorMap: () => ({
      message: "Percentage Of Total Billing must be number",
    }),
  }),
  noOfStages: z.number({
    errorMap: () => ({
      message: "No. of Stages must be number",
    }),
  }),
  percentageStage: z.number({
    errorMap: () => ({
      message: "Percentage each stage must be number",
    }),
  }),
  noOfStagesReferral: z
    .number({
      errorMap: () => ({
        message: "No. of Stages For Referral must be number",
      }),
    })
    .optional()
    .default(0),
  percentageStageReferral: z
    .number({
      errorMap: () => ({
        message: "Percentage each stage For Referral must be number",
      }),
    })
    .optional()
    .default(0),
  amountReferral: z
    .number({
      errorMap: () => ({
        message: "Referral Amount must be number",
      }),
    })
    .optional()
    .default(0.0),
  tdsPercentage: z
    .number({
      errorMap: () => ({
        message: "TDS Percentage each stage For Referral must be number",
      }),
    })
    .optional()
    .default(0),
});

export const updatePaymentTrackerUniqueSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const securityType = await getById(id);
      if (!securityType) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
});
