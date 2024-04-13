import { z } from "zod";

export const getUuidParamSchema = z
  .object({
    id: z.string({
      errorMap: () => ({ message: "ID must be a string" }),
    }),
  })
  .required();

export type GetUuidParam = z.infer<typeof getUuidParamSchema>;
