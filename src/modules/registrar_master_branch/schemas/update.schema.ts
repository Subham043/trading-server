import { z } from "zod";
import { getById } from "../registrar_master_branch.repository";

export const updateRegistrarMasterBodySchema = z.object({
  address: z
    .string({
      errorMap: () => ({ message: "Address must be a string" }),
    })
    .max(256, { message: "Address must be less than 256 characters" })
    .trim()
    .optional(),
  city: z
    .string({
      errorMap: () => ({ message: "city must be a string" }),
    })
    .max(256, { message: "city must be less than 256 characters" })
    .trim()
    .optional(),
  state: z
    .string({
      errorMap: () => ({ message: "state must be a string" }),
    })
    .max(256, { message: "state must be less than 256 characters" })
    .trim()
    .optional(),
  pincode: z
    .number({
      errorMap: () => ({ message: "pincode must be a number" }),
    })
    .positive({ message: "pincode must be a positive number" })
    .transform((value) => value.toString())
    .optional(),
  telephone1: z
    .string({
      errorMap: () => ({ message: "telephone 1 must be a string" }),
    })
    .max(256, { message: "telephone 1 must be less than 256 characters" })
    .trim()
    .optional(),
  telephone2: z
    .string({
      errorMap: () => ({ message: "telephone 2 must be a string" }),
    })
    .max(256, { message: "telephone 2 must be less than 256 characters" })
    .trim()
    .optional(),
  email: z
    .string({
      errorMap: () => ({ message: "email must be a string" }),
    })
    .email({ message: "email must be a valid email" })
    .max(256, { message: "email must be less than 256 characters" })
    .trim()
    .optional(),
  website: z
    .string({
      errorMap: () => ({ message: "website must be a string" }),
    })
    .url({ message: "website must be a valid url" })
    .trim()
    .optional(),
  nameContactPerson: z
    .string({
      errorMap: () => ({ message: "Name of Contact Person must be a string" }),
    })
    .max(256, {
      message: "Name of Contact Person must be less than 256 characters",
    })
    .trim()
    .optional(),
  designationContactPerson: z
    .string({
      errorMap: () => ({
        message: "Designation of Contact Person must be a string",
      }),
    })
    .max(256, {
      message: "Designation of Contact Person must be less than 256 characters",
    })
    .trim()
    .optional(),
  emailContactPerson: z
    .string({
      errorMap: () => ({
        message: "Email of Contact Person must be a string",
      }),
    })
    .email({ message: "Email of Contact Person must be a valid email" })
    .max(256, {
      message: "Email of Contact Person must be less than 256 characters",
    })
    .trim()
    .optional(),
  phoneContactPerson: z
    .string({
      errorMap: () => ({
        message: "Phone of Contact Person must be a string",
      }),
    })
    .optional(),
  branch: z.string({
    errorMap: () => ({
      message: "Brnach must be a string",
    }),
  }),
  officerAssigned: z
    .string({
      errorMap: () => ({
        message: "Officer Assigned must be a string",
      }),
    })
    .optional(),
});

export const updateRegistrarMasterBranchIdSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const registrarMaster = await getById(id);
      if (!registrarMaster) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
});
