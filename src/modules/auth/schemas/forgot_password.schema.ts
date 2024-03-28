import { z } from "zod";
import { getByEmail } from "../auth.repository";

export const forgotPasswordBodySchema = z.object({
  email: z
    .string({
      errorMap: () => ({ message: "Email must be a string" }),
    })
    .min(3, { message: "Email must be at least 3 characters" })
    .max(256, { message: "Email must be less than 256 characters" })
    .email({ message: "Email must be a valid email" })
    .trim(),
});

export const emailExistSchema = z
  .string({
    errorMap: () => ({ message: "Email must be a string" }),
  })
  .min(3, { message: "Email must be at least 3 characters" })
  .max(256, { message: "Email must be less than 256 characters" })
  .email({ message: "Email must be a valid email" })
  .trim()
  .superRefine(async (email, ctx) => {
    const user = await getByEmail(email);
    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "Email doesn't exist",
        path: ["email"],
      });
      return false;
    }
  });

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;
