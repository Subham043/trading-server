import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createShareHolderMasterBodySchema = z.object({
  caseType: z.enum(
    [
      "ClaimSuspense",
      "ClaimSuspenseTransmission",
      "ClaimSuspenseTransmissionIssueDuplicate",
      "ClaimSuspenseTransmissionIssueDuplicateTransposition",
      "Transmission",
      "TransmissionIssueDuplicate",
      "TransmissionIssueDuplicateTransposition",
    ],
    {
      errorMap: () => ({
        message:
          "Case Type must be one of [ClaimSuspense, ClaimSuspenseTransmission, ClaimSuspenseTransmissionIssueDuplicate, ClaimSuspenseTransmissionIssueDuplicateTransposition, Transmission, TransmissionIssueDuplicate, TransmissionIssueDuplicateTransposition]",
      }),
    }
  ),
  noOfLegalHeir: z
    .string({
      errorMap: () => ({ message: "No. Of Legal Heir must be a string" }),
    })
    .trim()
    .optional(),
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