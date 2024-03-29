import { z } from "zod";

export const getPaginationQuerySchema = z.object({
  page: z
    .string({
      errorMap: () => ({ message: "Page must be a number" }),
    })
    .regex(/^\d+$/, { message: "Page must be a number" })
    .transform((value) => parseInt(value))
    .optional()
    .catch(1),
  limit: z
    .string({
      errorMap: () => ({ message: "Limit must be a number" }),
    })
    .regex(/^\d+$/, { message: "Limit must be a number" })
    .transform((value) => parseInt(value))
    .optional()
    .catch(10),
  search: z
    .string({
      errorMap: () => ({ message: "Search must be a string" }),
    })
    .optional(),
});

export type GetPaginationQuery = z.infer<typeof getPaginationQuerySchema>;
