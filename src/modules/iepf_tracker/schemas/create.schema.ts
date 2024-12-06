import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createIepfTrackerBodySchema = z.object({
  shareHolderDetails: z
    .string({
      errorMap: () => ({ message: "shareHolderDetails must be a string" }),
    })
    .trim()
    .optional(),
  legalHeirDetails: z
    .string({
      errorMap: () => ({ message: "legalHeirDetails must be a string" }),
    })
    .trim()
    .optional(),
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
