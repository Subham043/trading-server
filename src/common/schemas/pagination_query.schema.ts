import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const getPaginationQuerySchema = z.object({
  page: z
    .number({
      errorMap: () => ({ message: "Page must be a number" }),
    })
    .positive({ message: "Page must be greater than 0" })
    .optional()
    .catch(1),
  limit: z
    .number({
      errorMap: () => ({ message: "Limit must be a number" }),
    })
    .positive({ message: "Limit must be greater than 0" })
    .optional()
    .catch(10),
});

export type GetPaginationQuery = z.infer<typeof getPaginationQuerySchema>;

export const getPaginationQueryJsonSchema = {
  querystring: zodToJsonSchema(getPaginationQuerySchema, {
    name: "getPaginationQuerySchema",
    errorMessages: true,
  }),
};
