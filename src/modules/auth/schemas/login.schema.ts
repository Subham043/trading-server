import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const loginBodySchema = z.object({
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

export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginJsonSchema = {
  body: zodToJsonSchema(loginBodySchema, {
    name: "loginBodySchema",
    errorMessages: true,
  }),
};
