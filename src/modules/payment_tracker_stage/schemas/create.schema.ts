import { z } from "zod";
import { getById } from "../../payment_tracker/payment_tracker.repository";

export const createPaymentTrackerStageBodySchema = z.object({
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
    .optional()
    .default(0.0),
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
