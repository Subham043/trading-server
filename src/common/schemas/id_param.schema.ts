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

export const getShareCertificateMasterIdParamSchema = z
  .object({
    shareCertificateId: z
      .string({
        errorMap: () => ({
          message: "Share Certificate Master ID must be a number",
        }),
      })
      .regex(/^\d+$/, {
        message: "Share Certificate Master ID must be a number",
      })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetShareCertificateMasterIdParam = z.infer<
  typeof getShareCertificateMasterIdParamSchema
>;

export const getProjectIdParamSchema = z
  .object({
    projectId: z
      .string({
        errorMap: () => ({
          message: "Project ID must be a number",
        }),
      })
      .regex(/^\d+$/, {
        message: "Project ID must be a number",
      })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetProjectIdParam = z.infer<typeof getProjectIdParamSchema>;

export const getShareHolderMasterIdParamSchema = z
  .object({
    shareHolderMasterId: z
      .string({
        errorMap: () => ({
          message: "Share Holder Master ID must be a number",
        }),
      })
      .regex(/^\d+$/, {
        message: "Share Holder Master ID must be a number",
      })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetShareHolderMasterIdParam = z.infer<typeof getShareHolderMasterIdParamSchema>;


export const getPaymentTrackerIdParamSchema = z
  .object({
    paymentTrackerId: z
      .string({
        errorMap: () => ({
          message: "Payment Tracker ID must be a number",
        }),
      })
      .regex(/^\d+$/, {
        message: "Payment Tracker ID must be a number",
      })
      .transform((value) => parseInt(value)),
  })
  .required();

export type GetPaymentTrackerIdParam = z.infer<
  typeof getPaymentTrackerIdParamSchema
>;