import {
  count,
  createCase,
  getById,
  getInfoById,
  paginate,
  remove,
  removeMultiple,
  updateCase,
} from "./case.repository";
import { NotFoundError } from "../../utils/exceptions";
import {
  CaseRepoCreateType,
  CaseType,
  CaseRepoUpdateType,
} from "../../@types/case.type";
import { getPaginationKeys, getPaginationParams } from "../../utils/pagination";
import { PaginationType } from "../../@types/pagination.type";
import { GetIdParam, GetIdsBody } from "../../common/schemas/id_param.schema";
import { GetPaginationQuery } from "../../common/schemas/pagination_query.schema";
import { MultipartFile } from "../../@types/multipart_file.type";
import { deleteImage, saveImage } from "../../utils/file";
import { prisma } from "../../db";
import { FolioType } from "../../@types/folio.type";
import { ShareHolderDetailType } from "../../@types/share_holder_detail.type";

// import fs from "fs";
// import path from "path";
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { prisma } from "../../db";
// import AdmZip from "adm-zip";

/**
 * Create a new shareHolderMaster with the provided shareHolderMaster information.
 *
 * @param {CaseRepoCreateType} shareHolderMaster - the shareHolderMaster information
 * @return {Promise<CaseType>} a promise that resolves with the created shareHolderMaster data
 */
export async function create(
  data: Omit<CaseRepoCreateType, "shareHolderMasterID"> & {
    document?: MultipartFile | null | undefined;
  },
  shareCertificateID: number
): Promise<CaseType | null> {
 let saveDocumentFile: string | null = null;
 if (data.document) {
   saveDocumentFile = await saveImage(data.document);
 }
  const caseData = await createCase({
    ...data,
    document: saveDocumentFile,
    shareCertificateID,
  });

  return await findInfoById({ id: caseData!.id });
}

/**
 * Update CaseType information.
 *
 * @param {CreateCaseBody} CaseType - the CaseType information to be updated
 * @param {GetIdParam} param - the parameter used to identify the CaseType to be updated
 * @return {Promise<CaseType>} the updated CaseType information
 */
export async function update(
  data: CaseRepoUpdateType & {
    document?: MultipartFile | null | undefined;
  },
  param: GetIdParam
): Promise<CaseType | null> {
 const existingCase = await getById(param.id);
 let saveDocumentFile: string | null | undefined = null;
 if (data.document) {
   saveDocumentFile = await saveImage(data.document);
   existingCase?.document && deleteImage(existingCase.document);
 } else {
   saveDocumentFile = existingCase?.document;
 }
  const caseData = await updateCase({ ...data, document: saveDocumentFile }, param.id);
  return await findInfoById({ id: caseData!.id });
}

/**
 * Find a shareHolderMaster by ID.
 *
 * @param {GetIdParam} params - the parameters for finding the shareHolderMaster
 * @return {Promise<CaseType>} the shareHolderMaster found by ID
 */
export async function findById(
  params: GetIdParam
): Promise<CaseType> {
  const { id } = params;

  const shareHolderMaster = await getById(id);
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }
  return shareHolderMaster;
}

export async function findInfoById(
  params: GetIdParam
): Promise<
  CaseType & {
    foliosSet: FolioType[];
    clamaints: ShareHolderDetailType[];
    order: ShareHolderDetailType[];
  }
> {
  const { id } = params;
  let foliosSet: FolioType[] = [];
  let clamaints: ShareHolderDetailType[] = [];
  let order: ShareHolderDetailType[] = [];

  const shareHolderMaster = await getInfoById(id);
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }
  if (shareHolderMaster.folios && shareHolderMaster.folios.split("_").length > 0) {
    const inFolios = shareHolderMaster.folios
      .split("_")
      .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
      .filter((folio) => folio !== undefined) as number[];
      if(inFolios.length>0){
        foliosSet = await prisma.folio.findMany({
          where: {
            id: {
              in: inFolios,
            },
          },
        });
      }
  }
  if (shareHolderMaster.selectClaimant && shareHolderMaster.selectClaimant.split("_").length > 0) {
    const inClaimants = shareHolderMaster.selectClaimant
      ?.split("_")
      .map((claimant) =>
        isNaN(Number(claimant)) ? undefined : Number(claimant)
      )
      .filter((claimant) => claimant !== undefined) as number[];
    if(inClaimants.length>0){
      clamaints = await prisma.shareHolderDetail.findMany({
        where: {
          id: {
            in: inClaimants,
          },
        },
      });
    }
  }
  if (shareHolderMaster.transpositionOrder && shareHolderMaster.transpositionOrder.split("_").length > 0) {
    const inOrder = shareHolderMaster.transpositionOrder
      ?.split("_")
      .map((order) => (isNaN(Number(order)) ? undefined : Number(order)))
      .filter((order) => order !== undefined) as number[];
    if(inOrder.length>0){
      order = await prisma.shareHolderDetail.findMany({
        where: {
          id: {
            in: inOrder,
          },
        },
      });
    }
  }
  return {
    ...shareHolderMaster,
    foliosSet: foliosSet,
    clamaints,
    order,
  };
}

/**
 * Find shareHolderMaster by pagination.
 *
 * @param {GetPaginationQuery} querystring - the parameters for finding the shareHolderMaster
 * @return {Promise<{shareHolderMaster:CaseType[]} & PaginationType>} the shareHolderMaster found by ID
 */
export async function list(
  querystring: GetPaginationQuery,
  shareCertificateID: number
): Promise<
  {
    shareHolderMaster: (CaseType &
      {
        foliosSet: FolioType[];
        clamaints: ShareHolderDetailType[];
        order: ShareHolderDetailType[];
      })[];
  } & PaginationType
> {
  const { limit, offset } = getPaginationParams({
    page: querystring.page,
    size: querystring.limit,
  });
  const shareHolderMasterData = await paginate(
    limit,
    offset,
    shareCertificateID,
    querystring.search
  );
  const shareHolderMasterCount = await count(
    shareCertificateID,
    querystring.search
  );

  const shareHolderMasters = await Promise.all(
    shareHolderMasterData.map(async (shareHolderMaster) => {
      let foliosSet: FolioType[] = [];
      let clamaints: ShareHolderDetailType[] = [];
      let order: ShareHolderDetailType[] = [];
      if (
        shareHolderMaster.folios &&
        shareHolderMaster.folios.split("_").length > 0
      ) {
        const inFolios = shareHolderMaster.folios
          .split("_")
          .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
          .filter((folio) => folio !== undefined) as number[];
        if (inFolios.length > 0) {
          foliosSet = await prisma.folio.findMany({
            where: {
              id: {
                in: inFolios,
              },
            },
          });
        }
      }
      if (
        shareHolderMaster.selectClaimant &&
        shareHolderMaster.selectClaimant.split("_").length > 0
      ) {
        const inClaimants = shareHolderMaster.selectClaimant
          ?.split("_")
          .map((claimant) =>
            isNaN(Number(claimant)) ? undefined : Number(claimant)
          )
          .filter((claimant) => claimant !== undefined) as number[];
        if (inClaimants.length > 0) {
          clamaints = await prisma.shareHolderDetail.findMany({
            where: {
              id: {
                in: inClaimants,
              },
            },
          });
        }
      }
      if (
        shareHolderMaster.transpositionOrder &&
        shareHolderMaster.transpositionOrder.split("_").length > 0
      ) {
        const inOrder = shareHolderMaster.transpositionOrder
          ?.split("_")
          .map((order) => (isNaN(Number(order)) ? undefined : Number(order)))
          .filter((order) => order !== undefined) as number[];
        if (inOrder.length > 0) {
          order = await prisma.shareHolderDetail.findMany({
            where: {
              id: {
                in: inOrder,
              },
            },
          });
        }
      }
      return {
        ...shareHolderMaster,
        foliosSet: foliosSet,
        clamaints,
        order,
      };
    })
  );

  return {
    shareHolderMaster: shareHolderMasters,
    ...getPaginationKeys({
      count: shareHolderMasterCount,
      page: querystring.page,
      size: querystring.limit,
    }),
  };
}

/**
 * Destroys a shareHolderMaster based on the provided parameters.
 *
 * @param {GetIdParam} params - the parameters for destroying the shareHolderMaster
 * @return {Promise<CaseType>} the destroyed shareHolderMaster
 */
export async function destroy(
  params: GetIdParam
): Promise<CaseType | null> {
  const { id } = params;
  return await remove(id);
}

export async function destroyMultiple(body: GetIdsBody): Promise<void> {
  const { id } = body;

  await removeMultiple(id);
}


// export async function generateDoc(
//   params: GetIdParam
// ): Promise<string> {
//   const { id } = params;

//   const folderName = "doc_" + id + "_" + Date.now();

//   const folderPath = path.resolve(
//     __dirname,
//     "../../../static/word_output/" + folderName
//   );
//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath);
//   }

//   const shareHolderMaster = await prisma.shareHolderMaster.findUnique({
//     where: {
//       id,
//     },
//     select: {
//       caseType: true,
//       noOfShareHolder: true,
//       noOfLegalHeir: true,
//       transpositionOrder: true,
//       project: {
//         select: {
//           name: true,
//           shareCertificateMasters: {
//             select: {
//               id: true,
//               instrumentType: true,
//               companyMaster: {
//                 select: {
//                   CIN: true,
//                   registeredOffice: true,
//                   city: true,
//                   state: true,
//                   pincode: true,
//                   nameChangeMasters: {
//                     select: {
//                       currentName: true,
//                     },
//                     orderBy: {
//                       id: "desc",
//                     },
//                   },
//                   registrarMasterBranch: true,
//                 },
//               },
//               folios: true,
//             },
//           },
//         },
//       },
//       shareHolderDetails: true,
//       legalHeirDetails: true,
//     },
//   });

//   if (!shareHolderMaster) {
//     throw new NotFoundError();
//   }

//   const mainData: any[] = [];
//   shareHolderMaster.project?.shareCertificateMasters.forEach(
//     async (shareCertificateMaster) => {
//       const payload: any = {};
//       payload["Case"] = shareHolderMaster.caseType;
//       payload["Folios"] = shareCertificateMaster.folios
//         .map((folio) => folio.Folio)
//         .join(", ");
//       payload["totalFaceValue"] = shareCertificateMaster.folios.reduce(
//         (acc, folio) => acc + (folio.faceValue || 0),
//         0
//       );
//       payload["totalNoOfShares"] = shareCertificateMaster.folios.reduce(
//         (acc, folio) => acc + (Number(folio.noOfShares) || 0),
//         0
//       );
//       payload["distinctiveNos"] = shareCertificateMaster.folios
//         .map((folio) => folio.distinctiveNosTo + "-" + folio.distinctiveNosFrom)
//         .join(", ");
//       payload["Folio"] = shareCertificateMaster.folios;
//       payload["instrumentType"] = shareCertificateMaster.instrumentType;
//       payload["companyCIN"] = shareCertificateMaster.companyMaster?.CIN || null;
//       payload["companyCity"] =
//         shareCertificateMaster.companyMaster?.city || null;
//       payload["companyState"] =
//         shareCertificateMaster.companyMaster?.state || null;
//       payload["companyPincode"] =
//         shareCertificateMaster.companyMaster?.pincode || null;
//       payload["companyName"] =
//         shareCertificateMaster.companyMaster?.nameChangeMasters[0]
//           .currentName || null;
//       shareHolderMaster.shareHolderDetails.forEach(
//         (shareHolderDetail, index) => {
//           payload["hasShareholder_" + (index + 1)] = true;
//           payload["namePan_" + (index + 1)] = shareHolderDetail.namePan;
//           payload["DPID_" + (index + 1)] = shareHolderDetail.DPID;
//           payload["aadhar_" + (index + 1)] = shareHolderDetail.aadhar;
//           payload["addressBank_" + (index + 1)] = shareHolderDetail.addressBank;
//           payload["age_" + (index + 1)] = shareHolderDetail.age;
//           payload["bankAccountNo_" + (index + 1)] =
//             shareHolderDetail.bankAccountNo;
//           payload["bankAccountType_" + (index + 1)] =
//             shareHolderDetail.bankAccountType;
//           payload["bankAddress_" + (index + 1)] = shareHolderDetail.bankAddress;
//           payload["bankEmail_" + (index + 1)] = shareHolderDetail.bankEmail;
//           payload["bankIFS_" + (index + 1)] = shareHolderDetail.bankIFS;
//           payload["bankMICR_" + (index + 1)] = shareHolderDetail.bankMICR;
//           payload["bankName_" + (index + 1)] = shareHolderDetail.bankName;
//           payload["bankPhone_" + (index + 1)] = shareHolderDetail.bankPhone;
//           payload["city_" + (index + 1)] = shareHolderDetail.city;
//           payload["countryOfBirth_" + (index + 1)] =
//             shareHolderDetail.countryOfBirth;
//           payload["dematAccountNo_" + (index + 1)] =
//             shareHolderDetail.dematAccountNo;
//           payload["dob_" + (index + 1)] = shareHolderDetail.dob;
//           payload["email_" + (index + 1)] = shareHolderDetail.email;
//           payload["emailBank_" + (index + 1)] = shareHolderDetail.emailBank;
//           payload["nameAadhar_" + (index + 1)] = shareHolderDetail.nameAadhar;
//           payload["nameBank_" + (index + 1)] = shareHolderDetail.nameBank;
//           payload["nameCml_" + (index + 1)] = shareHolderDetail.nameCml;
//           payload["namePan_" + (index + 1)] = shareHolderDetail.namePan;
//           payload["nationality_" + (index + 1)] = shareHolderDetail.nationality;
//           payload["pan_" + (index + 1)] = shareHolderDetail.pan;
//           payload["phone_" + (index + 1)] = shareHolderDetail.phone;
//           payload["phoneBank_" + (index + 1)] = shareHolderDetail.phoneBank;
//           payload["pincodeBank_" + (index + 1)] = shareHolderDetail.pincodeBank;
//           payload["placeOfBirth_" + (index + 1)] =
//             shareHolderDetail.placeOfBirth;
//           payload["shareholderName_" + (index + 1)] =
//             shareHolderDetail.shareholderName;
//           payload["shareholderNameCertificate_" + (index + 1)] =
//             shareHolderDetail.shareholderNameCertificate;
//           payload["state_" + (index + 1)] = shareHolderDetail.state;
//         }
//       );
//       shareHolderMaster.legalHeirDetails.forEach((legalHeirDetail, index) => {
//         payload["hasLegalHeir_" + (index + 1)] = true;
//         payload["annualIncomeClaimant_" + (index + 1)] =
//           legalHeirDetail.annualIncomeClaimant;
//         payload["dateOfDocument_" + (index + 1)] =
//           legalHeirDetail.dateOfDocument;
//         payload["deceasedRelationship_" + (index + 1)] =
//           legalHeirDetail.deceasedRelationship;
//         payload["dobMinor_" + (index + 1)] = legalHeirDetail.dobMinor;
//         payload["dod_" + (index + 1)] = legalHeirDetail.dod;
//         payload["guardianName_" + (index + 1)] = legalHeirDetail.guardianName;
//         payload["guardianPan_" + (index + 1)] = legalHeirDetail.guardianPan;
//         payload["guardianRelationship_" + (index + 1)] =
//           legalHeirDetail.guardianRelationship;
//         payload["isDeceased_" + (index + 1)] = legalHeirDetail.isDeceased === "Yes" ? true : false;
//         payload["isMinor_" + (index + 1)] =
//           legalHeirDetail.isMinor === "Yes" ? true : false;
//         payload["isTestate_" + (index + 1)] =
//           legalHeirDetail.isTestate === "Yes" ? true : false;
//         payload["occupationClaimant_" + (index + 1)] =
//           legalHeirDetail.occupationClaimant;
//         payload["percentageClaimant_" + (index + 1)] =
//           legalHeirDetail.percentageClaimant;
//         payload["politicalExposureClaimant_" + (index + 1)] =
//           legalHeirDetail.politicalExposureClaimant;
//         payload["proofOfSucession_" + (index + 1)] =
//           legalHeirDetail.proofOfSucession;
//         payload["selectClaimant_" + (index + 1)] =
//           legalHeirDetail.selectClaimant;
//         payload["shareholderNameDeath_" + (index + 1)] =
//           legalHeirDetail.shareholderNameDeath;
//         payload["statusClaimant_" + (index + 1)] =
//           legalHeirDetail.statusClaimant;
//         payload["taxStatus_" + (index + 1)] = legalHeirDetail.taxStatus;
//       });
//       mainData.push(payload);
//     }
//   );

//   const ISR1 = {
//     name: "ISR1",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/ISR1.docx"
//     )
//   }

//   const ISR2 = {
//     name: "ISR2",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/ISR2.docx"
//     )
//   }

//   const ISR3 = {
//     name: "ISR3",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/ISR3.docx"
//     )
//   }

//   const ISR4 = {
//     name: "ISR4",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/ISR4.docx"
//     )
//   }

//   const ISR5 = {
//     name: "ISR5",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/ISR5.docx"
//     )
//   }

//   // const Affidavit = {
//   //   name: "Affidavit",
//   //   path: path.resolve(
//   //     __dirname,
//   //     "../../../static/word_template/Affidavit.docx"
//   //   )
//   // }

//   const Annexure_D = {
//     name: "Annexure_D",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Annexure_D.docx"
//     )
//   }

//   const Annexure_E = {
//     name: "Annexure_E",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Annexure_E.docx"
//     )
//   }

//   const Annexure_F = {
//     name: "Annexure_F",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Annexure_F.docx"
//     )
//   }

//   const Deletion = {
//     name: "Deletion",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Deletion.docx"
//     )
//   }

//   const Form_A_Duplicate = {
//     name: "Form_A_Duplicate",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Form_A_Duplicate.docx"
//     )
//   }

//   const Form_B_Duplicate = {
//     name: "Form_B_Duplicate",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Form_B_Duplicate.docx"
//     )
//   }

//   const form_no_sh_13 = {
//     name: "form_no_sh_13",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/form_no_sh_13.docx"
//     )
//   }

//   const Form_SH_14 = {
//     name: "Form_SH_14",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Form_SH_14.docx"
//     )
//   }

//   const caseType = {
//     Claim: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13],
//     ClaimTransposition: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13],
//     ClaimIssueDuplicate: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//     ],
//     Transmission: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       ISR5,
//       form_no_sh_13,
//       Form_SH_14,
//       Annexure_D,
//       Annexure_E,
//       Annexure_F,
//     ],
//     TransmissionIssueDuplicate: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       form_no_sh_13,
//       Form_SH_14,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//       Annexure_D,
//       Annexure_E,
//       Annexure_F,
//     ],
//     TransmissionIssueDuplicateTransposition: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       ISR5,
//       form_no_sh_13,
//       Form_SH_14,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//       Annexure_D,
//       Annexure_E,
//       Annexure_F,
//     ],
//     Deletion: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13, Form_SH_14, Deletion],
//     DeletionIssueDuplicate: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       form_no_sh_13,
//       Form_SH_14,
//       Deletion,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//     ],
//     DeletionIssueDuplicateTransposition: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       form_no_sh_13,
//       Form_SH_14,
//       Deletion,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//       Annexure_D,
//       Annexure_E,
//       Annexure_F,
//     ],
//   };

//   mainData.forEach((item, index) => {
//     const data = {
//       ...item,
//     };

//     caseType[item.Case].forEach((casee) => {
//       // Load the docx file as a binary
//       const wordTemplate = path.resolve(
//         __dirname,
//         "../../../static/word_template/" + casee.name + ".docx"
//       );
//       const content = fs.readFileSync(wordTemplate, "binary");

//       // Create a zip instance of the file
//       const zip = new PizZip(content);

//       // Create a Docxtemplater instance
//       const doc = new Docxtemplater(zip, {
//         paragraphLoop: true,
//         linebreaks: true,
//       });

//       // Render the document by filling in the data
//       doc.render(data);

//       // Get the generated document as a buffer
//       const buf = doc.getZip().generate({ type: "nodebuffer" });

//       // Write the buffer to a file (output.docx)
//       const wordOutput = path.resolve(
//         __dirname,
//         folderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//       );
//       fs.writeFileSync(wordOutput, buf);

//       console.log("Document created successfully!");
//     });

//   });


//   const folderZip = new AdmZip();
//   folderZip.addLocalFolder(folderPath);
//   await folderZip.writeZipPromise(
//     path.resolve(
//       __dirname,
//       "../../../static/word_output/" + folderName + ".zip"
//     )
//   );
//   fs.rm(folderPath, { recursive: true }, (err) => {});

//   return path.resolve(__dirname, "../../../static/word_output/" + folderName + ".zip");;
// }