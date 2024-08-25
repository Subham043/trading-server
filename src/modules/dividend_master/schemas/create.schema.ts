import { z } from "zod";
import { getById } from "../../company_master/company_master.repository";

export const createDividendMasterBodySchema = z.object({
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
