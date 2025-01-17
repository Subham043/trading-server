import { z } from "zod";
import { getById } from "../../company_master/company_master.repository";

export const createCorporateMasterBodySchema = z.object({
  type: z.enum(
    ["Bonus", "Splits", "Rights"],
    {
      errorMap: () => ({
        message:
          "Equity Type must be one of [Bonus , Splits , Rights]",
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

export const companyMasterIdSchema = z
  .object({
    companyMasterId: z
      .number({
        errorMap: () => ({ message: "company master ID must be a number" }),
      })
      .superRefine(async (companyMasterId, ctx) => {
        const companyMaster = await getById(companyMasterId);
        if (!companyMaster) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid company master Id",
            path: ["companyMasterId"],
          });
          return false;
        }
      }),
  })
  .required();

export type CompanyMasterIdParam = z.infer<typeof companyMasterIdSchema>;
