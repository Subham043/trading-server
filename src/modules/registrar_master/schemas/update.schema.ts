import { z } from "zod";
import { getById } from "../registrar_master.repository";

export const updateRegistrarMasterBodySchema = z.object({
  registrar_name: z
    .string({
      errorMap: () => ({ message: "Registrar Name must be a string" }),
    })
    .trim(),
  sebi_regn_id: z
    .string({
      errorMap: () => ({ message: "SEBI Regn ID must be a string" }),
    })
    .trim(),
});

export const updateRegistrarMasterUniqueSchema = z.object({
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
