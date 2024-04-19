import { z } from "zod";
import { MultipartFile } from "../../@types/multipart_file.type";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const postExcelBodySchema = z
  .object({
    file: z
      .any()
      .refine((file) => {
        if (!file || !file.data) {
          return false;
        }
        return true;
      }, "Excel file is required")
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.mimetype),
        "Invalid excel file type"
      )
      .refine(
        (file) => file.size <= MAX_UPLOAD_SIZE,
        "File size must be less than 3MB"
      )
      .transform((file) => file as MultipartFile),
  })
  .required();

export type PostExcelBody = z.infer<typeof postExcelBodySchema>;
