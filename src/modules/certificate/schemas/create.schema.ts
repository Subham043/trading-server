import { z } from "zod";
import { getById } from "../../folio/folio.repository";
import { getById as getShareHolderDetailId } from "../../share_holder_detail/share_holder_detail.repository";

export const createCertificateBodySchema = z.object({
  equityType: z.enum(["Bonus", "ShareBought", "Equity", "Splits", "Rights"], {
    errorMap: () => ({
      message: "Equity Type must be one of [Bonus , Equity , ShareBought , Splits , Rights]",
    }),
  }),
  certificateNumber: z
    .string({
      errorMap: () => ({ message: "Certificate Number must be a string" }),
    })
    .trim(),
  certificateSerialNumber: z
    .string({
      errorMap: () => ({
        message: "Certificate Serial Number must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderName1Txt: z
    .string({
      errorMap: () => ({
        message: "Shareholder Name 1 must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderName2Txt: z
    .string({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderName3Txt: z
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
  dateOfAction: z
    .string({
      errorMap: () => ({ message: "Date of Action must be a string" }),
    })
    .datetime({
      message: "Date of Action must be a valid date",
    })
    .trim()
    .optional(),
  faceValue: z
    .number({
      errorMap: () => ({
        message: "Face Value must be a number",
      }),
    })
    .default(0)
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
  endorsementShareholderName1ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 1 must be a number",
      }),
    })
    .optional(),
  endorsementShareholderName2ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 2 must be a number",
      }),
    })
    .optional(),
  endorsementShareholderName3ID: z
    .number({
      errorMap: () => ({
        message: "Endorsement Shareholder Name 3 must be a number",
      }),
    })
    .optional(),
});

export const folioIdSchema = z
  .object({
    folioId: z
      .number({
        errorMap: () => ({ message: "folio ID must be a number" }),
      })
      .superRefine(async (folioId, ctx) => {
        const folio = await getById(folioId);
        if (!folio) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid folio master Id",
            path: ["folioId"],
          });
          return false;
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
              path: ["endorsementShareholderName2ID"],
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
              path: ["endorsementShareholderName3ID"],
            });
            return false;
          }
        }
      }),
  })
  .required();

export type ShareCertificateMasterIdParam = z.infer<
  typeof folioIdSchema
>;
