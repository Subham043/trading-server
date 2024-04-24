import { z } from "zod";
import { getByBSE, getByNSE } from "../name_change_master.repository";
import { getById } from "../../company_master/company_master.repository";
import { getById as getByNameChangeId } from "../name_change_master.repository";

export const updateNameChangeMasterBodySchema = z.object({
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
    .trim(),
  currentName: z
    .string({
      errorMap: () => ({ message: "New Name must be a string" }),
    })
    .trim(),
  dateNameChange: z
    .string({
      errorMap: () => ({ message: "Date of Name Change must be a string" }),
    })
    .datetime({
      message: "Date of Name Change must be a valid date",
    })
    .optional(),
});

export const updateNameChangeMasterUniqueSchema = z
  .object({
    id: z
      .number({
        errorMap: () => ({ message: "Id must be number" }),
      })
      .positive({ message: "Id must be a positive number" })
      .superRefine(async (id, ctx) => {
        const nameChange = await getByNameChangeId(id);
        if (!nameChange) {
          ctx.addIssue({
            code: "custom",
            message: "Id doesn't exist",
            path: ["id"],
          });
          return false;
        }
      }),
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
            message: "Company Id doesn't exist",
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
