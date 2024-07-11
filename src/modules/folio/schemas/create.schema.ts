import { z } from "zod";
import { getById } from "../../share_certificate_master/share_certificate_master.repository";

export const createFolioBodySchema = z.object({
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
});

export const shareCertificateIdSchema = z
  .object({
    shareCertificateId: z
      .number({
        errorMap: () => ({ message: "share certificate ID must be a number" }),
      })
      .superRefine(async (shareCertificateId, ctx) => {
        const shareCertificate = await getById(shareCertificateId);
        if (!shareCertificate) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share certificate master Id",
            path: ["shareCertificateId"],
          });
          return false;
        }
      }),
  })
  .required();

export type ShareCertificateMasterIdParam = z.infer<
  typeof shareCertificateIdSchema
>;
