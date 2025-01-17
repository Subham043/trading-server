import { z } from "zod";
import { getById } from "../folio.repository";
import { getById as getShareHolderDetailId } from "../../share_holder_detail/share_holder_detail.repository";

export const updateFolioBodySchema = z.object({
  Folio: z
    .string({
      errorMap: () => ({ message: "Folio must be a string" }),
    })
    .trim(),
  shareholderName1ID: z.number({
    errorMap: () => ({
      message: "Shareholder Name 1 must be a number",
    }),
  }),
  shareholderName2ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a number",
      }),
    })
    .optional(),
  shareholderName3ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 3 must be a number",
      }),
    })
    .optional(),
});

export const updateFolioIdSchema = z.object({
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
  shareholderName1ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 1 must be a number",
      }),
    })
    .superRefine(async (shareholderName1ID, ctx) => {
      const shareHolder = await getShareHolderDetailId(shareholderName1ID);
      if (!shareHolder) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid share holder detail Id",
          path: ["shareholderName1ID"],
        });
        return false;
      }
    }),
  shareholderName2ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 2 must be a number",
      }),
    })
    .optional()
    .superRefine(async (shareholderName2ID, ctx) => {
      if (shareholderName2ID) {
        const shareHolder = await getShareHolderDetailId(shareholderName2ID);
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["shareholderName2ID"],
          });
          return false;
        }
      }
    }),
  shareholderName3ID: z
    .number({
      errorMap: () => ({
        message: "Shareholder Name 3 must be a number",
      }),
    })
    .optional()
    .superRefine(async (shareholderName3ID, ctx) => {
      if (shareholderName3ID) {
        const shareHolder = await getShareHolderDetailId(shareholderName3ID);
        if (!shareHolder) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder detail Id",
            path: ["shareholderName3ID"],
          });
          return false;
        }
      }
    }),
});
