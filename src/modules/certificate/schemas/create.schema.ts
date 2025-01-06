import { z } from "zod";
import { getById } from "../../folio/folio.repository";

export const createCertificateBodySchema = z.object({
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
  })
  .required();

export type ShareCertificateMasterIdParam = z.infer<
  typeof folioIdSchema
>;
