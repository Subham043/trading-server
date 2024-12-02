import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createStageTrackerBodySchema = z.object({
  pendingFrom: z.enum(["Client", "RTA", "IEPF", "ServiceProvider"], {
    errorMap: () => ({
      message: "Pending From must be one of [Yes, No]",
    }),
  }),
  stage: z.string({
    errorMap: () => ({ message: "Valuation must be string" }),
  }),
  comments: z
    .string({
      errorMap: () => ({ message: "Valuation must be string" }),
    })
    .optional(),
  date: z
    .string({
      errorMap: () => ({ message: "Date must be a string" }),
    })
    .datetime({
      message: "Date must be a valid date",
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
