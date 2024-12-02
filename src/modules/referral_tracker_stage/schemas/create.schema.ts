import { z } from "zod";
import { getById } from "../../payment_tracker/payment_tracker.repository";

export const createReferralTrackerStageBodySchema = z.object({
  status: z.enum(["InvoiceSent", "Paid", "ReceiptSent", "ToBePaid"], {
    errorMap: () => ({
      message:
        "Status must be one of [InvoiceSent , Paid , ReceiptSent , ToBePaid]",
    }),
  }),
  amount: z
    .number({
      errorMap: () => ({
        message: "Amount must be number",
      }),
    })
    .positive({
      message: "Amount must be a positive number",
    })
    .optional()
    .default(0.0),
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

export const paymentTrackerIdSchema = z
  .object({
    paymentTrackerId: z
      .number({
        errorMap: () => ({ message: "payment tracker ID must be a number" }),
      })
      .superRefine(async (paymentTrackerId, ctx) => {
        const shareCertificate = await getById(paymentTrackerId);
        if (!shareCertificate) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid payment tracker Id",
            path: ["paymentTrackerId"],
          });
          return false;
        }
      }),
  })
  .required();

export type paymentTrackerIdParam = z.infer<typeof paymentTrackerIdSchema>;
