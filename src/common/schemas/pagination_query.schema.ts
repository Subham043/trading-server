import { z } from "zod";

export const getPaginationQuerySchema = z.object({
  page: z
    .string({
      errorMap: () => ({ message: "ID must be a number" }),
    })
    .regex(/^\d+$/, { message: "ID must be a number" })
    .transform((value) => parseInt(value))
    .optional()
    .catch(1),
  limit: z
    .string({
      errorMap: () => ({ message: "ID must be a number" }),
    })
    .regex(/^\d+$/, { message: "ID must be a number" })
    .transform((value) => parseInt(value))
    .optional()
    .catch(10),
});

export type GetPaginationQuery = z.infer<typeof getPaginationQuerySchema>;
