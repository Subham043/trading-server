import { z } from "zod";
import { getById } from "../payment_tracker_stage.repository";

export const updatePaymentTrackerStageBodySchema = z.object({
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

export const updatePaymentTrackerStageIdSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "Id must be number" }),
    })
    .positive({ message: "Id must be a positive number" })
    .superRefine(async (id, ctx) => {
      const registrarMaster = await getById(id);
      if (!registrarMaster) {
        ctx.addIssue({
          code: "custom",
          message: "Id doesn't exist",
          path: ["id"],
        });
        return false;
      }
    }),
});
