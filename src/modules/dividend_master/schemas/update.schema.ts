import { z } from "zod";
import { getById } from "../dividend_master.repository";

export const updateDividendMasterBodySchema = z.object({
  recorded_date: z
    .number({
      errorMap: () => ({ message: "Recorded Date in Year must be a number" }),
    })
    .transform((value) => value.toString()),
  financial_year: z
    .number({
      errorMap: () => ({ message: "Financial year must be a number" }),
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
