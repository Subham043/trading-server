import { z } from "zod";
import { getById as getByProjectId } from "../../project/project.repository";

export const createNominationBodySchema = z.object({
  fatherName: z
    .string({
      errorMap: () => ({
        message: "Father/Mother/Spouse Name must be a string",
      }),
    })
    .trim(),
  fullName: z
    .string({
      errorMap: () => ({ message: "Full Name must be a string" }),
    })
    .trim(),
  occupation: z
    .string({
      errorMap: () => ({ message: "Occupation must be a string" }),
    })
    .trim()
    .optional(),
  nationality: z
    .string({
      errorMap: () => ({ message: "Nationality must be a string" }),
    })
    .trim()
    .optional(),
  email: z
    .string({
      errorMap: () => ({ message: "Email must be a string" }),
    })
    .trim()
    .optional(),
  relationship: z
    .string({
      errorMap: () => ({
        message: "Relationship with the security holder must be a string",
      }),
    })
    .trim()
    .optional(),
  mobile: z
    .string({
      errorMap: () => ({ message: "Mobile must be a string" }),
    })
    .trim()
    .optional(),
  pan: z
    .string({
      errorMap: () => ({ message: "Pan must be a string" }),
    })
    .trim()
    .optional(),
  address: z
    .string({
      errorMap: () => ({ message: "Address must be a string" }),
    })
    .trim()
    .optional(),
  isMinor: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is Minor must be one of [Yes, No]",
      }),
    })
    .optional(),
  dobMinor: z
    .string({
      errorMap: () => ({
        message: "date of birth must be a string",
      }),
    })
    .trim()
    .optional(),
  dateMajority: z
    .string({
      errorMap: () => ({
        message: "Date of attaining Majority must be a string",
      }),
    })
    .trim()
    .optional(),
  gurdianName: z
    .string({
      errorMap: () => ({ message: "Gurdian Name must be a string" }),
    })
    .trim()
    .optional(),
  gurdianAddress: z
    .string({
      errorMap: () => ({ message: "Gurdian Address must be a string" }),
    })
    .trim()
    .optional(),
  isDeceased: z
    .enum(["Yes", "No"], {
      errorMap: () => ({
        message: "is Deceased must be one of [Yes, No]",
      }),
    })
    .optional(),
  deceasedName: z
    .string({
      errorMap: () => ({ message: "Name must be a string" }),
    })
    .trim()
    .optional(),
  dobDeceased: z
    .string({
      errorMap: () => ({ message: "Date of Birth must be a string" }),
    })
    .trim()
    .optional(),
  deceasedFatherName: z
    .string({
      errorMap: () => ({
        message: "Father/Mother/Spouse Name must be a string",
      }),
    })
    .trim()
    .optional(),
  deceasedOccupation: z
    .string({
      errorMap: () => ({ message: "Occupation must be a string" }),
    })
    .trim()
    .optional(),
  deceasedNationality: z
    .string({
      errorMap: () => ({ message: "Nationality must be a string" }),
    })
    .trim()
    .optional(),
  deceasedEmail: z
    .string({
      errorMap: () => ({ message: "Email must be a string" }),
    })
    .trim()
    .optional(),
  deceasedRelationship: z
    .string({
      errorMap: () => ({
        message: "Relationship with security holder must be a string",
      }),
    })
    .trim()
    .optional(),
  deceasedRelationshipMinor: z
    .string({
      errorMap: () => ({
        message: "Relationship with the minor nominee must be a string",
      }),
    })
    .trim()
    .optional(),
});

export const projectIdSchema = z
  .object({
    projectId: z
      .number({
        errorMap: () => ({ message: "project ID must be a number" }),
      })
      .superRefine(async (projectId, ctx) => {
        const project = await getByProjectId(projectId);
        if (!project) {
          ctx.addIssue({
            code: "custom",
            message: "Invalid project master Id",
            path: ["projectId"],
          });
          return false;
        }
      }),
  })
  .required();
