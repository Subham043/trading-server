import { z } from "zod";

export const updateStageNameBodySchema = z.object({
  name: z
    .string({
      errorMap: () => ({ message: "Name must be a string" }),
    })
    .trim(),
});
