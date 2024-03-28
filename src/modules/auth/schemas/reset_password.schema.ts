import { z } from "zod";

export const resetPasswordBodySchema = z
  .object({
    password: z
      .string({
        errorMap: () => ({ message: "Password must be a string" }),
      })
      .min(3, { message: "Password must be at least 3 characters" })
      .max(256, { message: "Password must be less than 256 characters" })
      .trim(),
    confirm_password: z
      .string({
        errorMap: () => ({ message: "Password must be a string" }),
      })
      .min(3, { message: "Password must be at least 3 characters" })
      .max(256, { message: "Password must be less than 256 characters" })
      .trim(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;
