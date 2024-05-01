import { z } from "zod";

export const getIdParamSchema = z
  .object({
    id: z
      .string({
        errorMap: () => ({ message: "ID must be a number" }),
      })
      .regex(/^\d+$/, { message: "ID must be a number" })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetIdParam = z.infer<typeof getIdParamSchema>;

export const getIdsBodySchema = z
  .object({
    id: z
      .number({
        errorMap: () => ({ message: "ID must be a number" }),
      })
      .array()
      .nonempty("At least one ID is required"),
  })
  .required();

export type GetIdsBody = z.infer<typeof getIdsBodySchema>;

export const getCompanyIdParamSchema = z
  .object({
    companyId: z
      .string({
        errorMap: () => ({ message: "Company ID must be a number" }),
      })
      .regex(/^\d+$/, { message: "Company ID must be a number" })
      .transform((value) => parseInt(value)),
  })
  .required();

export const getRegistrarMasterIdParamSchema = z
  .object({
    registrarMasterId: z
      .string({
        errorMap: () => ({ message: "Registrar Master ID must be a number" }),
      })
      .regex(/^\d+$/, { message: "Registrar Master ID must be a number" })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetCompanyIdParam = z.infer<typeof getCompanyIdParamSchema>;

export const getCompanyIdAndIdParamSchema = z
  .object({
    id: z
      .string({
        errorMap: () => ({ message: "ID must be a number" }),
      })
      .regex(/^\d+$/, { message: "ID must be a number" })
      .transform((value) => parseInt(value)),
    companyId: z
      .string({
        errorMap: () => ({ message: "Company ID must be a number" }),
      })
      .regex(/^\d+$/, { message: "Company ID must be a number" })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetCompanyIdAndIdParam = z.infer<
  typeof getCompanyIdAndIdParamSchema
>;
