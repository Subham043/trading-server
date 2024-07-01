import { z } from "zod";
import { getById as getByCompanyId } from "../../company_master/company_master.repository";
import { getById } from "../share_certificate_master.repository";

export const updateShareCertificateMasterBodySchema = z.object({
  instrumentType: z.enum(
    ["InvIT", "IDR", "MFs", "PreferenceShares", "REiT", "Equity", "Warrant"],
    {
      errorMap: () => ({
        message:
          "Instrument Type must be one of [InvIT, IDR, MFs, PreferenceShares, REiT, Equity, Warrant]",
      }),
    }
  ),
  equityType: z.enum(["Bonus", "Shares", "Splits", "Rights"], {
    errorMap: () => ({
      message: "Equity Type must be one of [Bonus , Shares , Splits , Rights]",
    }),
  }),
  endorsement: z.enum(["Yes", "No"], {
    errorMap: () => ({
      message: "Endorsement must be one of [Yes , No]",
    }),
  }),
  endorsementFolio: z
    .string({
      errorMap: () => ({ message: "Endorsement Folio must be a string" }),
    })
    .trim()
    .optional(),
  endorsementDate: z
    .string({
      errorMap: () => ({ message: "Endorsement Date must be a string" }),
    })
    .datetime({
      message: "Endorsement Date must be a valid date",
    })
    .trim()
    .optional(),
  endorsementShareholderName1: z
    .string({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 1 must be a string",
      }),
    })
    .trim()
    .optional(),
  endorsementShareholderName2: z
    .string({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 2 must be a string",
      }),
    })
    .trim()
    .optional(),
  endorsementShareholderName3: z
    .string({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 3 must be a string",
      }),
    })
    .trim()
    .optional(),
  companyID: z
    .number({
      errorMap: () => ({ message: "Company Id must be number" }),
    })
    .positive({ message: "Company Id must be a positive number" }),
});

export const updateShareCertificateMasterUniqueSchema = z.object({
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
  companyID: z
    .number({
      errorMap: () => ({ message: "Company Id must be number" }),
    })
    .positive({ message: "Company Id must be a positive number" })
    .superRefine(async (companyID, ctx) => {
      const company = await getByCompanyId(companyID);
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
