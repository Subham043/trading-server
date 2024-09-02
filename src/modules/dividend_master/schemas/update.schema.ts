import { z } from "zod";
import { getById } from "../dividend_master.repository";

export const updateDividendMasterBodySchema = z.object({
  recorded_date: z
    .string({
      errorMap: () => ({ message: "Recorder Date must be a string" }),
    })
    .datetime({
      message: "Recorder Date must be a valid date",
    }),
  financial_year: z
    .string({
      errorMap: () => ({ message: "Financial year must be a string" }),
    })
    .transform((value) => value.toString())
    .optional(),
  dividend_per_share: z
    .number({
      errorMap: () => ({ message: "Dividend per share must be a number" }),
    })
    .transform((value) => value.toString()),
});

export const updateDividendMasterIdSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const corporateMaster = await getById(id);
      if (!corporateMaster) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
});
