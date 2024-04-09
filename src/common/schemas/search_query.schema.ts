import { z } from "zod";

export const getSearchQuerySchema = z.object({
  search: z
    .string({
      errorMap: () => ({ message: "Search must be a string" }),
    })
    .optional(),
});

export type GetSearchQuery = z.infer<typeof getSearchQuerySchema>;
