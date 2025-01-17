import { z } from "zod";

export const getRightQuerySchema = z.object({
  rights: z
    .string({
      errorMap: () => ({ message: "Right must be a string" }),
    })
    .optional(),
});

export type GetRightQuery = z.infer<typeof getRightQuerySchema>;
