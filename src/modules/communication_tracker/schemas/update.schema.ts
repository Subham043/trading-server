import { z } from "zod";
import { getById } from "../communication_tracker.repository";

export const updateCommunicationTrackerBodySchema = z.object({
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

export const updateCommunicationTrackerUniqueSchema = z.object({
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
