import { z } from "zod";
import { getById } from "../../share_holder_master/share_holder_master.repository";

export const createShareHolderDetailBodySchema = z.object({
  shareholderName: z
    .string({
      errorMap: () => ({ message: "shareholder name must be a string" }),
    })
    .trim()
    .optional(),
  shareholderNameCertificate: z
    .string({
      errorMap: () => ({
        message: "shareholder name as per certificate must be a string",
      }),
    })
    .trim()
    .optional(),
  namePan: z
    .string({
      errorMap: () => ({
        message: "name as per pan must be a string",
      }),
    })
    .trim()
    .optional(),
  nameAadhar: z
    .string({
      errorMap: () => ({
        message: "name as per aadhar must be a string",
      }),
    })
    .trim()
    .optional(),
  nameCml: z
    .string({
      errorMap: () => ({
        message: "name as per cml must be a string",
      }),
    })
    .trim()
    .optional(),
  phone: z
    .string({
      errorMap: () => ({
        message: "phone must be a string",
      }),
    })
    .trim()
    .optional(),
  email: z
    .string({
      errorMap: () => ({
        message: "email must be a string",
      }),
    })
    .trim()
    .optional(),
  aadhar: z
    .string({
      errorMap: () => ({
        message: "aadhar must be a string",
      }),
    })
    .trim()
    .optional(),
  pan: z
    .string({
      errorMap: () => ({
        message: "pan must be a string",
      }),
    })
    .trim()
    .optional(),
  dob: z
    .string({
      errorMap: () => ({
        message: "dob must be a string",
      }),
    })
    .trim()
    .optional(),
  age: z
    .string({
      errorMap: () => ({
        message: "age must be a string",
      }),
    })
    .trim()
    .optional(),
  nationality: z
    .string({
      errorMap: () => ({
        message: "nationality must be a string",
      }),
    })
    .trim()
    .optional(),
  placeOfBirth: z
    .string({
      errorMap: () => ({
        message: "place of birth must be a string",
      }),
    })
    .trim()
    .optional(),
  city: z
    .string({
      errorMap: () => ({
        message: "city must be a string",
      }),
    })
    .trim()
    .optional(),
  state: z
    .string({
      errorMap: () => ({
        message: "state must be a string",
      }),
    })
    .trim()
    .optional(),
  countryOfBirth: z
    .string({
      errorMap: () => ({
        message: "country of birth must be a string",
      }),
    })
    .trim()
    .optional(),
  DPID: z
    .string({
      errorMap: () => ({
        message: "DPID must be a string",
      }),
    })
    .trim()
    .optional(),
  dematAccountNo: z
    .string({
      errorMap: () => ({
        message: "demat account no must be a string",
      }),
    })
    .trim()
    .optional(),
  nameBank: z
    .string({
      errorMap: () => ({
        message: "name as per bank must be a string",
      }),
    })
    .trim()
    .optional(),
  bankName: z
    .string({
      errorMap: () => ({
        message: "bank name must be a string",
      }),
    })
    .trim()
    .optional(),
  bankAddress: z
    .string({
      errorMap: () => ({
        message: "bank address must be a string",
      }),
    })
    .trim()
    .optional(),
  bankEmail: z
    .string({
      errorMap: () => ({
        message: "bank email must be a string",
      }),
    })
    .trim()
    .optional(),
  bankPhone: z
    .string({
      errorMap: () => ({
        message: "bank phone must be a string",
      }),
    })
    .trim()
    .optional(),
  bankMICR: z
    .string({
      errorMap: () => ({
        message: "bank MICR must be a string",
      }),
    })
    .trim()
    .optional(),
  bankIFS: z
    .string({
      errorMap: () => ({
        message: "bank IFS must be a string",
      }),
    })
    .trim()
    .optional(),
  bankAccountNo: z
    .string({
      errorMap: () => ({
        message: "bank account no must be a string",
      }),
    })
    .trim()
    .optional(),
  bankAccountType: z
    .string({
      errorMap: () => ({
        message: "bank account type must be a string",
      }),
    })
    .trim()
    .optional(),
  addressBank: z
    .string({
      errorMap: () => ({
        message: "address as per bank must be a string",
      }),
    })
    .trim()
    .optional(),
  emailBank: z
    .string({
      errorMap: () => ({
        message: "email as per bank must be a string",
      }),
    })
    .trim()
    .optional(),
  phoneBank: z
    .string({
      errorMap: () => ({
        message: "phone as per bank must be a string",
      }),
    })
    .trim()
    .optional(),
  pincodeBank: z
    .string({
      errorMap: () => ({
        message: "pincode as per bank must be a string",
      }),
    })
    .trim()
    .optional(),
});

export const shareHolderMasterIdSchema = z
  .object({
    shareHolderMasterId: z
      .number({
        errorMap: () => ({ message: "project ID must be a number" }),
      })
      .superRefine(async (shareHolderMasterId, ctx) => {
        const project = await getById(shareHolderMasterId);
        if (!project) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid share holder master Id",
            path: ["shareHolderMasterId"],
          });
          return false;
        }
      }),
  })
  .required();
