import { z } from "zod";
import { getById } from "../share_holder_detail.repository";
import { MultipartFile } from "../../../@types/multipart_file.type";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

export const updateShareHolderDetailBodySchema = z.object({
  shareholderName: z
    .string({
      errorMap: () => ({ message: "shareholder name must be a string" }),
    })
    .trim()
    .optional(),
  shareholderNamePan: z
    .string({
      errorMap: () => ({
        message: "shareholder name as per pan must be a string",
      }),
    })
    .trim()
    .optional(),
  shareholderNameAadhar: z
    .string({
      errorMap: () => ({
        message: "shareholder name as per aadhar must be a string",
      }),
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
  shareholderNameCml: z
    .string({
      errorMap: () => ({
        message: "shareholder name as per cml must be a string",
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
  isDeceased: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is deceased must be one of [Yes, No]",
      }),
    })
    .optional(),
  shareholderNameDeath: z
    .string({
      errorMap: () => ({
        message: "shareholder name as per death certificate must be a string",
      }),
    })
    .trim()
    .optional(),
  dod: z
    .string({
      errorMap: () => ({
        message: "date of death must be a string",
      }),
    })
    .trim()
    .optional(),
  isTestate: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is testate must be one of [Yes, No]",
      }),
    })
    .optional(),
  proofOfSucession: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "proof of sucession must be one of [Yes, No]",
      }),
    })
    .optional(),
  dateOfDocument: z
    .string({
      errorMap: () => ({
        message: "date of document must be a string",
      }),
    })
    .trim()
    .optional(),
  isMinor: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is minor must be one of [Yes, No]",
      }),
    })
    .optional(),
  dobMinor: z
    .string({
      errorMap: () => ({
        message: "date of birth of minor must be a string",
      }),
    })
    .trim()
    .optional(),
  guardianName: z
    .string({
      errorMap: () => ({
        message: "guardian name must be a string",
      }),
    })
    .trim()
    .optional(),
  guardianRelationship: z
    .string({
      errorMap: () => ({
        message: "guardian relationship must be a string",
      }),
    })
    .trim()
    .optional(),
  guardianPan: z
    .string({
      errorMap: () => ({
        message: "guardian pan must be a string",
      }),
    })
    .trim()
    .optional(),
  deceasedRelationship: z
    .string({
      errorMap: () => ({
        message: "deceased relationship must be a string",
      }),
    })
    .trim()
    .optional(),
  taxStatus: z
    .string({
      errorMap: () => ({
        message: "tax status must be a string",
      }),
    })
    .trim()
    .optional(),
  selectClaimant: z
    .string({
      errorMap: () => ({
        message: "select claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  statusClaimant: z
    .string({
      errorMap: () => ({
        message: "status claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  percentageClaimant: z
    .string({
      errorMap: () => ({
        message: "percentage claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  occupationClaimant: z
    .string({
      errorMap: () => ({
        message: "occupation claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  politicalExposureClaimant: z
    .string({
      errorMap: () => ({
        message: "political exposure claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  annualIncomeClaimant: z
    .string({
      errorMap: () => ({
        message: "annual income claimant must be a string",
      }),
    })
    .trim()
    .optional(),
  document: z
    .any()
    .refine((document) => {
      if (document) {
        return ACCEPTED_FILE_TYPES.includes(document.mimetype);
      }
      return true;
    }, "Invalid photo file type")
    .refine(
      (document) => (document ? document.size <= MAX_UPLOAD_SIZE : true),
      "File size must be less than 3MB"
    )
    .transform((document) =>
      document ? (document as MultipartFile) : undefined
    ),
});

export const updateShareHolderDetailUniqueSchema = z.object({
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
