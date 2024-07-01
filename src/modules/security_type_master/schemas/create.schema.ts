import { z } from "zod";
import { getById } from "../../company_master/company_master.repository";

export const createSecurityTypeMasterBodySchema = z.object({
  instrumentType: z.enum(
    ["InvIT", "IDR", "MFs", "PreferenceShares", "REiT", "Equity", "Warrant"],
    {
      errorMap: () => ({
        message:
          "Instrument Type must be one of [InvIT, IDR, MFs, PreferenceShares, REiT, Equity, Warrant]",
      }),
    }
  ),
  Symbol: z
    .string({
      errorMap: () => ({ message: "Symbol must be a string" }),
    })
    .trim()
    .optional(),
  Series: z
    .string({
      errorMap: () => ({ message: "Series must be a string" }),
    })
    .trim()
    .optional(),
  securityName: z
    .string({
      errorMap: () => ({ message: "Security Name must be a string" }),
    })
    .trim()
    .optional(),
  dateOfListing: z
    .string({
      errorMap: () => ({ message: "Date of Listing must be a string" }),
    })
    .datetime({
      message: "Date of Listing must be a valid date",
    })
    .trim()
    .optional(),
  dateOfAllotment: z
    .string({
      errorMap: () => ({ message: "Date of Allotment must be a string" }),
    })
    .datetime({
      message: "Date of Allotment must be a valid date",
    })
    .trim()
    .optional(),
  redemptionDate: z
    .string({
      errorMap: () => ({ message: "Redemption Date must be a string" }),
    })
    .datetime({
      message: "Redemption Date must be a valid date",
    })
    .trim()
    .optional(),
  conversionDate: z
    .string({
      errorMap: () => ({ message: "Conversion Date must be a string" }),
    })
    .datetime({
      message: "Conversion Date must be a valid date",
    })
    .trim()
    .optional(),
  paidUpValue: z
    .number({
      errorMap: () => ({
        message: "Paid Up Value must be a number",
      }),
    })
    .optional()
    .catch(() => 0.0),
  dividend: z
    .number({
      errorMap: () => ({
        message: "Dividend must be a number",
      }),
    })
    .optional()
    .catch(() => 0.0),
  redemptionAmount: z
    .number({
      errorMap: () => ({
        message: "Redemption Amount must be a number",
      }),
    })
    .optional()
    .catch(() => 0.0),
  conversionAmount: z
    .number({
      errorMap: () => ({
        message: "Conversion Amount must be a number",
      }),
    })
    .optional()
    .catch(() => 0.0),
  marketLot: z
    .string({
      errorMap: () => ({ message: "Market Lot must be a string" }),
    })
    .trim()
    .optional(),
  isinNumber: z
    .string({
      errorMap: () => ({ message: "ISIN Number must be a string" }),
    })
    .trim()
    .optional(),
  distinctiveNosFrom: z
    .string({
      errorMap: () => ({ message: "Distinctive Number From must be a string" }),
    })
    .trim()
    .optional(),
  distinctiveNosTo: z
    .string({
      errorMap: () => ({ message: "Distinctive Number To must be a string" }),
    })
    .trim()
    .optional(),
  companyID: z
    .number({
      errorMap: () => ({ message: "Company Id must be number" }),
    })
    .positive({ message: "Company Id must be a positive number" }),
});

export const createSecurityTypeMasterUniqueSchema = z.object({
  companyID: z
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
          path: ["companyID"],
        });
        return false;
      }
    }),
});
