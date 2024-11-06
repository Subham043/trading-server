import { z } from "zod";
import { getById } from "../folio.repository";
import { getById as getShareHolderDetailId } from "../../share_holder_detail/share_holder_detail.repository";

export const updateFolioBodySchema = z.object({
  equityType: z.enum(["Bonus", "Shares", "Splits", "Rights"], {
    errorMap: () => ({
      message: "Equity Type must be one of [Bonus , Shares , Splits , Rights]",
    }),
  }),
  Folio: z
    .string({
      errorMap: () => ({ message: "Folio must be a string" }),
    })
    .trim(),
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
  shareholderName1: z.number({
    errorMap: () => ({
      message: "Shareholder Name 1 must be a number",
    }),
  }),
  shareholderName2: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a number",
      }),
    })
    .optional(),
  shareholderName3: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 3 must be a number",
      }),
    })
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
    .string({
      errorMap: () => ({
        message: "Face Value must be a number",
      }),
    })
    .optional()
    .transform((value) => (value ? parseFloat(value) : 0)),
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
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 1 must be a number",
      }),
    })
    .optional(),
  endorsementShareholderName2: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 2 must be a number",
      }),
    })
    .optional(),
  endorsementShareholderName3: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 3 must be a number",
      }),
    })
    .optional(),
});

export const updateFolioIdSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const registrarMaster = await getById(id);
      if (!registrarMaster) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
  shareholderName1ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 1 must be a number",
      }),
    })
    .superRefine(async (shareholderName1ID, ctx) => {
      const shareHolder = await getShareHolderDetailId(shareholderName1ID);
      if (!shareHolder) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid share holder detail Id",
          path: ["shareholderName1ID"],
        });
        return false;
      }
    }),
  shareholderName2ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a number",
      }),
    })
    .optional()
    .superRefine(async (shareholderName2ID, ctx) => {
      if (shareholderName2ID) {
        const shareHolder = await getShareHolderDetailId(shareholderName2ID);
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["shareholderName2ID"],
          });
          return false;
        }
      }
    }),
  shareholderName3ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 3 must be a number",
      }),
    })
    .optional()
    .superRefine(async (shareholderName3ID, ctx) => {
      if (shareholderName3ID) {
        const shareHolder = await getShareHolderDetailId(shareholderName3ID);
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["shareholderName3ID"],
          });
          return false;
        }
      }
    }),
  endorsementShareholderName1ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 1 must be a number",
      }),
    })
    .optional()
    .superRefine(async (endorsementShareholderName1ID, ctx) => {
      if (endorsementShareholderName1ID) {
        const shareHolder = await getShareHolderDetailId(
          endorsementShareholderName1ID
        );
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["endorsementShareholderName1ID"],
          });
          return false;
        }
      }
    }),
  endorsementShareholderName2ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 2 must be a number",
      }),
    })
    .optional()
    .superRefine(async (endorsementShareholderName2ID, ctx) => {
      if (endorsementShareholderName2ID) {
        const shareHolder = await getShareHolderDetailId(
          endorsementShareholderName2ID
        );
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["endorsementShareholderName1ID"],
          });
          return false;
        }
      }
    }),
  endorsementShareholderName3ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 3 must be a number",
      }),
    })
    .optional()
    .superRefine(async (endorsementShareholderName3ID, ctx) => {
      if (endorsementShareholderName3ID) {
        const shareHolder = await getShareHolderDetailId(
          endorsementShareholderName3ID
        );
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["endorsementShareholderName1ID"],
          });
          return false;
        }
      }
    }),
});
