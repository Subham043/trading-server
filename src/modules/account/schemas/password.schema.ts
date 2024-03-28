import { z } from "zod";
import { getById } from "../account.repository";
import { fastifyApp } from "../../..";

export const updatePasswordBodySchema = z
  .object({
    current_password: z
      .string({
        errorMap: () => ({ message: "Current Password must be a string" }),
      })
      .min(3, { message: "Current Password must be at least 3 characters" })
      .max(256, {
        message: "Current Password must be less than 256 characters",
      })
      .trim(),
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

export type UpdatePasswordBody = z.infer<typeof updatePasswordBodySchema>;

export const verifyCurrentPasswordSchema = z
  .object({
    id: z
      .number({
        errorMap: () => ({ message: "Id must be number" }),
      })
      .positive({ message: "Id must be a positive number" }),
    current_password: z
      .string({
        errorMap: () => ({ message: "Current Password must be a string" }),
      })
      .min(3, { message: "Current Password must be at least 3 characters" })
      .max(256, {
        message: "Current Password must be less than 256 characters",
      })
      .trim(),
  })
  .superRefine(async ({ id, current_password }, ctx) => {
    const user = await getById(id);
    if (user) {
      const app = await fastifyApp;
      const isPasswordValid = await app.bcrypt.compare(
        current_password,
        user.password
      );
      if (!isPasswordValid) {
        ctx.addIssue({
          code: "custom",
          message: "Current Password is invalid",
          path: ["current_password"],
        });
        return false;
      }
    }
  });
