import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createPaymentTrackerBodySchema = z.object({
  gstFlag: z.enum(
    ["Yes", "No"],
    {
      errorMap: () => ({
        message:
          "GST Flag must be one of [Yes, No]",
      }),
    }
  ),
  valuation: z
    .number({
      errorMap: () => ({ message: "Valuation must be number" }),
    })
    .positive({ message: "Valuation must be a positive number" }),
  percentageTotal: z
    .number({
      errorMap: () => ({
        message: "Percentage Of Total Billing must be number",
      }),
    })
    .positive({
      message: "Percentage Of Total Billing must be a positive number",
    }),
  noOfStages: z
    .number({
      errorMap: () => ({
        message: "No. of Stages must be number",
      }),
    })
    .positive({
      message: "No. of Stages must be a positive number",
    }),
  percentageStage: z
    .number({
      errorMap: () => ({
        message: "Percentage each stage must be number",
      }),
    })
    .positive({
      message: "Percentage each stage must be a positive number",
    }),
  noOfStagesReferral: z
    .number({
      errorMap: () => ({
        message: "No. of Stages For Referral must be number",
      }),
    })
    .positive({
      message: "No. of Stages For Referral must be a positive number",
    })
    .optional()
    .default(0),
  percentageStageReferral: z
    .number({
      errorMap: () => ({
        message: "Percentage each stage For Referral must be number",
      }),
    })
    .positive({
      message: "Percentage each stage For Referral must be a positive number",
    })
    .optional()
    .default(0),
  amountReferral: z
    .number({
      errorMap: () => ({
        message: "Referral Amount must be number",
      }),
    })
    .positive({
      message: "Referral Amount must be a positive number",
    })
    .optional()
    .default(0.0),
});

export const projectIdSchema = z
  .object({
    projectId: z
      .number({
        errorMap: () => ({ message: "project ID must be a number" }),
      })
      .superRefine(async (projectId, ctx) => {
        const project = await getByProjectId(projectId);
        if (!project) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid project master Id",
            path: ["projectId"],
          });
          return false;
        }
      }),
  })
  .required();
