import { z } from "zod";
import { getById } from "../iepf_tracker.repository";

export const updateIepfTrackerBodySchema = z.object({
  shareHolderDetails: z
    .string({
      errorMap: () => ({ message: "shareHolderDetails must be a string" }),
    })
    .trim()
    .optional(),
  legalHeirDetails: z
    .string({
      errorMap: () => ({ message: "legalHeirDetails must be a string" }),
    })
    .trim()
    .optional(),
});

export const updateIepfTrackerUniqueSchema = z.object({
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
