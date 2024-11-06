// import { z } from "zod";
// import { getById } from "../../share_holder_master/share_holder_master.repository";
// import { MultipartFile } from "../../../@types/multipart_file.type";

// const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
// const ACCEPTED_FILE_TYPES = [
//   "image/jpeg",
//   "image/png",
//   "image/jpg",
//   "image/webp",
// ];

// export const createLegalHeirDetailBodySchema = z.object({
//   isDeceased: z
//     .enum(["Yes", "No"], {
//       errorMap: () => ({
//         message: "is deceased must be one of [Yes, No]",
//       }),
//     })
//     .optional(),
//   shareholderNameDeath: z
//     .string({
//       errorMap: () => ({
//         message: "shareholder name as per death certificate must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   dod: z
//     .string({
//       errorMap: () => ({
//         message: "date of death must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   isTestate: z
//     .enum(["Yes", "No"], {
//       errorMap: () => ({
//         message: "is testate must be one of [Yes, No]",
//       }),
//     })
//     .optional(),
//   proofOfSucession: z
//     .enum(["Yes", "No"], {
//       errorMap: () => ({
//         message: "proof of sucession must be one of [Yes, No]",
//       }),
//     })
//     .optional(),
//   dateOfDocument: z
//     .string({
//       errorMap: () => ({
//         message: "date of document must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   isMinor: z
//     .enum(["Yes", "No"], {
//       errorMap: () => ({
//         message: "is minor must be one of [Yes, No]",
//       }),
//     })
//     .optional(),
//   dobMinor: z
//     .string({
//       errorMap: () => ({
//         message: "date of birth of minor must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   guardianName: z
//     .string({
//       errorMap: () => ({
//         message: "guardian name must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   guardianRelationship: z
//     .string({
//       errorMap: () => ({
//         message: "guardian relationship must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   guardianPan: z
//     .string({
//       errorMap: () => ({
//         message: "guardian pan must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   deceasedRelationship: z
//     .string({
//       errorMap: () => ({
//         message: "deceased relationship must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   taxStatus: z
//     .string({
//       errorMap: () => ({
//         message: "tax status must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   selectClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "select claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   statusClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "status claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   percentageClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "percentage claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   occupationClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "occupation claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   politicalExposureClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "political exposure claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   annualIncomeClaimant: z
//     .string({
//       errorMap: () => ({
//         message: "annual income claimant must be a string",
//       }),
//     })
//     .trim()
//     .optional(),
//   document: z
//     .any()
//     .refine((document) => {
//       if (document) {
//         return ACCEPTED_FILE_TYPES.includes(document.mimetype);
//       }
//       return true;
//     }, "Invalid photo file type")
//     .refine(
//       (document) =>
//         document ? document.size <= MAX_UPLOAD_SIZE : true,
//       "File size must be less than 3MB"
//     )
//     .transform((document) =>
//       document ? (document as MultipartFile) : undefined
//     ),
// });

// export const shareHolderMasterIdSchema = z
//   .object({
//     shareHolderMasterId: z
//       .number({
//         errorMap: () => ({ message: "project ID must be a number" }),
//       })
//       .superRefine(async (shareHolderMasterId, ctx) => {
//         const project = await getById(shareHolderMasterId);
//         if (!project) {
//           ctx.addIssue({
//             code: "custom",
//             message: "Invalid share holder master Id",
//             path: ["shareHolderMasterId"],
//           });
//           return false;
//         }
//       }),
//   })
//   .required();
