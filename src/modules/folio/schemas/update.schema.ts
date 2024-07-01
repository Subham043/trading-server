import { z } from "zod";
import { getById } from "../folio.repository";

export const updateFolioBodySchema = z.object({
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
});
