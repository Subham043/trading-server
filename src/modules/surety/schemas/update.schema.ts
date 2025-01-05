import { z } from "zod";
import { getById } from "../surety.repository";

export const updateSuretyBodySchema = z.object({
  companyName: z
    .string({
      errorMap: () => ({ message: "Company Name must be a string" }),
    })
    .trim(),
  fullName: z
    .string({
      errorMap: () => ({ message: "Full Name must be a string" }),
    })
    .trim(),
  age: z
    .string({
      errorMap: () => ({ message: "Age must be a string" }),
    })
    .trim()
    .optional(),
  address: z
    .string({
      errorMap: () => ({ message: "Address must be a string" }),
    })
    .trim()
    .optional(),
  isEmployed: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is Employed must be one of [Yes, No]",
      }),
    })
    .optional(),
  employerName: z
    .string({
      errorMap: () => ({ message: "Name must be a string" }),
    })
    .trim()
    .optional(),
  salary: z
    .string({
      errorMap: () => ({ message: "Salary must be a string" }),
    })
    .trim()
    .optional(),
  employerAddress: z
    .string({
      errorMap: () => ({ message: "Address must be a string" }),
    })
    .trim()
    .optional(),
  isBusiness: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is Self-Occupied/Business must be one of [Yes, No]",
      }),
    })
    .optional(),
  businessName: z
    .string({
      errorMap: () => ({ message: "Business Name must be a string" }),
    })
    .trim()
    .optional(),
  businessNature: z
    .string({
      errorMap: () => ({ message: "Business Nature must be a string" }),
    })
    .trim()
    .optional(),
  businessIncome: z
    .string({
      errorMap: () => ({ message: "Annual Income must be a string" }),
    })
    .trim()
    .optional(),
  businessProfit: z
    .string({
      errorMap: () => ({ message: "Annual Profit must be a string" }),
    })
    .trim()
    .optional(),
  businessAddress: z
    .string({
      errorMap: () => ({ message: "Address must be a string" }),
    })
    .trim()
    .optional(),
  isProperty: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message:
          "Own Property within the municipal limits must be one of [Yes, No]",
      }),
    })
    .optional(),
  propertyType: z
    .string({
      errorMap: () => ({ message: "Property Type must be a string" }),
    })
    .trim()
    .optional(),
  propertySituation: z
    .string({
      errorMap: () => ({ message: "Property Situation must be a string" }),
    })
    .trim()
    .optional(),
  propertyValue: z
    .string({
      errorMap: () => ({ message: "Property Value must be a string" }),
    })
    .trim()
    .optional(),
  propertyRent: z
    .string({
      errorMap: () => ({ message: "Annual Rent Received must be a string" }),
    })
    .trim()
    .optional(),
});

export const updateSuretyUniqueSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const securityType = await getById(id);
      if (!securityType) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
});
