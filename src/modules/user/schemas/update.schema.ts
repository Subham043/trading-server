import { z } from "zod";
import { getByEmail } from "../user.repository";

export const updateUserBodySchema = z.object({
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
  password: z
    .string({
      errorMap: () => ({ message: "Password must be a string" }),
    })
    .min(3, { message: "Password must be at least 3 characters" })
    .max(256, { message: "Password must be less than 256 characters" })
    .trim(),
});

export const updateUserUniqueEmailSchema = z
  .object({
    id: z
      .number({
        errorMap: () => ({ message: "Id must be number" }),
      })
      .positive({ message: "Id must be a positive number" }),
    email: z
      .string({
        errorMap: () => ({ message: "Email must be a string" }),
      })
      .min(3, { message: "Email must be at least 3 characters" })
      .max(256, { message: "Email must be less than 256 characters" })
      .email({ message: "Email must be a valid email" })
      .trim(),
  })
  .superRefine(async ({ id, email }, ctx) => {
    const user = await getByEmail(email);
    if (user && user.id !== id) {
      ctx.addIssue({
        code: "custom",
        message: "Email is taken",
        path: ["email"],
      });
      return false;
    }
  });

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
