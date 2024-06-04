import { z } from "zod";
import { getById as getByCompanyId } from "../../company_master/company_master.repository";
import { getById } from "../security_master.repository";

export const updateSecurityMasterBodySchema = z.object({
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
  Folio: z
    .string({
      errorMap: () => ({ message: "Folio must be a string" }),
    })
    .trim()
    .optional(),
  certificateNumber: z
    .string({
      errorMap: () => ({ message: "Certificate Number must be a string" }),
    })
    .trim()
    .optional(),
  certificateSerialNumber: z
    .string({
      errorMap: () => ({
        message: "Certificate Serial Number must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderName1: z
    .string({
      errorMap: () => ({
        message: "Shareholder Name 1 must be a string",
      }),
    })
    .trim(),
  shareholderName2: z
    .string({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderName3: z
    .string({
      errorMap: () => ({
        message: "Shareholder Name 3 must be a string",
      }),
    })
    .trim()
    .optional(),
  noOfShares: z
    .string({
      errorMap: () => ({
        message: "No Of Shares must be a string",
      }),
    })
    .trim()
    .optional(),
  noOfSharesWords: z
    .string({
      errorMap: () => ({
        message: "No Of Shares in Words must be a string",
      }),
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
  faceValue: z
    .number({
      errorMap: () => ({
        message: "Face Value must be a number",
      }),
    })
    .optional()
    .catch(() => 0.0),
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

export const updateSecurityMasterUniqueSchema = z.object({
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
