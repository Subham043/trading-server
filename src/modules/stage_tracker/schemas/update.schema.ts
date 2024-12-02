import { z } from "zod";
import { getById } from "../stage_tracker.repository";

export const updateStageTrackerBodySchema = z.object({
  pendingFrom: z.enum(["Client", "RTA", "IEPF", "ServiceProvider"], {
    errorMap: () => ({
      message: "Pending From must be one of [Yes, No]",
    }),
  }),
  stage: z.string({
    errorMap: () => ({ message: "Valuation must be string" }),
  }),
  comments: z
    .string({
      errorMap: () => ({ message: "Valuation must be string" }),
    })
    .optional(),
  date: z
    .string({
      errorMap: () => ({ message: "Date must be a string" }),
    })
    .datetime({
      message: "Date must be a valid date",
    })
    .trim()
    .optional(),
});

export const updateStageTrackerUniqueSchema = z.object({
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
