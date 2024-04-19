import { z } from "zod";
import { getByCompanyId } from "../registrar_master.repository";
import { getById } from "../../company_master/company_master.repository";

export const createRegistrarMasterBodySchema = z.object({
  registrar_name: z
    .string({
      errorMap: () => ({ message: "Registrar Name must be a string" }),
    })
    .trim(),
  sebi_regn_id: z
    .string({
      errorMap: () => ({ message: "SEBI Regn ID must be a string" }),
    })
    .trim(),
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
  branch: z
    .string({
      errorMap: () => ({
        message: "Brnach must be a string",
      }),
    })
    .optional(),
  officerAssigned: z
    .string({
      errorMap: () => ({
        message: "Officer Assigned must be a string",
      }),
    })
    .optional(),
  companyId: z
    .number({
      errorMap: () => ({ message: "company Id must be a number" }),
    })
    .positive({ message: "company Id must be a positive number" }),
});

export const createRegistrarMasterUniqueSchema = z.object({
  companyId: z
    .number({
      errorMap: () => ({ message: "company Id must be a number" }),
    })
    .positive({ message: "company Id must be a positive number" })
    .superRefine(async (companyId, ctx) => {
      const companyMaster = await getById(companyId);
      if (!companyMaster) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid company Id",
          path: ["companyId"],
        });
        return false;
      }
      const registrarMaster = await getByCompanyId(companyId);
      if (registrarMaster) {
        ctx.addIssue({
          code: "custom",
          message: "company Id already exists",
          path: ["companyId"],
        });
        return false;
      }
    }),
});
