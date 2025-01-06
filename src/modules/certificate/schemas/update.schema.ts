import { z } from "zod";
import { getById } from "../certificate.repository";

export const updateCertificateBodySchema = z.object({
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

export const updateCertificateIdSchema = z.object({
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
