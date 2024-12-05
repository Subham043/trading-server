import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createCommunicationTrackerBodySchema = z.object({
  stage: z.enum(["DocumentsCouriered", "DocumentsReceived"], {
    errorMap: () => ({
      message: "Stage must be one of [Yes, No]",
    }),
  }),
  folios: z
    .string({
      errorMap: () => ({ message: "Folios must be a string" }),
    })
    .trim(),
  comments: z
    .string({
      errorMap: () => ({ message: "Valuation must be string" }),
    })
    .optional(),
  dateSent: z
    .string({
      errorMap: () => ({ message: "Date Sent must be a string" }),
    })
    .datetime({
      message: "Date Sent must be a valid date",
    })
    .trim()
    .optional(),
  dateReceived: z
    .string({
      errorMap: () => ({ message: "Date Received must be a string" }),
    })
    .datetime({
      message: "Date Received must be a valid date",
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
