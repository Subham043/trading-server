import { z } from "zod";
import { getByBSE, getByNSE } from "../name_change_master.repository";
import { getById } from "../../company_master/company_master.repository";

export const createNameChangeMasterBodySchema = z.object({
  NSE: z
    .string({
      errorMap: () => ({ message: "NSE must be a string" }),
    })
    .trim()
    .optional(),
  BSE: z
    .string({
      errorMap: () => ({ message: "BSE must be a string" }),
    })
    .trim()
    .optional(),
  previousName: z
    .string({
      errorMap: () => ({ message: "Previous Name must be a string" }),
    })
    .trim()
    .optional(),
  currentName: z
    .string({
      errorMap: () => ({ message: "New Name must be a string" }),
    })
    .trim()
    .optional(),
  // oldSecuritySymbol: z
  //   .string({
  //     errorMap: () => ({ message: "Old Security Symbol must be a string" }),
  //   })
  //   .trim()
  //   .optional(),
  // newSecuritySymbol: z
  //   .string({
  //     errorMap: () => ({ message: "New Security Symbol must be a string" }),
  //   })
  //   .trim()
  //   .optional(),
  // previousRTA: z
  //   .string({
  //     errorMap: () => ({ message: "Previous RTA must be a string" }),
  //   })
  //   .trim()
  //   .optional(),
  // newRTA: z
  //   .string({
  //     errorMap: () => ({ message: "New RTA must be a string" }),
  //   })
  //   .trim()
  //   .optional(),
  // dateRTAChange: z
  //   .string({
  //     errorMap: () => ({ message: "Date of RTA Change must be a string" }),
  //   })
  //   .datetime({
  //     message: "Date of RTA Change must be a valid date",
  //   })
  //   .trim()
  //   .optional(),
  // dateSecurityChange: z
  //   .string({
  //     errorMap: () => ({ message: "Date of Security Change must be a string" }),
  //   })
  //   .datetime({
  //     message: "Date of Name Change must be a valid date",
  //   })
  //   .trim()
  //   .optional(),
  dateNameChange: z
    .string({
      errorMap: () => ({ message: "Date of Name Change must be a string" }),
    })
    .datetime({
      message: "Date of Name Change must be a valid date",
    })
    .trim()
    .optional(),
});

export const createNameChangeMasterUniqueSchema = z
  .object({
    companyId: z
      .number({
        errorMap: () => ({ message: "Company Id must be number" }),
      })
      .positive({ message: "Company Id must be a positive number" })
      .superRefine(async (companyID, ctx) => {
        const company = await getById(companyID);
        if (!company) {
          ctx.addIssue({
            code: "custom",
            message: "Company doesn't exist",
            path: ["companyId"],
          });
          return false;
        }
      }),
    NSE: z
      .string({
        errorMap: () => ({ message: "NSE must be a string" }),
      })
      .max(256, { message: "NSE must be less than 256 characters" })
      .trim()
      .optional(),
    BSE: z
      .string({
        errorMap: () => ({ message: "BSE must be a string" }),
      })
      .max(256, { message: "BSE must be less than 256 characters" })
      .trim()
      .optional(),
  })
  .superRefine(async ({ companyId, BSE, NSE }, ctx) => {
    if (BSE) {
      const nameChangeMaster = await getByBSE(BSE);
      if (nameChangeMaster && nameChangeMaster.companyId !== companyId) {
        ctx.addIssue({
          code: "custom",
          message: "BSE already exists",
          path: ["BSE"],
        });
        return false;
      }
    }
    if (NSE) {
      const nameChangeMaster = await getByNSE(NSE);
      if (nameChangeMaster && nameChangeMaster.companyId !== companyId) {
        ctx.addIssue({
          code: "custom",
          message: "NSE already exists",
          path: ["NSE"],
        });
        return false;
      }
    }
  });
