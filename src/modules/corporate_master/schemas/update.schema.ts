import { z } from "zod";
import { getById } from "../corporate_master.repository";

export const updateCorporateMasterBodySchema = z.object({
  type: z.enum(
    ["Equity", "Bonus", "Shares", "Splits", "Rights", "ShareBought"],
    {
      errorMap: () => ({
        message:
          "Equity Type must be one of [Equity, Bonus , Shares , Splits , Rights, ShareBought]",
      }),
    }
  ),
  date: z
    .string({
      errorMap: () => ({ message: "Date of Allotment must be a string" }),
    })
    .datetime({
      message: "Date of Allotment must be a valid date",
    })
    .trim(),
  numerator: z
    .number({
      errorMap: () => ({ message: "numerator must be a number" }),
    })
    .transform((value) => value.toString()),
  denominator: z
    .number({
      errorMap: () => ({ message: "denominator must be a number" }),
    })
    .transform((value) => value.toString()),
});

export const updateCorporateMasterIdSchema = z.object({
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
