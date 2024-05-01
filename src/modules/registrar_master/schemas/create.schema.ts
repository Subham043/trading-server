import { z } from "zod";

export const createRegistrarMasterBodySchema = z.object({
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
