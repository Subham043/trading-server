import { z } from "zod";
import { getById } from "../share_holder_master.repository";

export const updateShareHolderMasterBodySchema = z.object({
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

export const updateShareHolderMasterUniqueSchema = z.object({
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
