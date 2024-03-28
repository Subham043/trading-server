import { z } from "zod";

export const updateProfileBodySchema = z.object({
  name: z
    .string({
      errorMap: () => ({ message: "Name must be a string" }),
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(256, { message: "Name must be less than 256 characters" })
    .trim(),
  email: z
    .string({
      errorMap: () => ({ message: "Email must be a string" }),
    })
    .min(3, { message: "Email must be at least 3 characters" })
    .max(256, { message: "Email must be less than 256 characters" })
    .email({ message: "Email must be a valid email" })
    .trim(),
});

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
