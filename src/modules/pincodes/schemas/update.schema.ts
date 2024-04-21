import { z } from "zod";

export const updatePincodeBodySchema = z.object({
  circle_name: z
    .string({
      errorMap: () => ({ message: "Circle Name must be a string" }),
    })
    .min(3, { message: "Circle Name must be at least 3 characters" })
    .max(256, { message: "Circle Name must be less than 256 characters" })
    .trim(),
  region_name: z
    .string({
      errorMap: () => ({ message: "Region Name must be a string" }),
    })
    .min(3, { message: "Region Name must be at least 3 characters" })
    .max(256, { message: "Region Name must be less than 256 characters" })
    .trim(),
  division_name: z
    .string({
      errorMap: () => ({ message: "Division Name must be a string" }),
    })
    .min(3, { message: "Division Name must be at least 3 characters" })
    .max(256, { message: "Division Name must be less than 256 characters" })
    .trim(),
  office_name: z
    .string({
      errorMap: () => ({ message: "Office Name must be a string" }),
    })
    .min(3, { message: "Office Name must be at least 3 characters" })
    .max(256, { message: "Office Name must be less than 256 characters" })
    .trim(),
  state_name: z
    .string({
      errorMap: () => ({ message: "State Name must be a string" }),
    })
    .min(3, { message: "State Name must be at least 3 characters" })
    .max(256, { message: "State Name must be less than 256 characters" })
    .trim(),
  pincode: z
    .string({
      errorMap: () => ({ message: "Pincode must be a string" }),
    })
    .min(3, { message: "Pincode must be at least 3 characters" })
    .max(256, { message: "Pincode must be less than 256 characters" })
    .trim(),
  office_type: z
    .string({
      errorMap: () => ({ message: "Office Type must be a string" }),
    })
    .min(3, { message: "Office Type must be at least 3 characters" })
    .max(256, { message: "Office Type must be less than 256 characters" })
    .trim(),
  district: z
    .string({
      errorMap: () => ({ message: "District must be a string" }),
    })
    .min(3, { message: "District must be at least 3 characters" })
    .max(256, { message: "District must be less than 256 characters" })
    .trim(),
});

export type UpdatePincodeBody = z.infer<typeof updatePincodeBodySchema>;
