import { z } from "zod";

export const getKeyParamSchema = z
  .object({
    key: z
      .string({
        errorMap: () => ({ message: "Key must be a string" }),
      })
      .uuid("Invalid key")
      .trim(),
  })
  .required();

export type GetKeyParam = z.infer<typeof getKeyParamSchema>;
