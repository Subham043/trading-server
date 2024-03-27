import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const getIdParamSchema = z.object({
  id: z
    .number({
      errorMap: () => ({ message: "ID must be a number" }),
    })
    .positive({ message: "ID must be greater than 0" }),
});

export type GetIdParam = z.infer<typeof getIdParamSchema>;

export const getIdJsonSchema = {
  params: zodToJsonSchema(getIdParamSchema, {
    name: "getIdParamSchema",
    errorMessages: true,
  }),
};
