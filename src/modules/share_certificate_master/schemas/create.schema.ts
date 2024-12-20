import { z } from "zod";
import { getById } from "../../company_master/company_master.repository";
import { getById as getByProjectId } from "../../project/project.repository";

export const createShareCertificateMasterBodySchema = z.object({
  instrumentType: z.enum(
    ["InvIT", "IDR", "MFs", "PreferenceShares", "REiT", "Equity", "Warrant"],
    {
      errorMap: () => ({
        message:
          "Instrument Type must be one of [InvIT, IDR, MFs, PreferenceShares, REiT, Equity, Warrant]",
      }),
    }
  ),
  companyID: z
    .number({
      errorMap: () => ({ message: "Company Id must be number" }),
    })
    .positive({ message: "Company Id must be a positive number" }),
});

export const createShareCertificateMasterUniqueSchema = z.object({
  companyID: z
    .number({
      errorMap: () => ({ message: "Company Id must be number" }),
    })
    .positive({ message: "Company Id must be a positive number" })
    .superRefine(async (companyID, ctx) => {
      const company = await getById(companyID);
      if (!company) {
        ctx.addIssue({
          code: "custom",
          message: "Company doesn't exist",
          path: ["companyID"],
        });
        return false;
      }
    }),
});

export const projectIdSchema = z
  .object({
    projectId: z
      .number({
        errorMap: () => ({ message: "project ID must be a number" }),
      })
      .superRefine(async (projectId, ctx) => {
        const project = await getByProjectId(projectId);
        if (!project) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid project master Id",
            path: ["projectId"],
          });
          return false;
        }
      }),
  })
  .required();
