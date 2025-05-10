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

import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { NameChangeMasterColumn } from "../company_master/company_master.model";
// import dayjs from "dayjs";
// import { CertificateType } from "../../@types/certificate.type";
// import { numberInWords } from "../../utils/numberInWords";
import { NominationType } from "../../@types/nomination.type";
import { LegalHeirDetailType } from "../../@types/legal_heir_detail.type";
import { generateISR1Doc } from "./docs/isr1.doc";
import { generateISR2Doc } from "./docs/isr2.doc";
import { generateISR3Doc } from "./docs/isr3.doc";
// import { generateSuretyDoc } from "./docs/surety.doc";
import { generateDeletionDoc } from "./docs/deletion.doc";
import { generateAnnexureDDoc } from "./docs/annexure_d.doc";
// import { generateAffidavitDoc } from "./docs/affidavit.doc";
// import { generateAffidavit2Doc } from "./docs/affidavit2.doc";
import { generateAnnexureEDoc } from "./docs/annexure_e.doc";
import { generateAnnexureFDoc } from "./docs/annexure_f.doc";
// import { generateFormADoc } from "./docs/form_a.doc";
// import { generateFormBDoc } from "./docs/form_b.doc";
import { generateISR4Doc } from "./docs/isr4.doc";
import { generateFormSH14Doc } from "./docs/form_sh_14.doc";
import { generateFormSH13Doc } from "./docs/form_sh_13.doc";
import { generateISR5Doc } from "./docs/isr5.doc";
import dayjs from "dayjs";
import { CertificateType } from "../../@types/certificate.type";
import { NameChangeMasterColumn } from "../name_change_master/name_change_master.model";
import { numberInWords } from "../../utils/numberInWords";
// import CaseDocGenerator from "./doc.generator";

/**
 * Create a new shareHolderMaster with the provided shareHolderMaster information.
 *
 * @param {CaseRepoCreateType} shareHolderMaster - the shareHolderMaster information
 * @return {Promise<CaseType>} a promise that resolves with the created shareHolderMaster data
 */
export async function create(
  data: Omit<CaseRepoCreateType, "shareHolderMasterID"> & {
    document?: MultipartFile | null | undefined;
    deadShareholderID?: number | null | undefined;
  },
  shareCertificateID: number
): Promise<CaseType | null> {
  let saveDocumentFile: string | null = null;
  if (data.document) {
    saveDocumentFile = await saveImage(data.document);
  }
  const { deadShareholderID, ...rest } = data;
  const caseData = await createCase({
    ...rest,
    document: saveDocumentFile,
    shareCertificateID,
    deadShareholderID: deadShareholderID  && +deadShareholderID || null,
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
  data: CaseRepoCreateType & {
    document?: MultipartFile | null;
    deadShareholderID?: number | null | undefined;
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
  const updateData = {
    ...data,
    document: saveDocumentFile,
    deadShareholderID:
      (data.deadShareholderID && +data.deadShareholderID) || null,
  };
  const caseData = await updateCase(updateData, param.id);
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

export async function findInfoById(params: GetIdParam): Promise<
  CaseType & {
    foliosSet: FolioType[];
    clamaints: LegalHeirDetailType[];
    order: ShareHolderDetailType[];
    affidavitShareholders: ShareHolderDetailType[];
    affidavitLegalHeirs: LegalHeirDetailType[];
    nominations: NominationType[];
  }
> {
  const { id } = params;
  let foliosSet: FolioType[] = [];
  let clamaints: LegalHeirDetailType[] = [];
  let affidavitShareholders: ShareHolderDetailType[] =
    [];
  let affidavitLegalHeirs: LegalHeirDetailType[] = [];
  let nominations: NominationType[] = [];
  let order: ShareHolderDetailType[] = [];

  const shareHolderMaster = await getInfoById(id);
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }
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
      clamaints = await prisma.legalHeirDetail.findMany({
        where: {
          id: {
            in: inClaimants,
          },
        },
      });
    }
  }
  if (shareHolderMaster.allowAffidavit === "Yes") {
    if (
      shareHolderMaster.selectAffidavitShareholder &&
      shareHolderMaster.selectAffidavitShareholder.split("_").length > 0
    ) {
      const inAffidavitShareholders = shareHolderMaster.selectAffidavitShareholder
        ?.split("_")
        .map((claimant) =>
          isNaN(Number(claimant)) ? undefined : Number(claimant)
        )
        .filter((claimant) => claimant !== undefined) as number[];
      if (inAffidavitShareholders.length > 0) {
        affidavitShareholders = await prisma.shareHolderDetail.findMany({
          where: {
            id: {
              in: inAffidavitShareholders,
            },
          },
        });
      }
    }
  }
  if (shareHolderMaster.allowAffidavit === "Yes") {
    if (
      shareHolderMaster.selectAffidavitLegalHeir &&
      shareHolderMaster.selectAffidavitLegalHeir.split("_").length > 0
    ) {
      const inAffidavitLegalHeirs = shareHolderMaster.selectAffidavitLegalHeir
        ?.split("_")
        .map((claimant) =>
          isNaN(Number(claimant)) ? undefined : Number(claimant)
        )
        .filter((claimant) => claimant !== undefined) as number[];
      if (inAffidavitLegalHeirs.length > 0) {
        if (shareHolderMaster.caseType.includes("Transmission")) {
          affidavitLegalHeirs = await prisma.legalHeirDetail.findMany({
            where: {
              id: {
                in: inAffidavitLegalHeirs,
              },
            },
          });
        }
      }
    }
  }
  if (
    shareHolderMaster.selectNomination &&
    shareHolderMaster.selectNomination.split("_").length > 0
  ) {
    const inNominations = shareHolderMaster.selectNomination
      ?.split("_")
      .map((claimant) =>
        isNaN(Number(claimant)) ? undefined : Number(claimant)
      )
      .filter((claimant) => claimant !== undefined) as number[];
    if (inNominations.length > 0) {
      nominations = await prisma.nomination.findMany({
        where: {
          id: {
            in: inNominations,
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
    affidavitShareholders,
    affidavitLegalHeirs,
    nominations,
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
    shareHolderMaster: (CaseType & {
      foliosSet: FolioType[];
      clamaints: LegalHeirDetailType[];
      order: ShareHolderDetailType[];
      affidavitShareholders: ShareHolderDetailType[];
      affidavitLegalHeirs: LegalHeirDetailType[];
      nominations: NominationType[];
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
      let clamaints: LegalHeirDetailType[] = [];
      let order: ShareHolderDetailType[] = [];
      let affidavitShareholders: ShareHolderDetailType[] = [];
      let affidavitLegalHeirs: LegalHeirDetailType[] = [];
      let nominations: NominationType[] = [];
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
          clamaints = await prisma.legalHeirDetail.findMany({
            where: {
              id: {
                in: inClaimants,
              },
            },
          });
        }
      }
      if (shareHolderMaster.allowAffidavit === "Yes") {
        if (
          shareHolderMaster.selectAffidavitShareholder &&
          shareHolderMaster.selectAffidavitShareholder.split("_").length > 0
        ) {
          const inAffidavitShareholders = shareHolderMaster.selectAffidavitShareholder
            ?.split("_")
            .map((claimant) =>
              isNaN(Number(claimant)) ? undefined : Number(claimant)
            )
            .filter((claimant) => claimant !== undefined) as number[];
          if (inAffidavitShareholders.length > 0) {
            affidavitShareholders = await prisma.shareHolderDetail.findMany({
              where: {
                id: {
                  in: inAffidavitShareholders,
                },
              },
            });
          }
        }
      }
      if (shareHolderMaster.allowAffidavit === "Yes") {
        if (
          shareHolderMaster.selectAffidavitLegalHeir &&
          shareHolderMaster.selectAffidavitLegalHeir.split("_").length > 0
        ) {
          const inAffidavitLegalHeirs = shareHolderMaster.selectAffidavitLegalHeir
            ?.split("_")
            .map((claimant) =>
              isNaN(Number(claimant)) ? undefined : Number(claimant)
            )
            .filter((claimant) => claimant !== undefined) as number[];
          if (inAffidavitLegalHeirs.length > 0) {
            if (shareHolderMaster.caseType.includes("Transmission")) {
              affidavitLegalHeirs = await prisma.legalHeirDetail.findMany({
                where: {
                  id: {
                    in: inAffidavitLegalHeirs,
                  },
                },
              });
            }
          }
        }
      }
      if (
        shareHolderMaster.selectNomination &&
        shareHolderMaster.selectNomination.split("_").length > 0
      ) {
        const inNominations = shareHolderMaster.selectNomination
          ?.split("_")
          .map((claimant) =>
            isNaN(Number(claimant)) ? undefined : Number(claimant)
          )
          .filter((claimant) => claimant !== undefined) as number[];
        if (inNominations.length > 0) {
          nominations = await prisma.nomination.findMany({
            where: {
              id: {
                in: inNominations,
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
        affidavitShareholders,
        affidavitLegalHeirs,
        nominations,
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

//   // const caseDocGenerator = new CaseDocGenerator({id});

//   // const doc = await caseDocGenerator.generateDoc();

//   // return doc;

//   const folderName = "doc_" + id + "_" + Date.now();

//   const folderPath = path.resolve(
//     __dirname,
//     "../../../static/word_output/" + folderName
//   );
//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath);
//   }

  
//   const shareHolderMaster = await prisma.case.findUnique({
//     where: {
//       id: Number(id),
//     },
//     include: {
//       deadShareholder: true,
//       shareCertificateMaster: {
//         include:{
//           companyMaster: {
//             include:{
//               registrarMasterBranch: {
//                 include:{
//                   registrarMaster: true
//                 }
//               },
//               nameChangeMasters: {
//                 select: NameChangeMasterColumn,
//                 orderBy: {
//                   id: "desc",
//                 },
//                 take: 1,
//               },
//             }
//           }
//         }
//       }
//     }
//   });
  
//   if (!shareHolderMaster) {
//     throw new NotFoundError();
//   }

//   let foliosSet: (FolioType & { certificate: CertificateType[] })[] = [];
//   let clamaints: LegalHeirDetailType[] = [];
//   let affidavitShareholders: ShareHolderDetailType[] = [];
//   let affidavitLegalHeirs: LegalHeirDetailType[] = [];
//   let nominations: NominationType[] = [];
//   // let order: ShareHolderDetailType[] = [];

//   if (
//     shareHolderMaster.folios &&
//     shareHolderMaster.folios.split("_").length > 0
//   ) {
//     const inFolios = shareHolderMaster.folios
//       .split("_")
//       .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
//       .filter((folio) => folio !== undefined) as number[];
//     if (inFolios.length > 0) {
//       foliosSet = await prisma.folio.findMany({
//         where: {
//           id: {
//             in: inFolios,
//           },
//         },
//         select: {
//           id: true,
//           Folio: true,
//           shareholderName1ID: true,
//           shareholderName2ID: true,
//           shareholderName3ID: true,
//           shareholderName1: true,
//           shareholderName2: true,
//           shareholderName3: true,
//           certificate: {
//             select: {
//               id: true,
//               equityType: true,
//               certificateNumber: true,
//               certificateSerialNumber: true,
//               shareholderName1Txt: true,
//               shareholderName2Txt: true,
//               shareholderName3Txt: true,
//               noOfShares: true,
//               noOfSharesWords: true,
//               dateOfAllotment: true,
//               faceValue: true,
//               distinctiveNosFrom: true,
//               distinctiveNosTo: true,
//               endorsement: true,
//               endorsementFolio: true,
//               endorsementDate: true,
//               endorsementShareholderName1ID: true,
//               endorsementShareholderName2ID: true,
//               endorsementShareholderName3ID: true,
//             },
//             orderBy: {
//               dateOfAction: "asc",
//             },
//           },
//           shareCertificateMaster: true,
//         },
//       });
//     }
//   }
//   if (
//     shareHolderMaster.selectClaimant &&
//     shareHolderMaster.selectClaimant.split("_").length > 0
//   ) {
//     const inClaimants = shareHolderMaster.selectClaimant
//       ?.split("_")
//       .map((claimant) =>
//         isNaN(Number(claimant)) ? undefined : Number(claimant)
//       )
//       .filter((claimant) => claimant !== undefined) as number[];
//     if (inClaimants.length > 0) {
//       clamaints = await prisma.legalHeirDetail.findMany({
//         where: {
//           id: {
//             in: inClaimants,
//           },
//         },
//       });
//     }
//   }
//   // if (
//   //   shareHolderMaster.transpositionOrder &&
//   //   shareHolderMaster.transpositionOrder.split("_").length > 0
//   // ) {
//   //   const inOrder = shareHolderMaster.transpositionOrder
//   //     ?.split("_")
//   //     .map((order) => (isNaN(Number(order)) ? undefined : Number(order)))
//   //     .filter((order) => order !== undefined) as number[];
//   //   if (inOrder.length > 0) {
//   //     order = await prisma.shareHolderDetail.findMany({
//   //       where: {
//   //         id: {
//   //           in: inOrder,
//   //         },
//   //       },
//   //     });
//   //   }
//   // }
//   if (shareHolderMaster.allowAffidavit === "Yes") {
//     if (
//       shareHolderMaster.selectAffidavitShareholder &&
//       shareHolderMaster.selectAffidavitShareholder.split("_").length > 0
//     ) {
//       const inAffidavitShareholders = shareHolderMaster.selectAffidavitShareholder
//         ?.split("_")
//         .map((claimant) =>
//           isNaN(Number(claimant)) ? undefined : Number(claimant)
//         )
//         .filter((claimant) => claimant !== undefined) as number[];
//       if (inAffidavitShareholders.length > 0) {
//         affidavitShareholders = await prisma.shareHolderDetail.findMany({
//           where: {
//             id: {
//               in: inAffidavitShareholders,
//             },
//           },
//         });
//       }
//     }
//   }
//   if (shareHolderMaster.allowAffidavit === "Yes") {
//     if (
//       shareHolderMaster.selectAffidavitLegalHeir &&
//       shareHolderMaster.selectAffidavitLegalHeir.split("_").length > 0
//     ) {
//       const inAffidavitLegalHeirs = shareHolderMaster.selectAffidavitLegalHeir
//         ?.split("_")
//         .map((claimant) =>
//           isNaN(Number(claimant)) ? undefined : Number(claimant)
//         )
//         .filter((claimant) => claimant !== undefined) as number[];
//       if (inAffidavitLegalHeirs.length > 0) {
//         if (shareHolderMaster.caseType.includes("Transmission")) {
//           affidavitLegalHeirs = await prisma.legalHeirDetail.findMany({
//             where: {
//               id: {
//                 in: inAffidavitLegalHeirs,
//               },
//             },
//           });
//         }
//       }
//     }
//   }
//   if (
//     shareHolderMaster.selectNomination &&
//     shareHolderMaster.selectNomination.split("_").length > 0
//   ) {
//     const inNominations = shareHolderMaster.selectNomination
//       ?.split("_")
//       .map((claimant) =>
//         isNaN(Number(claimant)) ? undefined : Number(claimant)
//       )
//       .filter((claimant) => claimant !== undefined) as number[];
//     if (inNominations.length > 0) {
//       nominations = await prisma.nomination.findMany({
//         where: {
//           id: {
//             in: inNominations,
//           },
//         },
//       });
//     }
//   }

//   const legalHeirDetails = await prisma.legalHeirDetail.findMany({
//     where: {
//       projectID: shareHolderMaster.shareCertificateMaster?.projectID
//     },
//   })

//   const mainData: any[] = [];
//   foliosSet.forEach((folio) => {
//     const payload: any = {};
//     payload["spell"] = ['a', 'b', 'c', 'd'];
//     payload["Case"] = shareHolderMaster.caseType;
//     payload["isTransmissionCase"] = shareHolderMaster.caseType.includes("Transmission") ? true : false
//     payload["isNotTransmissionCase"] = shareHolderMaster.caseType.includes("Transmission") === false ? true : false
//     payload["allowAffidavit"] =
//       shareHolderMaster.allowAffidavit === "Yes" ? true : false;
//     payload["affidavits"] = affidavitShareholders.map((item, i) => ({
//       ...item,
//       dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
//       accountOpeningDate: item.accountOpeningDate
//         ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
//         : "",
//       index: i + 1,
//     }));
//     payload["affidavitLegalHeirs"] = affidavitLegalHeirs.map((item, i) => ({
//       ...item,
//       dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
//       accountOpeningDate: item.accountOpeningDate
//         ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
//         : "",
//       index: i + 1,
//     }));
//     payload["nominations"] = nominations.map((item, i) => ({
//       ...item,
//       dobMinor: item.dobMinor ? dayjs(item.dobMinor).format("DD-MM-YYYY") : "",
//       dobDeceased: item.dobDeceased
//         ? dayjs(item.dobDeceased).format("DD-MM-YYYY")
//         : "",
//       dateMajority: item.dateMajority
//         ? dayjs(item.dateMajority).format("DD-MM-YYYY")
//         : "",
//       isMinor: item.isMinor === "Yes" ? true : false,
//       isDeceased: item.isDeceased === "Yes" ? true : false,
//       index: i + 1,
//     }));
//     payload["isDeceased"] = shareHolderMaster.isDeceased==="Yes" ? true : false;
//     payload["deadShareholder"] = shareHolderMaster.deadShareholder;
//     payload["shareholderNameDeath"] = shareHolderMaster.shareholderNameDeath;
//     // payload["deceasedRelationship"] = shareHolderMaster.deceasedRelationship;
//     payload["placeOfDeath"] = shareHolderMaster.placeOfDeath;
//     payload["dod"] = shareHolderMaster.dod
//       ? dayjs(shareHolderMaster.dod).format("DD-MM-YYYY")
//       : "";
//     payload["isTestate"] = shareHolderMaster.isTestate==="Yes" ? true : false;
//     payload["isInTestate"] = shareHolderMaster.isTestate==="No" ? true : false;
//     payload["isMinor"] = shareHolderMaster.isMinor==="Yes" ? true : false;
//     payload["dobMinor"] = shareHolderMaster.dobMinor
//       ? dayjs(shareHolderMaster.dobMinor).format("DD-MM-YYYY")
//       : "";
//     payload["guardianName"] = shareHolderMaster.guardianName;
//     payload["guardianRelationship"] = shareHolderMaster.guardianRelationship;
//     payload["guardianPan"] = shareHolderMaster.guardianPan;
//     payload["taxStatus"] = shareHolderMaster.taxStatus;
//     payload["statusClaimant"] = shareHolderMaster.statusClaimant;
//     payload["percentageClaimant"] = shareHolderMaster.percentageClaimant;
//     payload["occupationClaimant"] = shareHolderMaster.occupationClaimant;
//     payload["politicalExposureClaimant"] = shareHolderMaster.politicalExposureClaimant;
//     payload["annualIncomeClaimant"] = shareHolderMaster.annualIncomeClaimant;


//     payload["Folio"] = folio.Folio;
//     payload["certificateCount"] = folio.certificate.length;
//     payload["grandTotalNoOfShares"] = folio.certificate.reduce(
//       (total, item) => total + (Number(item.noOfShares) || 0),
//       0
//     )
//     payload["certificate"] = folio.certificate.map((item, i) => ({
//       ...item,
//       totalFaceValue: item.faceValue,
//       totalNoOfShares: item.noOfShares,
//       totalNoOfSharesWords: item.noOfSharesWords,
//       distinctiveNos: item.distinctiveNosFrom + "-" + item.distinctiveNosTo,
//       certificateYear: item.dateOfAllotment
//       ? dayjs(item.dateOfAllotment).format("YYYY")
//       : "",
//       index: i + 1,
//     }));
//     payload['combinedTotalNoOfShares'] = folio.certificate.reduce(
//       (total, item) => total + (Number(item.noOfShares) || 0),
//       0
//     )
//     payload["combinedTotalNoOfSharesWords"] = numberInWords(
//       payload["combinedTotalNoOfShares"]
//     )
//     payload["combinedTotalFaceValue"] = folio.certificate.length>0 ? (folio.certificate[0].faceValue ?? 0) : 0;
//     payload["instrumentType"] = folio.shareCertificateMaster!.instrumentType;
//     payload["companyRTA"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.registrarMaster?.registrar_name || "";
//     payload["companyRTAAddress"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.address || "";
//     payload["companyRTAPincode"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.pincode || "";
//     payload["companyCIN"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.CIN || "";
//     payload["companyCity"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.city || "";
//     payload["companyState"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster?.state || "";
//     payload["companyPincode"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster?.pincode || "";
//     payload["companyRegisteredOffice"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster
//         ?.registeredOffice || "";
//     payload["companyName"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster?.nameChangeMasters[0].currentName ||
//       "";
//     payload["companyOldName"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster
//         ?.nameChangeMasters[
//         (shareHolderMaster.shareCertificateMaster?.companyMaster
//           ?.nameChangeMasters.length - 1) || 0
//       ].previousName || "";
//     payload["hasCompanyOldName"] =
//       typeof shareHolderMaster.shareCertificateMaster?.companyMaster
//         ?.nameChangeMasters[
//         shareHolderMaster.shareCertificateMaster?.companyMaster
//           ?.nameChangeMasters.length - 1 || 0
//       ].previousName === "string" &&
//       shareHolderMaster.shareCertificateMaster?.companyMaster
//         ?.nameChangeMasters[
//         shareHolderMaster.shareCertificateMaster?.companyMaster
//           ?.nameChangeMasters.length - 1 || 0
//       ].previousName !== "";
//     payload["companyOldName2"] =
//       shareHolderMaster.shareCertificateMaster?.companyMaster
//         ?.nameChangeMasters[
//         (shareHolderMaster.shareCertificateMaster?.companyMaster
//           ?.nameChangeMasters.length - 1) || 0
//       ].previousName || (shareHolderMaster.shareCertificateMaster?.companyMaster?.nameChangeMasters[0].currentName || "");
//     payload["shareHolderDetails"] = [];
//     if(folio.shareholderName1){
//       payload["hasShareholder_" + (1)] = true;
//       payload["namePan_" + (1)] = folio.shareholderName1.namePan;
//       payload["DPID_" + (1)] = folio.shareholderName1.DPID;
//       payload["aadhar_" + (1)] = folio.shareholderName1.aadhar;
//       payload["addressBank_" + (1)] = folio.shareholderName1.addressBank;
//       payload["addressAadhar_" + (1)] = folio.shareholderName1.addressAadhar;
//       payload["age_" + (1)] = folio.shareholderName1.age;
//       payload["bankAccountNo_" + (1)] = folio.shareholderName1.bankAccountNo;
//       payload["bankAccountType_" + (1)] =
//         folio.shareholderName1.bankAccountType;
//       payload["bankAddress_" + (1)] = folio.shareholderName1.bankAddress;
//       payload["bankEmail_" + (1)] = folio.shareholderName1.bankEmail;
//       payload["bankIFS_" + (1)] = folio.shareholderName1.bankIFS;
//       payload["bankMICR_" + (1)] = folio.shareholderName1.bankMICR;
//       payload["bankName_" + (1)] = folio.shareholderName1.bankName;
//       payload["bankPhone_" + (1)] = folio.shareholderName1.bankPhone;
//       payload["city_" + (1)] = folio.shareholderName1.city;
//       payload["countryOfBirth_" + (1)] =
//         folio.shareholderName1.countryOfBirth;
//       payload["dematAccountNo_" + (1)] =
//         folio.shareholderName1.dematAccountNo;
//       payload["dob_" + 1] = folio.shareholderName1
//         .dob
//         ? dayjs(folio.shareholderName1.dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_" + (1)] = folio.shareholderName1.email;
//       payload["emailBank_" + (1)] = folio.shareholderName1.emailBank;
//       payload["nameAadhar_" + (1)] = folio.shareholderName1.nameAadhar;
//       payload["nameBank_" + (1)] = folio.shareholderName1.nameBank;
//       payload["nameCml_" + (1)] = folio.shareholderName1.nameCml;
//       payload["namePan_" + (1)] = folio.shareholderName1.namePan;
//       payload["nationality_" + (1)] = folio.shareholderName1.nationality;
//       payload["pan_" + (1)] = folio.shareholderName1.pan;
//       payload["phone_" + (1)] = folio.shareholderName1.phone;
//       payload["phoneBank_" + (1)] = folio.shareholderName1.phoneBank;
//       payload["pincodeBank_" + (1)] = folio.shareholderName1.pincodeBank;
//       payload["placeOfBirth_" + (1)] = folio.shareholderName1.placeOfBirth;
//       payload["husbandName_" + 1] = folio.shareholderName1.husbandName;
//       payload["occupation_" + 1] = folio.shareholderName1.occupation;
//       payload["branchName_" + 1] = folio.shareholderName1.branchName;
//       payload["accountOpeningDate_" + 1] =
//         folio.shareholderName1.accountOpeningDate ? dayjs(folio.shareholderName1.accountOpeningDate).format("DD-MM-YYYY") : "";
//       payload["shareholderName_" + (1)] =
//         folio.shareholderName1.shareholderName;
//       payload["state_" + (1)] = folio.shareholderName1.state;
//       payload["shareholderNameCertificate_" + 1] =
//         folio.certificate.length > 0
//           ? (folio.certificate[folio.certificate.length-1].shareholderName1Txt || "")
//           : "";
//       payload["shareHolderDetails"] = [
//         {
//           ...folio.shareholderName1,
//           shareholderNameCertificate:
//             folio.certificate.length > 0
//               ? folio.certificate[folio.certificate.length - 1]
//                   .shareholderName1Txt || ""
//               : "",
//           index: 1,
//         },
//         ...payload["shareHolderDetails"],
//       ];
//     }else{
//       payload["hasShareholder_" + (1)] = false;
//     }
//     if(folio.shareholderName2){
//       payload["hasShareholder_" + (2)] = true;
//       payload["namePan_" + (2)] = folio.shareholderName2.namePan;
//       payload["DPID_" + (2)] = folio.shareholderName2.DPID;
//       payload["aadhar_" + (2)] = folio.shareholderName2.aadhar;
//       payload["addressBank_" + (2)] = folio.shareholderName2.addressBank;
//       payload["addressAadhar_" + (2)] = folio.shareholderName2.addressAadhar;
//       payload["age_" + (2)] = folio.shareholderName2.age;
//       payload["bankAccountNo_" + (2)] = folio.shareholderName2.bankAccountNo;
//       payload["bankAccountType_" + (2)] =
//         folio.shareholderName2.bankAccountType;
//       payload["bankAddress_" + (2)] = folio.shareholderName2.bankAddress;
//       payload["bankEmail_" + (2)] = folio.shareholderName2.bankEmail;
//       payload["bankIFS_" + (2)] = folio.shareholderName2.bankIFS;
//       payload["bankMICR_" + (2)] = folio.shareholderName2.bankMICR;
//       payload["bankName_" + (2)] = folio.shareholderName2.bankName;
//       payload["bankPhone_" + (2)] = folio.shareholderName2.bankPhone;
//       payload["city_" + (2)] = folio.shareholderName2.city;
//       payload["countryOfBirth_" + (2)] =
//         folio.shareholderName2.countryOfBirth;
//       payload["dematAccountNo_" + (2)] =
//         folio.shareholderName2.dematAccountNo;
//       payload["dob_" + 2] = folio.shareholderName2.dob
//         ? dayjs(folio.shareholderName2.dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_" + (2)] = folio.shareholderName2.email;
//       payload["emailBank_" + (2)] = folio.shareholderName2.emailBank;
//       payload["nameAadhar_" + (2)] = folio.shareholderName2.nameAadhar;
//       payload["nameBank_" + (2)] = folio.shareholderName2.nameBank;
//       payload["nameCml_" + (2)] = folio.shareholderName2.nameCml;
//       payload["namePan_" + (2)] = folio.shareholderName2.namePan;
//       payload["nationality_" + (2)] = folio.shareholderName2.nationality;
//       payload["pan_" + (2)] = folio.shareholderName2.pan;
//       payload["phone_" + (2)] = folio.shareholderName2.phone;
//       payload["phoneBank_" + (2)] = folio.shareholderName2.phoneBank;
//       payload["pincodeBank_" + (2)] = folio.shareholderName2.pincodeBank;
//       payload["placeOfBirth_" + (2)] = folio.shareholderName2.placeOfBirth;
//       payload["husbandName_" + 2] = folio.shareholderName2.husbandName;
//       payload["occupation_" + 2] = folio.shareholderName2.occupation;
//       payload["branchName_" + 2] = folio.shareholderName2.branchName;
//       payload["accountOpeningDate_" + 2] = folio.shareholderName2
//         .accountOpeningDate
//         ? dayjs(folio.shareholderName2.accountOpeningDate).format("DD-MM-YYYY")
//         : "";
//       payload["shareholderName_" + (2)] =
//         folio.shareholderName2.shareholderName;
//       payload["state_" + (2)] = folio.shareholderName2.state;
//       payload["shareholderNameCertificate_" + 2] =
//         folio.certificate.length > 0
//           ? folio.certificate[folio.certificate.length - 1]
//               .shareholderName2Txt || ""
//           : "";
//       payload["shareHolderDetails"] = [
//         {
//           ...folio.shareholderName2,
//           shareholderNameCertificate:
//             folio.certificate.length > 0
//               ? folio.certificate[folio.certificate.length - 1]
//                   .shareholderName2Txt || ""
//               : "",
//           index: 2
//         },
//         ...payload["shareHolderDetails"],
//       ];
//     }else{
//       payload["hasShareholder_" + (2)] = false;
//     }
//     if(folio.shareholderName3){
//       payload["hasShareholder_" + (3)] = true;
//       payload["namePan_" + (3)] = folio.shareholderName3.namePan;
//       payload["DPID_" + (3)] = folio.shareholderName3.DPID;
//       payload["aadhar_" + (3)] = folio.shareholderName3.aadhar;
//       payload["addressBank_" + (3)] = folio.shareholderName3.addressBank;
//       payload["addressAadhar_" + (3)] = folio.shareholderName3.addressAadhar;
//       payload["age_" + (3)] = folio.shareholderName3.age;
//       payload["bankAccountNo_" + (3)] = folio.shareholderName3.bankAccountNo;
//       payload["bankAccountType_" + (3)] =
//         folio.shareholderName3.bankAccountType;
//       payload["bankAddress_" + (3)] = folio.shareholderName3.bankAddress;
//       payload["bankEmail_" + (3)] = folio.shareholderName3.bankEmail;
//       payload["bankIFS_" + (3)] = folio.shareholderName3.bankIFS;
//       payload["bankMICR_" + (3)] = folio.shareholderName3.bankMICR;
//       payload["bankName_" + (3)] = folio.shareholderName3.bankName;
//       payload["bankPhone_" + (3)] = folio.shareholderName3.bankPhone;
//       payload["city_" + (3)] = folio.shareholderName3.city;
//       payload["countryOfBirth_" + (3)] =
//         folio.shareholderName3.countryOfBirth;
//       payload["dematAccountNo_" + (3)] =
//         folio.shareholderName3.dematAccountNo;
//       payload["dob_" + 3] = folio.shareholderName3.dob
//         ? dayjs(folio.shareholderName3.dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_" + (3)] = folio.shareholderName3.email;
//       payload["emailBank_" + (3)] = folio.shareholderName3.emailBank;
//       payload["nameAadhar_" + (3)] = folio.shareholderName3.nameAadhar;
//       payload["nameBank_" + (3)] = folio.shareholderName3.nameBank;
//       payload["nameCml_" + (3)] = folio.shareholderName3.nameCml;
//       payload["namePan_" + (3)] = folio.shareholderName3.namePan;
//       payload["nationality_" + (3)] = folio.shareholderName3.nationality;
//       payload["pan_" + (3)] = folio.shareholderName3.pan;
//       payload["phone_" + (3)] = folio.shareholderName3.phone;
//       payload["phoneBank_" + (3)] = folio.shareholderName3.phoneBank;
//       payload["pincodeBank_" + (3)] = folio.shareholderName3.pincodeBank;
//       payload["placeOfBirth_" + (3)] = folio.shareholderName3.placeOfBirth;
//       payload["husbandName_" + 3] = folio.shareholderName3.husbandName;
//       payload["occupation_" + 3] = folio.shareholderName3.occupation;
//       payload["branchName_" + 3] = folio.shareholderName3.branchName;
//       payload["accountOpeningDate_" + 3] = folio.shareholderName3
//         .accountOpeningDate
//         ? dayjs(folio.shareholderName3.accountOpeningDate).format("DD-MM-YYYY")
//         : "";
//       payload["shareholderName_" + (3)] =
//         folio.shareholderName3.shareholderName;
//       payload["state_" + (3)] = folio.shareholderName3.state;
//       payload["shareholderNameCertificate_" + 3] =
//         folio.certificate.length > 0
//           ? folio.certificate[folio.certificate.length - 1]
//               .shareholderName3Txt || ""
//           : "";
//       payload["shareHolderDetails"] = [
//         {
//           ...folio.shareholderName3,
//           shareholderNameCertificate:
//             folio.certificate.length > 0
//               ? folio.certificate[folio.certificate.length - 1]
//                   .shareholderName3Txt || ""
//               : "",
//           index: 3
//         },
//         ...payload["shareHolderDetails"],
//       ];
//     }else{
//       payload["hasShareholder_" + (3)] = false;
//     }
//     payload["legalHeirDetails"] = legalHeirDetails.map((item) => ({
//       ...item,
//       dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
//       accountOpeningDate: item.accountOpeningDate ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY") : "",
//     }));
//     payload["clamaints"] = clamaints.map((item, i) => ({
//       ...item,
//       dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
//       accountOpeningDate: item.accountOpeningDate
//         ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
//         : "",
//       index: i + 1,
//     }));
//     if (clamaints.length > 0) {
//       payload["hasClamaint"] = true;
//       payload["namePan_clamaints"] = clamaints[0].namePan;
//       payload["DPID_clamaints"] = clamaints[0].DPID;
//       payload["aadhar_clamaints"] = clamaints[0].aadhar;
//       payload["addressBank_clamaints"] = clamaints[0].addressBank;
//       payload["addressAadhar_clamaints"] = clamaints[0].addressAadhar;
//       payload["age_clamaints"] = clamaints[0].age;
//       payload["bankAccountNo_clamaints"] = clamaints[0].bankAccountNo;
//       payload["bankAccountType_clamaints"] = clamaints[0].bankAccountType;
//       payload["bankAddress_clamaints"] = clamaints[0].bankAddress;
//       payload["bankEmail_clamaints"] = clamaints[0].bankEmail;
//       payload["bankIFS_clamaints"] = clamaints[0].bankIFS;
//       payload["bankMICR_clamaints"] = clamaints[0].bankMICR;
//       payload["bankName_clamaints"] = clamaints[0].bankName;
//       payload["bankPhone_clamaints"] = clamaints[0].bankPhone;
//       payload["city_clamaints"] = clamaints[0].city;
//       payload["countryOfBirth_clamaints"] = clamaints[0].countryOfBirth;
//       payload["dematAccountNo_clamaints"] = clamaints[0].dematAccountNo;
//       payload["dob_clamaints"] = clamaints[0].dob
//         ? dayjs(clamaints[0].dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_clamaints"] = clamaints[0].email;
//       payload["emailBank_clamaints"] = clamaints[0].emailBank;
//       payload["nameAadhar_clamaints"] = clamaints[0].nameAadhar;
//       payload["nameBank_clamaints"] = clamaints[0].nameBank;
//       payload["nameCml_clamaints"] = clamaints[0].nameCml;
//       payload["namePan_clamaints"] = clamaints[0].namePan;
//       payload["nationality_clamaints"] = clamaints[0].nationality;
//       payload["pan_clamaints"] = clamaints[0].pan;
//       payload["phone_clamaints"] = clamaints[0].phone;
//       payload["phoneBank_clamaints"] = clamaints[0].phoneBank;
//       payload["pincodeBank_clamaints"] = clamaints[0].pincodeBank;
//       payload["placeOfBirth_clamaints"] = clamaints[0].placeOfBirth;
//       payload["husbandName_clamaints"] = clamaints[0].husbandName;
//       payload["occupation_clamaints"] = clamaints[0].occupation;
//       payload["branchName_clamaints"] = clamaints[0].branchName;
//       payload["accountOpeningDate_clamaints"] = clamaints[0]
//         .accountOpeningDate
//         ? dayjs(clamaints[0].accountOpeningDate).format("DD-MM-YYYY")
//         : "";
//       payload["state_clamaints"] = clamaints[0].state;
//     } else {
//       payload["hasClamaint"] = false;
//     }
//     if (clamaints.length >= 2) {
//       payload["hasClamaint_1"] = true;
//       payload["namePan_clamaints_1"] = clamaints[1].namePan;
//       payload["DPID_clamaints_1"] = clamaints[1].DPID;
//       payload["aadhar_clamaints_1"] = clamaints[1].aadhar;
//       payload["addressBank_clamaints_1"] = clamaints[1].addressBank;
//       payload["addressAadhar_clamaints_1"] = clamaints[1].addressAadhar;
//       payload["age_clamaints_1"] = clamaints[1].age;
//       payload["bankAccountNo_clamaints_1"] = clamaints[1].bankAccountNo;
//       payload["bankAccountType_clamaints_1"] = clamaints[1].bankAccountType;
//       payload["bankAddress_clamaints_1"] = clamaints[1].bankAddress;
//       payload["bankEmail_clamaints_1"] = clamaints[1].bankEmail;
//       payload["bankIFS_clamaints_1"] = clamaints[1].bankIFS;
//       payload["bankMICR_clamaints_1"] = clamaints[1].bankMICR;
//       payload["bankName_clamaints_1"] = clamaints[1].bankName;
//       payload["bankPhone_clamaints_1"] = clamaints[1].bankPhone;
//       payload["city_clamaints_1"] = clamaints[1].city;
//       payload["countryOfBirth_clamaints_1"] = clamaints[1].countryOfBirth;
//       payload["dematAccountNo_clamaints_1"] = clamaints[1].dematAccountNo;
//       payload["dob_clamaints_1"] = clamaints[1].dob
//         ? dayjs(clamaints[1].dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_clamaints_1"] = clamaints[1].email;
//       payload["emailBank_clamaints_1"] = clamaints[1].emailBank;
//       payload["nameAadhar_clamaints_1"] = clamaints[1].nameAadhar;
//       payload["nameBank_clamaints_1"] = clamaints[1].nameBank;
//       payload["nameCml_clamaints_1"] = clamaints[1].nameCml;
//       payload["namePan_clamaints_1"] = clamaints[1].namePan;
//       payload["nationality_clamaints_1"] = clamaints[1].nationality;
//       payload["pan_clamaints_1"] = clamaints[1].pan;
//       payload["phone_clamaints_1"] = clamaints[1].phone;
//       payload["phoneBank_clamaints_1"] = clamaints[1].phoneBank;
//       payload["pincodeBank_clamaints_1"] = clamaints[1].pincodeBank;
//       payload["placeOfBirth_clamaints_1"] = clamaints[1].placeOfBirth;
//       payload["husbandName_clamaints_1"] = clamaints[1].husbandName;
//       payload["occupation_clamaints_1"] = clamaints[1].occupation;
//       payload["branchName_clamaints_1"] = clamaints[1].branchName;
//       payload["accountOpeningDate_clamaints_1"] = clamaints[1]
//         .accountOpeningDate
//         ? dayjs(clamaints[1].accountOpeningDate).format("DD-MM-YYYY")
//         : "";
//       payload["state_clamaints_1"] = clamaints[1].state;
//     } else {
//       payload["hasClamaint_1"] = false;
//     }
//     if (clamaints.length >= 3) {
//       payload["hasClamaint_2"] = true;
//       payload["namePan_clamaints_2"] = clamaints[2].namePan;
//       payload["DPID_clamaints_2"] = clamaints[2].DPID;
//       payload["aadhar_clamaints_2"] = clamaints[2].aadhar;
//       payload["addressBank_clamaints_2"] = clamaints[2].addressBank;
//       payload["addressAadhar_clamaints_2"] = clamaints[2].addressAadhar;
//       payload["age_clamaints_2"] = clamaints[2].age;
//       payload["bankAccountNo_clamaints_2"] = clamaints[2].bankAccountNo;
//       payload["bankAccountType_clamaints_2"] = clamaints[2].bankAccountType;
//       payload["bankAddress_clamaints_2"] = clamaints[2].bankAddress;
//       payload["bankEmail_clamaints_2"] = clamaints[2].bankEmail;
//       payload["bankIFS_clamaints_2"] = clamaints[2].bankIFS;
//       payload["bankMICR_clamaints_2"] = clamaints[2].bankMICR;
//       payload["bankName_clamaints_2"] = clamaints[2].bankName;
//       payload["bankPhone_clamaints_2"] = clamaints[2].bankPhone;
//       payload["city_clamaints_2"] = clamaints[2].city;
//       payload["countryOfBirth_clamaints_2"] = clamaints[2].countryOfBirth;
//       payload["dematAccountNo_clamaints_2"] = clamaints[2].dematAccountNo;
//       payload["dob_clamaints_2"] = clamaints[2].dob
//         ? dayjs(clamaints[2].dob).format("DD-MM-YYYY")
//         : "";
//       payload["email_clamaints_2"] = clamaints[2].email;
//       payload["emailBank_clamaints_2"] = clamaints[2].emailBank;
//       payload["nameAadhar_clamaints_2"] = clamaints[2].nameAadhar;
//       payload["nameBank_clamaints_2"] = clamaints[2].nameBank;
//       payload["nameCml_clamaints_2"] = clamaints[2].nameCml;
//       payload["namePan_clamaints_2"] = clamaints[2].namePan;
//       payload["nationality_clamaints_2"] = clamaints[2].nationality;
//       payload["pan_clamaints_2"] = clamaints[2].pan;
//       payload["phone_clamaints_2"] = clamaints[2].phone;
//       payload["phoneBank_clamaints_2"] = clamaints[2].phoneBank;
//       payload["pincodeBank_clamaints_2"] = clamaints[2].pincodeBank;
//       payload["placeOfBirth_clamaints_2"] = clamaints[2].placeOfBirth;
//       payload["husbandName_clamaints_2"] = clamaints[2].husbandName;
//       payload["occupation_clamaints_2"] = clamaints[2].occupation;
//       payload["branchName_clamaints_2"] = clamaints[2].branchName;
//       payload["accountOpeningDate_clamaints_2"] = clamaints[2]
//         .accountOpeningDate
//         ? dayjs(clamaints[2].accountOpeningDate).format("DD-MM-YYYY")
//         : "";
//       payload["state_clamaints_2"] = clamaints[2].state;
//     } else {
//       payload["hasClamaint_2"] = false;
//     }
//     payload["non_clamaints"] = legalHeirDetails
//       .filter((itmm) => clamaints.map((i) => i.id).includes(itmm.id) === false)
//       .map((itmm, i) => ({
//         ...itmm,
//         dob: itmm.dob ? dayjs(itmm.dob).format("DD-MM-YYYY") : "",
//         accountOpeningDate: itmm.accountOpeningDate
//           ? dayjs(itmm.accountOpeningDate).format("DD-MM-YYYY")
//           : "",
//         index: i + 1,
//       }));
//     payload["survivors"] = payload["shareHolderDetails"]
//       .filter((itmm) => itmm.id !== payload["deadShareholder"]?.id)
//       .map((itmm, i) => ({
//         ...itmm,
//         dob: itmm.dob ? dayjs(itmm.dob).format("DD-MM-YYYY") : "",
//         accountOpeningDate: itmm.accountOpeningDate
//           ? dayjs(itmm.accountOpeningDate).format("DD-MM-YYYY")
//           : "",
//         index: i + 1,
//       }));
//     mainData.push(payload);
//   })

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

//   const Affidavit = {
//     name: "Affidavit",
//     path: path.resolve(
//       __dirname,
//       "../../../static/word_template/Affidavit.docx"
//     )
//   }

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
//     Claim: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13, Form_SH_14, Affidavit],
//     ClaimTransposition: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       form_no_sh_13,
//       Form_SH_14,
//       Affidavit,
//     ],
//     ClaimIssueDuplicate: [
//       ISR1,
//       ISR2,
//       ISR3,
//       ISR4,
//       form_no_sh_13,
//       Form_SH_14,
//       Form_A_Duplicate,
//       Form_B_Duplicate,
//       Affidavit,
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
//       Affidavit,
//     ],
//     TransmissionIssueDuplicate: [
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
//       Affidavit,
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
//       Affidavit,
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
//       Affidavit,
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
//       Affidavit,
//     ],
//   };

//   mainData.forEach((item, index) => {
//     const folioFolderName = item.Folio.replace(/\//g, "_");

//     const folioFolderPath = path.resolve(
//       __dirname,
//       `../../../static/word_output/${folderName}/${folioFolderName}`
//     );
//     if (!fs.existsSync(folioFolderPath)) {
//       fs.mkdirSync(folioFolderPath);
//     }
//     const data = {
//       ...item,
//     };

//     caseType[item.Case].forEach((casee) => {

//       if (casee.name === "Annexure_D") {
//         const folioFolderAnxDPath = path.resolve(
//           __dirname,
//           `../../../static/word_output/${folderName}/${folioFolderName}/Annexure_D`
//         );
//         if (!fs.existsSync(folioFolderAnxDPath)) {
//           fs.mkdirSync(folioFolderAnxDPath);
//         }
//         data.legalHeirDetails.forEach((i, idx) => {
//           const annxDWordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/" + casee.name + ".docx"
//           );
//           const annxDContent = fs.readFileSync(annxDWordTemplate, "binary");

//           // Create a zip instance of the file
//           const annxDZip = new PizZip(annxDContent);

//           // Create a Docxtemplater instance
//           const annxDDoc = new Docxtemplater(annxDZip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });
//           const dataRender:any = {...i};
//           dataRender["companyName"] = data["companyName"];
//           dataRender["companyOldName"] = data["companyOldName"];
//           dataRender["companyOldName2"] = data["companyOldName2"];
//           dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
//           // dataRender["deceasedRelationship"] = data["deceasedRelationship"];
//           dataRender["Folio"] = data["Folio"];
//           dataRender["certificate"] = data["certificate"];
//           dataRender["legalHeirDetails"] = data.legalHeirDetails.filter(
//             (_it, itx) => itx !== idx
//           );
//           annxDDoc.render(dataRender);
  
//           // Get the generated document as a buffer
//           const buf = annxDDoc.getZip().generate({ type: "nodebuffer" });
  
//           // Write the buffer to a file (output.docx)
//           const annxDWordOutput = path.resolve(
//             __dirname,
//             folioFolderAnxDPath + "/" + casee.name + "_" + (idx + 1) + ".docx"
//           );
//           fs.writeFileSync(annxDWordOutput, buf);
  
//           console.log("Annexure D Document created successfully!");
//         })
//       } 
//       else if (casee.name === "ISR5") {
//         const folioFolderISR5DPath = path.resolve(
//           __dirname,
//           `../../../static/word_output/${folderName}/${folioFolderName}/ISR5`
//         );
//         if (!fs.existsSync(folioFolderISR5DPath)) {
//           fs.mkdirSync(folioFolderISR5DPath);
//         }
//         data.clamaints.forEach((i, idx) => {
//           const ISR5WordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/" + casee.name + ".docx"
//           );
//           const ISR5Content = fs.readFileSync(ISR5WordTemplate, "binary");

//           // Create a zip instance of the file
//           const ISR5Zip = new PizZip(ISR5Content);

//           // Create a Docxtemplater instance
//           const ISR5Doc = new Docxtemplater(ISR5Zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });
//           const dataRender: any = { ...i };
//           dataRender["companyName"] = data["companyName"];
//           dataRender["companyOldName"] = data["companyOldName"];
//           dataRender["companyOldName2"] = data["companyOldName2"];
//           dataRender["companyRTA"] = data["companyRTA"];
//           dataRender["companyRTAAddress"] = data["companyRTAAddress"];
//           dataRender["companyRTAPincode"] = data["companyRTAPincode"];
//           dataRender["isDeceased"] = data["isDeceased"];
//           dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
//           // dataRender["deceasedRelationship"] = data["deceasedRelationship"];
//           dataRender["dod"] = data["dod"];
//           dataRender["placeOfDeath"] = data["placeOfDeath"];
//           dataRender["isTestate"] = data["isTestate"];
//           dataRender["isMinor"] = data["isMinor"];
//           dataRender["dobMinor"] = data["dobMinor"];
//           dataRender["guardianName"] = data["guardianName"];
//           dataRender["guardianRelationship"] = data["guardianRelationship"];
//           dataRender["guardianPan"] = data["guardianPan"];
//           dataRender["taxStatus"] = data["taxStatus"];
//           dataRender["statusClaimant"] = data["statusClaimant"];
//           dataRender["percentageClaimant"] = data["percentageClaimant"];
//           dataRender["occupationClaimant"] = data["occupationClaimant"];
//           dataRender["politicalExposureClaimant"] = data["politicalExposureClaimant"];
//           dataRender["annualIncomeClaimant"] = data["annualIncomeClaimant"];
//           dataRender["Folio"] = data["Folio"];
//           dataRender["certificate"] = data["certificate"];
//           ISR5Doc.render(dataRender);

//           // Get the generated document as a buffer
//           const buf = ISR5Doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const ISR5WordOutput = path.resolve(
//             __dirname,
//             folioFolderISR5DPath + "/" + casee.name + "_" + (idx + 1) + ".docx"
//           );
//           fs.writeFileSync(ISR5WordOutput, buf);

//           console.log("ISR5 Document created successfully!");
//         });
//       } 
//       else if (casee.name === "Form_A_Duplicate") {
//         if (item.Case === "TransmissionIssueDuplicate") {
//           // Load the docx file as a binary
//           const wordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/Form_A_Duplicate_2.docx"
//           );
//           const content = fs.readFileSync(wordTemplate, "binary");

//           // Create a zip instance of the file
//           const zip = new PizZip(content);

//           // Create a Docxtemplater instance
//           const doc = new Docxtemplater(zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           doc.render(data);

//           // Get the generated document as a buffer
//           const buf = doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const wordOutput = path.resolve(
//             __dirname,
//             folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//           );
//           fs.writeFileSync(wordOutput, buf);

//           console.log("Document created successfully!");
//         } else {
//           // Load the docx file as a binary
//           const wordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/Form_A_Duplicate_1.docx"
//           );
//           const content = fs.readFileSync(wordTemplate, "binary");

//           // Create a zip instance of the file
//           const zip = new PizZip(content);

//           // Create a Docxtemplater instance
//           const doc = new Docxtemplater(zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           doc.render(data);

//           // Get the generated document as a buffer
//           const buf = doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const wordOutput = path.resolve(
//             __dirname,
//             folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//           );
//           fs.writeFileSync(wordOutput, buf);

//           console.log("Document created successfully!");
//         }
//       } 
//       else if (casee.name === "Form_B_Duplicate") {
//         if (item.Case === "TransmissionIssueDuplicate") {
//           // Load the docx file as a binary
//           const wordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/Form_B_Duplicate_2.docx"
//           );
//           const content = fs.readFileSync(wordTemplate, "binary");

//           // Create a zip instance of the file
//           const zip = new PizZip(content);

//           // Create a Docxtemplater instance
//           const doc = new Docxtemplater(zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           doc.render(data);

//           // Get the generated document as a buffer
//           const buf = doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const wordOutput = path.resolve(
//             __dirname,
//             folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//           );
//           fs.writeFileSync(wordOutput, buf);

//           console.log("Document created successfully!");
//         } else {
//           // Load the docx file as a binary
//           const wordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/Form_B_Duplicate_1.docx"
//           );
//           const content = fs.readFileSync(wordTemplate, "binary");

//           // Create a zip instance of the file
//           const zip = new PizZip(content);

//           // Create a Docxtemplater instance
//           const doc = new Docxtemplater(zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           doc.render(data);

//           // Get the generated document as a buffer
//           const buf = doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const wordOutput = path.resolve(
//             __dirname,
//             folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//           );
//           fs.writeFileSync(wordOutput, buf);

//           console.log("Document created successfully!");
//         }
//       } 
//       else if (casee.name === "Affidavit") {
//         if (data.allowAffidavit) {
//           if (item.Case.includes("Transmission")){
//             //affidavit legal heir start
//             // Load the docx file as a binary
//             const folioFolderAffidavitDPath = path.resolve(
//               __dirname,
//               `../../../static/word_output/${folderName}/${folioFolderName}/AffidavitLegalHeir`
//             );
//             if (!fs.existsSync(folioFolderAffidavitDPath)) {
//               fs.mkdirSync(folioFolderAffidavitDPath);
//             }
//             data.affidavitLegalHeirs.forEach((i, idx) => {
//               const affidavitWordTemplate = path.resolve(
//                 __dirname,
//                 // item.Case.includes("Transmission")
//                 //   ? "../../../static/word_template/Affidavit2.docx"
//                 //   : 
//                   "../../../static/word_template/Affidavit.docx"
//               );
//               const affidavitContent = fs.readFileSync(
//                 affidavitWordTemplate,
//                 "binary"
//               );

//               // Create a zip instance of the file
//               const affidavitZip = new PizZip(affidavitContent);

//               // Create a Docxtemplater instance
//               const affidavitDoc = new Docxtemplater(affidavitZip, {
//                 paragraphLoop: true,
//                 linebreaks: true,
//               });

//               const dataRender: any = { ...i };
//               dataRender["companyName"] = data["companyName"];
//               dataRender["companyOldName"] = data["companyOldName"];
//               dataRender["companyOldName2"] = data["companyOldName2"];
//               dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
//               // dataRender["deceasedRelationship"] = data["deceasedRelationship"];
//               dataRender["placeOfDeath"] = data["placeOfDeath"];

//               affidavitDoc.render(dataRender);

//               // Get the generated document as a buffer
//               const buf = affidavitDoc
//                 .getZip()
//                 .generate({ type: "nodebuffer" });

//               // Write the buffer to a file (output.docx)
//               const affidavitWordOutput = path.resolve(
//                 __dirname,
//                 folioFolderAffidavitDPath +
//                   "/" +
//                   casee.name +
//                   "_" +
//                   (idx + 1) +
//                   ".docx"
//               );
//               fs.writeFileSync(affidavitWordOutput, buf);

//               console.log("Annexure D Document created successfully!");
//             });
//             //affidavit legal heir end
//           }
            

//           //affidavit shareholder start
//           const folioFolderAffidavitShareholderPath = path.resolve(
//             __dirname,
//             `../../../static/word_output/${folderName}/${folioFolderName}/AffidavitShareholder`
//           );
//           if (!fs.existsSync(folioFolderAffidavitShareholderPath)) {
//             fs.mkdirSync(folioFolderAffidavitShareholderPath);
//           }
//           data.affidavits.forEach((i, idx) => {
//             const affidavitWordTemplate = path.resolve(
//               __dirname,
//               // item.Case.includes("Transmission")
//               //   ? "../../../static/word_template/Affidavit.docx"
//               //   : 
//                 "../../../static/word_template/Affidavit2.docx"
//             );
//             const affidavitContent = fs.readFileSync(
//               affidavitWordTemplate,
//               "binary"
//             );

//             // Create a zip instance of the file
//             const affidavitZip = new PizZip(affidavitContent);

//             // Create a Docxtemplater instance
//             const affidavitDoc = new Docxtemplater(affidavitZip, {
//               paragraphLoop: true,
//               linebreaks: true,
//             });

//             const dataRender: any = { ...i };

//             const indx = data["shareHolderDetails"].findIndex(
//               (i: any) => i.id === i.id
//             );

//             dataRender["shareholderNameCertificate"] =
//               indx !== -1
//                 ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
//                 : "";

//             affidavitDoc.render(dataRender);

//             // Get the generated document as a buffer
//             const buf = affidavitDoc.getZip().generate({ type: "nodebuffer" });

//             // Write the buffer to a file (output.docx)
//             const affidavitWordOutput = path.resolve(
//               __dirname,
//               folioFolderAffidavitShareholderPath +
//                 "/" +
//                 casee.name +
//                 "_" +
//                 (idx + 1) +
//                 ".docx"
//             );
//             fs.writeFileSync(affidavitWordOutput, buf);

//             console.log("Annexure D Document created successfully!");
//           });
//           //affidavit shareholder end
//         }
//       }
//       else if (casee.name === "form_no_sh_13") {
//         const folioFolderSH13Path = path.resolve(
//           __dirname,
//           `../../../static/word_output/${folderName}/${folioFolderName}/form_no_sh_13`
//         );
//         if (!fs.existsSync(folioFolderSH13Path)) {
//           fs.mkdirSync(folioFolderSH13Path);
//         }
//         data.nominations.forEach((i, idx) => {
//           const sh13WordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/form_no_sh_13.docx"
//           );
//           const sh13Content = fs.readFileSync(
//             sh13WordTemplate,
//             "binary"
//           );

//           // Create a zip instance of the file
//           const sh13Zip = new PizZip(sh13Content);

//           // Create a Docxtemplater instance
//           const sh13Doc = new Docxtemplater(sh13Zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           const dataRender: any = { ...i, ...data };

//           const indx = data["shareHolderDetails"].findIndex(
//             (i: any) => i.id === i.id
//           );

//           dataRender["shareholderNameCertificate"] =
//             indx !== -1
//               ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
//               : "";

//           sh13Doc.render(dataRender);

//           // Get the generated document as a buffer
//           const buf = sh13Doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const sh13WordOutput = path.resolve(
//             __dirname,
//             folioFolderSH13Path +
//               "/" +
//               casee.name +
//               "_" +
//               (idx + 1) +
//               ".docx"
//           );
//           fs.writeFileSync(sh13WordOutput, buf);

//           console.log("Form sh 13 Document created successfully!");
//         });
//       } 
//       else if (casee.name === "Form_SH_14") {
//         const folioFolderSH14Path = path.resolve(
//           __dirname,
//           `../../../static/word_output/${folderName}/${folioFolderName}/Form_SH_14`
//         );
//         if (!fs.existsSync(folioFolderSH14Path)) {
//           fs.mkdirSync(folioFolderSH14Path);
//         }
//         data.nominations.forEach((i, idx) => {
//           const sh14WordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/Form_SH_14.docx"
//           );
//           const sh14Content = fs.readFileSync(sh14WordTemplate, "binary");

//           // Create a zip instance of the file
//           const sh14Zip = new PizZip(sh14Content);

//           // Create a Docxtemplater instance
//           const sh14Doc = new Docxtemplater(sh14Zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           const dataRender: any = { ...i, ...data };

//           const indx = data["shareHolderDetails"].findIndex(
//             (i: any) => i.id === i.id
//           );

//           dataRender["shareholderNameCertificate"] =
//             indx !== -1
//               ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
//               : "";

//           sh14Doc.render(dataRender);

//           // Get the generated document as a buffer
//           const buf = sh14Doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const sh14WordOutput = path.resolve(
//             __dirname,
//             folioFolderSH14Path + "/" + casee.name + "_" + (idx + 1) + ".docx"
//           );
//           fs.writeFileSync(sh14WordOutput, buf);

//           console.log("Form sh 14 Document created successfully!");
//         });
//       } else if (casee.name === "ISR2") {
//         if (item.Case.includes("Transmission")) {
//           const folioFolderISR2DPath = path.resolve(
//             __dirname,
//             `../../../static/word_output/${folderName}/${folioFolderName}/ISR2`
//           );
//           if (!fs.existsSync(folioFolderISR2DPath)) {
//             fs.mkdirSync(folioFolderISR2DPath);
//           }
//           data.clamaints.forEach((i, idx) => {
//             const ISR2WordTemplate = path.resolve(
//               __dirname,
//               "../../../static/word_template/" +
//                 casee.name +
//                 "_TRANSMISSION.docx"
//             );
//             const ISR2Content = fs.readFileSync(ISR2WordTemplate, "binary");
  
//             // Create a zip instance of the file
//             const ISR2Zip = new PizZip(ISR2Content);
  
//             // Create a Docxtemplater instance
//             const ISR2Doc = new Docxtemplater(ISR2Zip, {
//               paragraphLoop: true,
//               linebreaks: true,
//             });
//             const dataRender: any = { ...i };
//             dataRender["companyName"] = data["companyName"];
//             dataRender["companyOldName"] = data["companyOldName"];
//             dataRender["companyOldName2"] = data["companyOldName2"];
//             dataRender["companyRTA"] = data["companyRTA"];
//             dataRender["companyRTAAddress"] = data["companyRTAAddress"];
//             dataRender["companyRTAPincode"] = data["companyRTAPincode"];
//             dataRender["isDeceased"] = data["isDeceased"];
//             dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
//             // dataRender["deceasedRelationship"] = data["deceasedRelationship"];
//             dataRender["dod"] = data["dod"];
//             dataRender["placeOfDeath"] = data["placeOfDeath"];
//             dataRender["isTestate"] = data["isTestate"];
//             dataRender["isMinor"] = data["isMinor"];
//             dataRender["dobMinor"] = data["dobMinor"];
//             dataRender["guardianName"] = data["guardianName"];
//             dataRender["guardianRelationship"] = data["guardianRelationship"];
//             dataRender["guardianPan"] = data["guardianPan"];
//             dataRender["taxStatus"] = data["taxStatus"];
//             dataRender["statusClaimant"] = data["statusClaimant"];
//             dataRender["percentageClaimant"] = data["percentageClaimant"];
//             dataRender["occupationClaimant"] = data["occupationClaimant"];
//             dataRender["politicalExposureClaimant"] =
//               data["politicalExposureClaimant"];
//             dataRender["annualIncomeClaimant"] = data["annualIncomeClaimant"];
//             dataRender["Folio"] = data["Folio"];
//             dataRender["certificate"] = data["certificate"];
//             ISR2Doc.render(dataRender);
  
//             // Get the generated document as a buffer
//             const buf = ISR2Doc.getZip().generate({ type: "nodebuffer" });
  
//             // Write the buffer to a file (output.docx)
//             const ISR2WordOutput = path.resolve(
//               __dirname,
//               folioFolderISR2DPath + "/" + casee.name + "_" + (idx + 1) + ".docx"
//             );
//             fs.writeFileSync(ISR2WordOutput, buf);
  
//             console.log("ISR2 Document created successfully!");
//           });
//         }else{
//           // Load the docx file as a binary
//           const wordTemplate = path.resolve(
//             __dirname,
//             "../../../static/word_template/" + casee.name + ".docx"
//           );
//           const content = fs.readFileSync(wordTemplate, "binary");

//           // Create a zip instance of the file
//           const zip = new PizZip(content);

//           // Create a Docxtemplater instance
//           const doc = new Docxtemplater(zip, {
//             paragraphLoop: true,
//             linebreaks: true,
//           });

//           doc.render(data);

//           // Get the generated document as a buffer
//           const buf = doc.getZip().generate({ type: "nodebuffer" });

//           // Write the buffer to a file (output.docx)
//           const wordOutput = path.resolve(
//             __dirname,
//             folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//           );
//           fs.writeFileSync(wordOutput, buf);

//           console.log("Document created successfully!");
//         }
//       } else {
//         // Load the docx file as a binary
//         const wordTemplate = path.resolve(
//           __dirname,
//           "../../../static/word_template/" + casee.name + ".docx"
//         );
//         const content = fs.readFileSync(wordTemplate, "binary");

//         // Create a zip instance of the file
//         const zip = new PizZip(content);

//         // Create a Docxtemplater instance
//         const doc = new Docxtemplater(zip, {
//           paragraphLoop: true,
//           linebreaks: true,
//         });

//         doc.render(data);

//         // Get the generated document as a buffer
//         const buf = doc.getZip().generate({ type: "nodebuffer" });

//         // Write the buffer to a file (output.docx)
//         const wordOutput = path.resolve(
//           __dirname,
//           folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
//         );
//         fs.writeFileSync(wordOutput, buf);

//         console.log("Document created successfully!");
//       }

//       // Render the document by filling in the data
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

export async function generateDoc(
  params: GetIdParam
): Promise<string> {
  const { id } = params;

  // const caseDocGenerator = new CaseDocGenerator({id});

  // const doc = await caseDocGenerator.generateDoc();

  // return doc;

  // const folderName = "doc_" + id + "_" + Date.now();

  // const folderPath = path.resolve(
  //   __dirname,
  //   "../../../static/word_output/" + folderName
  // );
  // if (!fs.existsSync(folderPath)) {
  //   fs.mkdirSync(folderPath);
  // }

  const shareHolderMaster = await prisma.case.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      deadShareholder: true,
      shareCertificateMaster: {
        include: {
          companyMaster: {
            include: {
              registrarMasterBranch: {
                include: {
                  registrarMaster: true,
                },
              },
              nameChangeMasters: {
                select: NameChangeMasterColumn,
                orderBy: {
                  id: "desc",
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!shareHolderMaster) {
    throw new NotFoundError();
  }

  let foliosSet: (FolioType & { certificate: CertificateType[] })[] = [];
  let clamaints: LegalHeirDetailType[] = [];
  // let affidavitShareholders: ShareHolderDetailType[] = [];
  // let affidavitLegalHeirs: LegalHeirDetailType[] = [];
  let nominations: NominationType[] = [];
  // let order: ShareHolderDetailType[] = [];

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
        select: {
          id: true,
          Folio: true,
          shareholderName1ID: true,
          shareholderName2ID: true,
          shareholderName3ID: true,
          shareholderName1: true,
          shareholderName2: true,
          shareholderName3: true,
          certificate: {
            select: {
              id: true,
              equityType: true,
              certificateNumber: true,
              certificateSerialNumber: true,
              shareholderName1Txt: true,
              shareholderName2Txt: true,
              shareholderName3Txt: true,
              noOfShares: true,
              noOfSharesWords: true,
              dateOfAllotment: true,
              faceValue: true,
              distinctiveNosFrom: true,
              distinctiveNosTo: true,
              endorsement: true,
              endorsementFolio: true,
              endorsementDate: true,
              endorsementShareholderName1ID: true,
              endorsementShareholderName2ID: true,
              endorsementShareholderName3ID: true,
            },
            orderBy: {
              dateOfAction: "asc",
            },
          },
          shareCertificateMaster: true,
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
      clamaints = await prisma.legalHeirDetail.findMany({
        where: {
          id: {
            in: inClaimants,
          },
        },
      });
    }
  }
  // if (
  //   shareHolderMaster.transpositionOrder &&
  //   shareHolderMaster.transpositionOrder.split("_").length > 0
  // ) {
  //   const inOrder = shareHolderMaster.transpositionOrder
  //     ?.split("_")
  //     .map((order) => (isNaN(Number(order)) ? undefined : Number(order)))
  //     .filter((order) => order !== undefined) as number[];
  //   if (inOrder.length > 0) {
  //     order = await prisma.shareHolderDetail.findMany({
  //       where: {
  //         id: {
  //           in: inOrder,
  //         },
  //       },
  //     });
  //   }
  // }
  // if (shareHolderMaster.allowAffidavit === "Yes") {
  //   if (
  //     shareHolderMaster.selectAffidavitShareholder &&
  //     shareHolderMaster.selectAffidavitShareholder.split("_").length > 0
  //   ) {
  //     const inAffidavitShareholders = shareHolderMaster.selectAffidavitShareholder
  //       ?.split("_")
  //       .map((claimant) =>
  //         isNaN(Number(claimant)) ? undefined : Number(claimant)
  //       )
  //       .filter((claimant) => claimant !== undefined) as number[];
  //     if (inAffidavitShareholders.length > 0) {
  //       affidavitShareholders = await prisma.shareHolderDetail.findMany({
  //         where: {
  //           id: {
  //             in: inAffidavitShareholders,
  //           },
  //         },
  //       });
  //     }
  //   }
  // }
  // if (shareHolderMaster.allowAffidavit === "Yes") {
  //   if (
  //     shareHolderMaster.selectAffidavitLegalHeir &&
  //     shareHolderMaster.selectAffidavitLegalHeir.split("_").length > 0
  //   ) {
  //     const inAffidavitLegalHeirs = shareHolderMaster.selectAffidavitLegalHeir
  //       ?.split("_")
  //       .map((claimant) =>
  //         isNaN(Number(claimant)) ? undefined : Number(claimant)
  //       )
  //       .filter((claimant) => claimant !== undefined) as number[];
  //     if (inAffidavitLegalHeirs.length > 0) {
  //       if (shareHolderMaster.caseType.includes("Transmission")) {
  //         affidavitLegalHeirs = await prisma.legalHeirDetail.findMany({
  //           where: {
  //             id: {
  //               in: inAffidavitLegalHeirs,
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }
  // }
  if (
    shareHolderMaster.selectNomination &&
    shareHolderMaster.selectNomination.split("_").length > 0
  ) {
    const inNominations = shareHolderMaster.selectNomination
      ?.split("_")
      .map((claimant) =>
        isNaN(Number(claimant)) ? undefined : Number(claimant)
      )
      .filter((claimant) => claimant !== undefined) as number[];
    if (inNominations.length > 0) {
      nominations = await prisma.nomination.findMany({
        where: {
          id: {
            in: inNominations,
          },
        },
      });
    }
  }

  const legalHeirDetails = await prisma.legalHeirDetail.findMany({
    where: {
      projectID: shareHolderMaster.shareCertificateMaster?.projectID
    },
  })

  const mainData: any[] = [];
  foliosSet.forEach((folio) => {
    const payload = {
      Case: shareHolderMaster.caseType,
      companyName:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.nameChangeMasters[0].currentName || "",
      companyOldName:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.nameChangeMasters[
          shareHolderMaster.shareCertificateMaster?.companyMaster
            ?.nameChangeMasters.length - 1 || 0
        ].previousName || "",
      companyCity:
        shareHolderMaster.shareCertificateMaster?.companyMaster?.city || "",
      companyState:
        shareHolderMaster.shareCertificateMaster?.companyMaster?.state || "",
      companyPincode:
        shareHolderMaster.shareCertificateMaster?.companyMaster?.pincode || "",
      companyRegisteredOffice:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.registeredOffice || "",
      companyRTA:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.registrarMasterBranch?.registrarMaster?.registrar_name || "",
      companyRTAAddress:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.registrarMasterBranch?.address || "",
      companyRTAPincode:
        shareHolderMaster.shareCertificateMaster?.companyMaster
          ?.registrarMasterBranch?.pincode || "",
      Folio: folio.Folio,
      isMinor: shareHolderMaster.isMinor === "No" ? true : false,
      guardianName: shareHolderMaster.guardianName || "",
      dobMinor: shareHolderMaster.dobMinor
        ? dayjs(shareHolderMaster.dobMinor).format("DD-MM-YYYY")
        : "",
      percentageClaimant: shareHolderMaster.percentageClaimant || "",
      isInTestate: shareHolderMaster.isTestate === "No" ? true : false,
      isTestate: shareHolderMaster.isTestate === "Yes" ? true : false,
      shareholderNameDeath: shareHolderMaster.shareholderNameDeath
        ? shareHolderMaster.shareholderNameDeath
        : "",
      placeOfDeath: shareHolderMaster.placeOfDeath
        ? shareHolderMaster.placeOfDeath
        : "",
      dod: shareHolderMaster.dod
        ? dayjs(shareHolderMaster.dod).format("DD-MM-YYYY")
        : "",
      combinedTotalNoOfShares: folio.certificate.reduce(
        (total, item) => total + (Number(item.noOfShares) || 0),
        0
      ),
      combinedTotalNoOfSharesWords: numberInWords(
        folio.certificate
          .reduce((total, item) => total + (Number(item.noOfShares) || 0), 0)
          .toString()
      ),
      combinedTotalFaceValue:
        folio.certificate.length > 0 ? folio.certificate[0].faceValue ?? 0 : 0,
      certificateCount: folio.certificate.length,
      certificate: folio.certificate.map((item, i) => ({
        // ...item,
        // totalFaceValue: item.faceValue,
        // totalNoOfSharesWords: item.noOfSharesWords,
        totalNoOfShares: item.noOfShares || "",
        certificateNumber: item.certificateNumber,
        equityType: item.equityType,
        Folio: folio.Folio,
        distinctiveNosFrom: item.distinctiveNosFrom || "",
        distinctiveNosTo: item.distinctiveNosTo || "",
        distinctiveNos: item.distinctiveNosFrom + "-" + item.distinctiveNosTo,
        // certificateYear: item.dateOfAllotment
        //   ? dayjs(item.dateOfAllotment).format("YYYY")
        //   : "",
        index: i + 1,
      })),
      certificateNumbers: folio.certificate
        .map((item, i) => item.certificateNumber)
        .join(","),
      distinctiveNos: folio.certificate
        .map((item, i) => item.distinctiveNosFrom + "-" + item.distinctiveNosTo)
        .join(","),
      shareholderCertificateName1:
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName1Txt || ""
          : "",
      shareholderCertificateName2:
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName2Txt || ""
          : "",
      shareholderCertificateName3:
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName3Txt || ""
          : "",
      DPID: folio.shareholderName1 ? folio.shareholderName1.DPID : "",
      dematAccountNo: folio.shareholderName1
        ? folio.shareholderName1.dematAccountNo
        : "",
      bankAccountNo: folio.shareholderName1
        ? folio.shareholderName1.bankAccountNo
        : "",
      bankName: folio.shareholderName1 ? folio.shareholderName1.bankName : "",
      branchName: folio.shareholderName1
        ? folio.shareholderName1.branchName
        : "",
      bankAddress: folio.shareholderName1
        ? folio.shareholderName1.bankAddress
        : "",
      bankPhone: folio.shareholderName1 ? folio.shareholderName1.bankPhone : "",
      bankEmail: folio.shareholderName1 ? folio.shareholderName1.bankEmail : "",
      nameBank: folio.shareholderName1 ? folio.shareholderName1.nameBank : "",
      emailBank: folio.shareholderName1 ? folio.shareholderName1.emailBank : "",
      phoneBank: folio.shareholderName1 ? folio.shareholderName1.phoneBank : "",
      pincodeBank: folio.shareholderName1
        ? folio.shareholderName1.pincodeBank
        : "",
      accountOpeningDate: folio.shareholderName1
        ? dayjs(folio.shareholderName1.accountOpeningDate).format("DD-MM-YYYY")
        : "",
      bankIFS: folio.shareholderName1 ? folio.shareholderName1.bankIFS : "",
      addressBank: folio.shareholderName1
        ? folio.shareholderName1.addressBank
        : "",
      email: folio.shareholderName1 ? folio.shareholderName1.email : "",
      phone: folio.shareholderName1 ? folio.shareholderName1.phone : "",
      pan: folio.shareholderName1 ? folio.shareholderName1.pan : "",
      isr2_clamaints: [
        ...clamaints.map((item) => ({
          bankAccountNo: item.bankAccountNo ? item.bankAccountNo : "",
          bankName: item ? item.bankName : "",
          branchName: item ? item.branchName : "",
          bankAddress: item ? item.bankAddress : "",
          bankPhone: item ? item.bankPhone : "",
          bankEmail: item ? item.bankEmail : "",
          nameBank: item ? item.nameBank : "",
          emailBank: item ? item.emailBank : "",
          phoneBank: item ? item.phoneBank : "",
          pincodeBank: item ? item.pincodeBank : "",
          accountOpeningDate: item
            ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
            : "",
          bankIFS: item ? item.bankIFS : "",
          addressBank: item ? item.addressBank : "",
        })),
      ],
      clamaints: [
        ...clamaints.map((item) => ({
          namePan: item.namePan ? item.namePan : "",
          addressAadhar: item ? item.addressAadhar : "",
          city: item ? item.city : "",
          state: item ? item.state : "",
          bankName: item ? item.bankName : "",
          bankAccountNo: item ? item.bankAccountNo : "",
          bankIFS: item ? item.bankIFS : "",
          bankMICR: item ? item.bankMICR : "",
          branchName: item ? item.branchName : "",
          countryOfBirth: item ? item.countryOfBirth : "",
          placeOfBirth: item ? item.placeOfBirth : "",
          nationality: item ? item.nationality : "",
          pincodeBank: item ? item.pincodeBank : "",
          phone: item ? item.phone : "",
          email: item ? item.email : "",
          age: item ? item.age : "",
          pan: item ? item.pan : "",
          deceasedRelationship: item ? item.deceasedRelationship : "",
        })),
      ],
      non_clamaints: [
        ...legalHeirDetails
          .filter(
            (itmm) => clamaints.map((i) => i.id).includes(itmm.id) === false
          )
          .map((item) => ({
            namePan: item.namePan ? item.namePan : "",
            addressAadhar: item ? item.addressAadhar : "",
            pincodeBank: item ? item.pincodeBank : "",
            phone: item ? item.phone : "",
            age: item ? item.age : "",
            deceasedRelationship: item ? item.deceasedRelationship : "",
          })),
      ],
      declaration: [
        {
          name: folio.shareholderName1 ? folio.shareholderName1.namePan : "",
          address:
            (folio.shareholderName1
              ? folio.shareholderName1.addressAadhar
              : "") +
            " " +
            (folio.shareholderName1 ? folio.shareholderName1.pincodeBank : ""),
          pin: folio.shareholderName1 ? folio.shareholderName1.pincodeBank : "",
        },
        {
          name: folio.shareholderName2 ? folio.shareholderName2.namePan : "",
          address:
            (folio.shareholderName2
              ? folio.shareholderName2.addressAadhar
              : "") +
            " " +
            (folio.shareholderName2 ? folio.shareholderName2.pincodeBank : ""),
          pin: folio.shareholderName2 ? folio.shareholderName2.pincodeBank : "",
        },
        {
          name: folio.shareholderName3 ? folio.shareholderName3.namePan : "",
          address:
            (folio.shareholderName3
              ? folio.shareholderName3.addressAadhar
              : "") +
            " " +
            (folio.shareholderName3 ? folio.shareholderName3.pincodeBank : ""),
          pin: folio.shareholderName3 ? folio.shareholderName3.pincodeBank : "",
        },
      ],
      pans: [
        folio.shareholderName1 ? folio.shareholderName1.pan || "" : "",
        folio.shareholderName2 ? folio.shareholderName2.pan || "" : "",
        folio.shareholderName3 ? folio.shareholderName3.pan || "" : "",
      ],
      aadhars: [
        folio.shareholderName1 ? folio.shareholderName1.aadhar || "" : "",
        folio.shareholderName2 ? folio.shareholderName2.aadhar || "" : "",
        folio.shareholderName3 ? folio.shareholderName3.aadhar || "" : "",
      ],
      shareholderCertificateNames: [
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName1Txt || ""
          : "",
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName2Txt || ""
          : "",
        folio.certificate.length > 0
          ? folio.certificate[folio.certificate.length - 1]
              .shareholderName3Txt || ""
          : "",
      ]
        .filter((item) => item.length > 0)
        .join(","),
      clamaints_pan_name: clamaints.map((item) => item.namePan).join(","),
      legalHeirDetails: legalHeirDetails.map((item) => ({
        namePan: item.namePan ? item.namePan : "",
        addressAadhar: item.addressAadhar ? item.addressAadhar : "",
        pincodeBank: item.pincodeBank ? item.pincodeBank : "",
        phone: item.phone ? item.phone : "",
        age: item.age ? item.age : "",
        deceasedRelationship: item.deceasedRelationship
          ? item.deceasedRelationship
          : "",
        dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
        accountOpeningDate: item.accountOpeningDate
          ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
          : "",
      })),
      survivors: [
        {
          ...folio.shareholderName1,
          shareholderNameCertificate:
            folio.certificate.length > 0
              ? folio.certificate[folio.certificate.length - 1]
                  .shareholderName1Txt || ""
              : "",
          index: 1,
        },
        {
          ...folio.shareholderName2,
          shareholderNameCertificate:
            folio.certificate.length > 0
              ? folio.certificate[folio.certificate.length - 1]
                  .shareholderName2Txt || ""
              : "",
          index: 2,
        },
        {
          ...folio.shareholderName3,
          shareholderNameCertificate:
            folio.certificate.length > 0
              ? folio.certificate[folio.certificate.length - 1]
                  .shareholderName3Txt || ""
              : "",
          index: 3,
        },
      ]
        .filter((itmm) => itmm.id !== shareHolderMaster.deadShareholder?.id)
        .map((itmm) => itmm.shareholderNameCertificate)
        .join(","),
      survivor1:
        [
          {
            ...folio.shareholderName1,
            shareholderNameCertificate:
              folio.certificate.length > 0
                ? folio.certificate[folio.certificate.length - 1]
                    .shareholderName1Txt || ""
                : "",
            index: 1,
          },
          {
            ...folio.shareholderName2,
            shareholderNameCertificate:
              folio.certificate.length > 0
                ? folio.certificate[folio.certificate.length - 1]
                    .shareholderName2Txt || ""
                : "",
            index: 2,
          },
          {
            ...folio.shareholderName3,
            shareholderNameCertificate:
              folio.certificate.length > 0
                ? folio.certificate[folio.certificate.length - 1]
                    .shareholderName3Txt || ""
                : "",
            index: 3,
          },
        ].filter((itmm) => itmm.id !== shareHolderMaster.deadShareholder?.id)
          .length > 0
          ? {
              ...[
                {
                  ...folio.shareholderName1,
                  shareholderNameCertificate:
                    folio.certificate.length > 0
                      ? folio.certificate[folio.certificate.length - 1]
                          .shareholderName1Txt || ""
                      : "",
                  index: 1,
                },
                {
                  ...folio.shareholderName2,
                  shareholderNameCertificate:
                    folio.certificate.length > 0
                      ? folio.certificate[folio.certificate.length - 1]
                          .shareholderName2Txt || ""
                      : "",
                  index: 2,
                },
                {
                  ...folio.shareholderName3,
                  shareholderNameCertificate:
                    folio.certificate.length > 0
                      ? folio.certificate[folio.certificate.length - 1]
                          .shareholderName3Txt || ""
                      : "",
                  index: 3,
                },
              ].filter(
                (itmm) => itmm.id !== shareHolderMaster.deadShareholder?.id
              )[0],
            }
          : null,
      nominations: nominations.map((item) => ({
        ...item,
        dobMinor: item.dobMinor
          ? dayjs(item.dobMinor).format("DD-MM-YYYY")
          : "",
        dateMajority: item.dateMajority
          ? dayjs(item.dateMajority).format("DD-MM-YYYY")
          : "",
        dobDeceased: item.dobDeceased
          ? dayjs(item.dobDeceased).format("DD-MM-YYYY")
          : "",
        isMinor: item.isMinor === "Yes",
        isDeceased: item.isDeceased === "Yes",
      })),
    };

    // const payload: any = {};
    // payload["Case"] = shareHolderMaster.caseType;
    // payload["isTransmissionCase"] = shareHolderMaster.caseType.includes("Transmission") ? true : false
    // payload["isNotTransmissionCase"] = shareHolderMaster.caseType.includes("Transmission") === false ? true : false
    // payload["allowAffidavit"] =
    //   shareHolderMaster.allowAffidavit === "Yes" ? true : false;
    // payload["affidavits"] = affidavitShareholders.map((item, i) => ({
    //   ...item,
    //   dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
    //   accountOpeningDate: item.accountOpeningDate
    //     ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
    //     : "",
    //   index: i + 1,
    // }));
    // payload["affidavitLegalHeirs"] = affidavitLegalHeirs.map((item, i) => ({
    //   ...item,
    //   dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
    //   accountOpeningDate: item.accountOpeningDate
    //     ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
    //     : "",
    //   index: i + 1,
    // }));
    // payload["nominations"] = nominations.map((item, i) => ({
    //   ...item,
    //   dobMinor: item.dobMinor ? dayjs(item.dobMinor).format("DD-MM-YYYY") : "",
    //   dobDeceased: item.dobDeceased
    //     ? dayjs(item.dobDeceased).format("DD-MM-YYYY")
    //     : "",
    //   dateMajority: item.dateMajority
    //     ? dayjs(item.dateMajority).format("DD-MM-YYYY")
    //     : "",
    //   isMinor: item.isMinor === "Yes" ? true : false,
    //   isDeceased: item.isDeceased === "Yes" ? true : false,
    //   index: i + 1,
    // }));
    // payload["isDeceased"] = shareHolderMaster.isDeceased==="Yes" ? true : false;
    // payload["deadShareholder"] = shareHolderMaster.deadShareholder;
    // payload["shareholderNameDeath"] = shareHolderMaster.shareholderNameDeath;
    // // payload["deceasedRelationship"] = shareHolderMaster.deceasedRelationship;
    // payload["placeOfDeath"] = shareHolderMaster.placeOfDeath;
    // payload["dod"] = shareHolderMaster.dod
    //   ? dayjs(shareHolderMaster.dod).format("DD-MM-YYYY")
    //   : "";
    // payload["isTestate"] = shareHolderMaster.isTestate==="Yes" ? true : false;
    // payload["isInTestate"] = shareHolderMaster.isTestate==="No" ? true : false;
    // payload["isMinor"] = shareHolderMaster.isMinor==="Yes" ? true : false;
    // payload["dobMinor"] = shareHolderMaster.dobMinor
    //   ? dayjs(shareHolderMaster.dobMinor).format("DD-MM-YYYY")
    //   : "";
    // payload["guardianName"] = shareHolderMaster.guardianName;
    // payload["guardianRelationship"] = shareHolderMaster.guardianRelationship;
    // payload["guardianPan"] = shareHolderMaster.guardianPan;
    // payload["taxStatus"] = shareHolderMaster.taxStatus;
    // payload["statusClaimant"] = shareHolderMaster.statusClaimant;
    // payload["percentageClaimant"] = shareHolderMaster.percentageClaimant;
    // payload["occupationClaimant"] = shareHolderMaster.occupationClaimant;
    // payload["politicalExposureClaimant"] = shareHolderMaster.politicalExposureClaimant;
    // payload["annualIncomeClaimant"] = shareHolderMaster.annualIncomeClaimant;

    // payload["Folio"] = folio.Folio;
    // payload["certificateCount"] = folio.certificate.length;
    // payload["grandTotalNoOfShares"] = folio.certificate.reduce(
    //   (total, item) => total + (Number(item.noOfShares) || 0),
    //   0
    // )
    // payload["certificate"] = folio.certificate.map((item, i) => ({
    //   ...item,
    //   totalFaceValue: item.faceValue,
    //   totalNoOfShares: item.noOfShares,
    //   totalNoOfSharesWords: item.noOfSharesWords,
    //   distinctiveNos: item.distinctiveNosFrom + "-" + item.distinctiveNosTo,
    //   certificateYear: item.dateOfAllotment
    //   ? dayjs(item.dateOfAllotment).format("YYYY")
    //   : "",
    //   index: i + 1,
    // }));
    // payload['combinedTotalNoOfShares'] = folio.certificate.reduce(
    //   (total, item) => total + (Number(item.noOfShares) || 0),
    //   0
    // )
    // payload["combinedTotalNoOfSharesWords"] = numberInWords(
    //   payload["combinedTotalNoOfShares"]
    // )
    // payload["combinedTotalFaceValue"] = folio.certificate.length>0 ? (folio.certificate[0].faceValue ?? 0) : 0;
    // payload["instrumentType"] = folio.shareCertificateMaster!.instrumentType;
    // payload["companyRTA"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.registrarMaster?.registrar_name || "";
    // payload["companyRTAAddress"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.address || "";
    // payload["companyRTAPincode"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.pincode || "";
    // payload["companyCIN"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.CIN || "";
    // payload["companyCity"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.city || "";
    // payload["companyState"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster?.state || "";
    // payload["companyPincode"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster?.pincode || "";
    // payload["companyRegisteredOffice"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster
    //     ?.registeredOffice || "";
    // payload["companyName"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster?.nameChangeMasters[0].currentName ||
    //   "";
    // payload["companyOldName"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster
    //     ?.nameChangeMasters[
    //     (shareHolderMaster.shareCertificateMaster?.companyMaster
    //       ?.nameChangeMasters.length - 1) || 0
    //   ].previousName || "";
    // payload["hasCompanyOldName"] =
    //   typeof shareHolderMaster.shareCertificateMaster?.companyMaster
    //     ?.nameChangeMasters[
    //     shareHolderMaster.shareCertificateMaster?.companyMaster
    //       ?.nameChangeMasters.length - 1 || 0
    //   ].previousName === "string" &&
    //   shareHolderMaster.shareCertificateMaster?.companyMaster
    //     ?.nameChangeMasters[
    //     shareHolderMaster.shareCertificateMaster?.companyMaster
    //       ?.nameChangeMasters.length - 1 || 0
    //   ].previousName !== "";
    // payload["companyOldName2"] =
    //   shareHolderMaster.shareCertificateMaster?.companyMaster
    //     ?.nameChangeMasters[
    //     (shareHolderMaster.shareCertificateMaster?.companyMaster
    //       ?.nameChangeMasters.length - 1) || 0
    //   ].previousName || (shareHolderMaster.shareCertificateMaster?.companyMaster?.nameChangeMasters[0].currentName || "");
    // payload["shareHolderDetails"] = [];
    // if(folio.shareholderName1){
    //   payload["hasShareholder_" + (1)] = true;
    //   payload["namePan_" + (1)] = folio.shareholderName1.namePan;
    //   payload["DPID_" + (1)] = folio.shareholderName1.DPID;
    //   payload["aadhar_" + (1)] = folio.shareholderName1.aadhar;
    //   payload["addressBank_" + (1)] = folio.shareholderName1.addressBank;
    //   payload["addressAadhar_" + (1)] = folio.shareholderName1.addressAadhar;
    //   payload["age_" + (1)] = folio.shareholderName1.age;
    //   payload["bankAccountNo_" + (1)] = folio.shareholderName1.bankAccountNo;
    //   payload["bankAccountType_" + (1)] =
    //     folio.shareholderName1.bankAccountType;
    //   payload["bankAddress_" + (1)] = folio.shareholderName1.bankAddress;
    //   payload["bankEmail_" + (1)] = folio.shareholderName1.bankEmail;
    //   payload["bankIFS_" + (1)] = folio.shareholderName1.bankIFS;
    //   payload["bankMICR_" + (1)] = folio.shareholderName1.bankMICR;
    //   payload["bankName_" + (1)] = folio.shareholderName1.bankName;
    //   payload["bankPhone_" + (1)] = folio.shareholderName1.bankPhone;
    //   payload["city_" + (1)] = folio.shareholderName1.city;
    //   payload["countryOfBirth_" + (1)] =
    //     folio.shareholderName1.countryOfBirth;
    //   payload["dematAccountNo_" + (1)] =
    //     folio.shareholderName1.dematAccountNo;
    //   payload["dob_" + 1] = folio.shareholderName1
    //     .dob
    //     ? dayjs(folio.shareholderName1.dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_" + (1)] = folio.shareholderName1.email;
    //   payload["emailBank_" + (1)] = folio.shareholderName1.emailBank;
    //   payload["nameAadhar_" + (1)] = folio.shareholderName1.nameAadhar;
    //   payload["nameBank_" + (1)] = folio.shareholderName1.nameBank;
    //   payload["nameCml_" + (1)] = folio.shareholderName1.nameCml;
    //   payload["namePan_" + (1)] = folio.shareholderName1.namePan;
    //   payload["nationality_" + (1)] = folio.shareholderName1.nationality;
    //   payload["pan_" + (1)] = folio.shareholderName1.pan;
    //   payload["phone_" + (1)] = folio.shareholderName1.phone;
    //   payload["phoneBank_" + (1)] = folio.shareholderName1.phoneBank;
    //   payload["pincodeBank_" + (1)] = folio.shareholderName1.pincodeBank;
    //   payload["placeOfBirth_" + (1)] = folio.shareholderName1.placeOfBirth;
    //   payload["husbandName_" + 1] = folio.shareholderName1.husbandName;
    //   payload["occupation_" + 1] = folio.shareholderName1.occupation;
    //   payload["branchName_" + 1] = folio.shareholderName1.branchName;
    //   payload["accountOpeningDate_" + 1] =
    //     folio.shareholderName1.accountOpeningDate ? dayjs(folio.shareholderName1.accountOpeningDate).format("DD-MM-YYYY") : "";
    //   payload["shareholderName_" + (1)] =
    //     folio.shareholderName1.shareholderName;
    //   payload["state_" + (1)] = folio.shareholderName1.state;
    //   payload["shareholderNameCertificate_" + 1] =
    //     folio.certificate.length > 0
    //       ? (folio.certificate[folio.certificate.length-1].shareholderName1Txt || "")
    //       : "";
    //   payload["shareHolderDetails"] = [
    //     {
    //       ...folio.shareholderName1,
    //       shareholderNameCertificate:
    //         folio.certificate.length > 0
    //           ? folio.certificate[folio.certificate.length - 1]
    //               .shareholderName1Txt || ""
    //           : "",
    //       index: 1,
    //     },
    //     ...payload["shareHolderDetails"],
    //   ];
    // }else{
    //   payload["hasShareholder_" + (1)] = false;
    // }
    // if(folio.shareholderName2){
    //   payload["hasShareholder_" + (2)] = true;
    //   payload["namePan_" + (2)] = folio.shareholderName2.namePan;
    //   payload["DPID_" + (2)] = folio.shareholderName2.DPID;
    //   payload["aadhar_" + (2)] = folio.shareholderName2.aadhar;
    //   payload["addressBank_" + (2)] = folio.shareholderName2.addressBank;
    //   payload["addressAadhar_" + (2)] = folio.shareholderName2.addressAadhar;
    //   payload["age_" + (2)] = folio.shareholderName2.age;
    //   payload["bankAccountNo_" + (2)] = folio.shareholderName2.bankAccountNo;
    //   payload["bankAccountType_" + (2)] =
    //     folio.shareholderName2.bankAccountType;
    //   payload["bankAddress_" + (2)] = folio.shareholderName2.bankAddress;
    //   payload["bankEmail_" + (2)] = folio.shareholderName2.bankEmail;
    //   payload["bankIFS_" + (2)] = folio.shareholderName2.bankIFS;
    //   payload["bankMICR_" + (2)] = folio.shareholderName2.bankMICR;
    //   payload["bankName_" + (2)] = folio.shareholderName2.bankName;
    //   payload["bankPhone_" + (2)] = folio.shareholderName2.bankPhone;
    //   payload["city_" + (2)] = folio.shareholderName2.city;
    //   payload["countryOfBirth_" + (2)] =
    //     folio.shareholderName2.countryOfBirth;
    //   payload["dematAccountNo_" + (2)] =
    //     folio.shareholderName2.dematAccountNo;
    //   payload["dob_" + 2] = folio.shareholderName2.dob
    //     ? dayjs(folio.shareholderName2.dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_" + (2)] = folio.shareholderName2.email;
    //   payload["emailBank_" + (2)] = folio.shareholderName2.emailBank;
    //   payload["nameAadhar_" + (2)] = folio.shareholderName2.nameAadhar;
    //   payload["nameBank_" + (2)] = folio.shareholderName2.nameBank;
    //   payload["nameCml_" + (2)] = folio.shareholderName2.nameCml;
    //   payload["namePan_" + (2)] = folio.shareholderName2.namePan;
    //   payload["nationality_" + (2)] = folio.shareholderName2.nationality;
    //   payload["pan_" + (2)] = folio.shareholderName2.pan;
    //   payload["phone_" + (2)] = folio.shareholderName2.phone;
    //   payload["phoneBank_" + (2)] = folio.shareholderName2.phoneBank;
    //   payload["pincodeBank_" + (2)] = folio.shareholderName2.pincodeBank;
    //   payload["placeOfBirth_" + (2)] = folio.shareholderName2.placeOfBirth;
    //   payload["husbandName_" + 2] = folio.shareholderName2.husbandName;
    //   payload["occupation_" + 2] = folio.shareholderName2.occupation;
    //   payload["branchName_" + 2] = folio.shareholderName2.branchName;
    //   payload["accountOpeningDate_" + 2] = folio.shareholderName2
    //     .accountOpeningDate
    //     ? dayjs(folio.shareholderName2.accountOpeningDate).format("DD-MM-YYYY")
    //     : "";
    //   payload["shareholderName_" + (2)] =
    //     folio.shareholderName2.shareholderName;
    //   payload["state_" + (2)] = folio.shareholderName2.state;
    //   payload["shareholderNameCertificate_" + 2] =
    //     folio.certificate.length > 0
    //       ? folio.certificate[folio.certificate.length - 1]
    //           .shareholderName2Txt || ""
    //       : "";
    //   payload["shareHolderDetails"] = [
    //     {
    //       ...folio.shareholderName2,
    //       shareholderNameCertificate:
    //         folio.certificate.length > 0
    //           ? folio.certificate[folio.certificate.length - 1]
    //               .shareholderName2Txt || ""
    //           : "",
    //       index: 2
    //     },
    //     ...payload["shareHolderDetails"],
    //   ];
    // }else{
    //   payload["hasShareholder_" + (2)] = false;
    // }
    // if(folio.shareholderName3){
    //   payload["hasShareholder_" + (3)] = true;
    //   payload["namePan_" + (3)] = folio.shareholderName3.namePan;
    //   payload["DPID_" + (3)] = folio.shareholderName3.DPID;
    //   payload["aadhar_" + (3)] = folio.shareholderName3.aadhar;
    //   payload["addressBank_" + (3)] = folio.shareholderName3.addressBank;
    //   payload["addressAadhar_" + (3)] = folio.shareholderName3.addressAadhar;
    //   payload["age_" + (3)] = folio.shareholderName3.age;
    //   payload["bankAccountNo_" + (3)] = folio.shareholderName3.bankAccountNo;
    //   payload["bankAccountType_" + (3)] =
    //     folio.shareholderName3.bankAccountType;
    //   payload["bankAddress_" + (3)] = folio.shareholderName3.bankAddress;
    //   payload["bankEmail_" + (3)] = folio.shareholderName3.bankEmail;
    //   payload["bankIFS_" + (3)] = folio.shareholderName3.bankIFS;
    //   payload["bankMICR_" + (3)] = folio.shareholderName3.bankMICR;
    //   payload["bankName_" + (3)] = folio.shareholderName3.bankName;
    //   payload["bankPhone_" + (3)] = folio.shareholderName3.bankPhone;
    //   payload["city_" + (3)] = folio.shareholderName3.city;
    //   payload["countryOfBirth_" + (3)] =
    //     folio.shareholderName3.countryOfBirth;
    //   payload["dematAccountNo_" + (3)] =
    //     folio.shareholderName3.dematAccountNo;
    //   payload["dob_" + 3] = folio.shareholderName3.dob
    //     ? dayjs(folio.shareholderName3.dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_" + (3)] = folio.shareholderName3.email;
    //   payload["emailBank_" + (3)] = folio.shareholderName3.emailBank;
    //   payload["nameAadhar_" + (3)] = folio.shareholderName3.nameAadhar;
    //   payload["nameBank_" + (3)] = folio.shareholderName3.nameBank;
    //   payload["nameCml_" + (3)] = folio.shareholderName3.nameCml;
    //   payload["namePan_" + (3)] = folio.shareholderName3.namePan;
    //   payload["nationality_" + (3)] = folio.shareholderName3.nationality;
    //   payload["pan_" + (3)] = folio.shareholderName3.pan;
    //   payload["phone_" + (3)] = folio.shareholderName3.phone;
    //   payload["phoneBank_" + (3)] = folio.shareholderName3.phoneBank;
    //   payload["pincodeBank_" + (3)] = folio.shareholderName3.pincodeBank;
    //   payload["placeOfBirth_" + (3)] = folio.shareholderName3.placeOfBirth;
    //   payload["husbandName_" + 3] = folio.shareholderName3.husbandName;
    //   payload["occupation_" + 3] = folio.shareholderName3.occupation;
    //   payload["branchName_" + 3] = folio.shareholderName3.branchName;
    //   payload["accountOpeningDate_" + 3] = folio.shareholderName3
    //     .accountOpeningDate
    //     ? dayjs(folio.shareholderName3.accountOpeningDate).format("DD-MM-YYYY")
    //     : "";
    //   payload["shareholderName_" + (3)] =
    //     folio.shareholderName3.shareholderName;
    //   payload["state_" + (3)] = folio.shareholderName3.state;
    //   payload["shareholderNameCertificate_" + 3] =
    //     folio.certificate.length > 0
    //       ? folio.certificate[folio.certificate.length - 1]
    //           .shareholderName3Txt || ""
    //       : "";
    //   payload["shareHolderDetails"] = [
    //     {
    //       ...folio.shareholderName3,
    //       shareholderNameCertificate:
    //         folio.certificate.length > 0
    //           ? folio.certificate[folio.certificate.length - 1]
    //               .shareholderName3Txt || ""
    //           : "",
    //       index: 3
    //     },
    //     ...payload["shareHolderDetails"],
    //   ];
    // }else{
    //   payload["hasShareholder_" + (3)] = false;
    // }
    // payload["legalHeirDetails"] = legalHeirDetails.map((item) => ({
    //   ...item,
    //   dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
    //   accountOpeningDate: item.accountOpeningDate ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY") : "",
    // }));
    // payload["clamaints"] = clamaints.map((item, i) => ({
    //   ...item,
    //   dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : "",
    //   accountOpeningDate: item.accountOpeningDate
    //     ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
    //     : "",
    //   index: i + 1,
    // }));
    // if (clamaints.length > 0) {
    //   payload["hasClamaint"] = true;
    //   payload["namePan_clamaints"] = clamaints[0].namePan;
    //   payload["DPID_clamaints"] = clamaints[0].DPID;
    //   payload["aadhar_clamaints"] = clamaints[0].aadhar;
    //   payload["addressBank_clamaints"] = clamaints[0].addressBank;
    //   payload["addressAadhar_clamaints"] = clamaints[0].addressAadhar;
    //   payload["age_clamaints"] = clamaints[0].age;
    //   payload["bankAccountNo_clamaints"] = clamaints[0].bankAccountNo;
    //   payload["bankAccountType_clamaints"] = clamaints[0].bankAccountType;
    //   payload["bankAddress_clamaints"] = clamaints[0].bankAddress;
    //   payload["bankEmail_clamaints"] = clamaints[0].bankEmail;
    //   payload["bankIFS_clamaints"] = clamaints[0].bankIFS;
    //   payload["bankMICR_clamaints"] = clamaints[0].bankMICR;
    //   payload["bankName_clamaints"] = clamaints[0].bankName;
    //   payload["bankPhone_clamaints"] = clamaints[0].bankPhone;
    //   payload["city_clamaints"] = clamaints[0].city;
    //   payload["countryOfBirth_clamaints"] = clamaints[0].countryOfBirth;
    //   payload["dematAccountNo_clamaints"] = clamaints[0].dematAccountNo;
    //   payload["dob_clamaints"] = clamaints[0].dob
    //     ? dayjs(clamaints[0].dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_clamaints"] = clamaints[0].email;
    //   payload["emailBank_clamaints"] = clamaints[0].emailBank;
    //   payload["nameAadhar_clamaints"] = clamaints[0].nameAadhar;
    //   payload["nameBank_clamaints"] = clamaints[0].nameBank;
    //   payload["nameCml_clamaints"] = clamaints[0].nameCml;
    //   payload["namePan_clamaints"] = clamaints[0].namePan;
    //   payload["nationality_clamaints"] = clamaints[0].nationality;
    //   payload["pan_clamaints"] = clamaints[0].pan;
    //   payload["phone_clamaints"] = clamaints[0].phone;
    //   payload["phoneBank_clamaints"] = clamaints[0].phoneBank;
    //   payload["pincodeBank_clamaints"] = clamaints[0].pincodeBank;
    //   payload["placeOfBirth_clamaints"] = clamaints[0].placeOfBirth;
    //   payload["husbandName_clamaints"] = clamaints[0].husbandName;
    //   payload["occupation_clamaints"] = clamaints[0].occupation;
    //   payload["branchName_clamaints"] = clamaints[0].branchName;
    //   payload["accountOpeningDate_clamaints"] = clamaints[0]
    //     .accountOpeningDate
    //     ? dayjs(clamaints[0].accountOpeningDate).format("DD-MM-YYYY")
    //     : "";
    //   payload["state_clamaints"] = clamaints[0].state;
    // } else {
    //   payload["hasClamaint"] = false;
    // }
    // if (clamaints.length >= 2) {
    //   payload["hasClamaint_1"] = true;
    //   payload["namePan_clamaints_1"] = clamaints[1].namePan;
    //   payload["DPID_clamaints_1"] = clamaints[1].DPID;
    //   payload["aadhar_clamaints_1"] = clamaints[1].aadhar;
    //   payload["addressBank_clamaints_1"] = clamaints[1].addressBank;
    //   payload["addressAadhar_clamaints_1"] = clamaints[1].addressAadhar;
    //   payload["age_clamaints_1"] = clamaints[1].age;
    //   payload["bankAccountNo_clamaints_1"] = clamaints[1].bankAccountNo;
    //   payload["bankAccountType_clamaints_1"] = clamaints[1].bankAccountType;
    //   payload["bankAddress_clamaints_1"] = clamaints[1].bankAddress;
    //   payload["bankEmail_clamaints_1"] = clamaints[1].bankEmail;
    //   payload["bankIFS_clamaints_1"] = clamaints[1].bankIFS;
    //   payload["bankMICR_clamaints_1"] = clamaints[1].bankMICR;
    //   payload["bankName_clamaints_1"] = clamaints[1].bankName;
    //   payload["bankPhone_clamaints_1"] = clamaints[1].bankPhone;
    //   payload["city_clamaints_1"] = clamaints[1].city;
    //   payload["countryOfBirth_clamaints_1"] = clamaints[1].countryOfBirth;
    //   payload["dematAccountNo_clamaints_1"] = clamaints[1].dematAccountNo;
    //   payload["dob_clamaints_1"] = clamaints[1].dob
    //     ? dayjs(clamaints[1].dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_clamaints_1"] = clamaints[1].email;
    //   payload["emailBank_clamaints_1"] = clamaints[1].emailBank;
    //   payload["nameAadhar_clamaints_1"] = clamaints[1].nameAadhar;
    //   payload["nameBank_clamaints_1"] = clamaints[1].nameBank;
    //   payload["nameCml_clamaints_1"] = clamaints[1].nameCml;
    //   payload["namePan_clamaints_1"] = clamaints[1].namePan;
    //   payload["nationality_clamaints_1"] = clamaints[1].nationality;
    //   payload["pan_clamaints_1"] = clamaints[1].pan;
    //   payload["phone_clamaints_1"] = clamaints[1].phone;
    //   payload["phoneBank_clamaints_1"] = clamaints[1].phoneBank;
    //   payload["pincodeBank_clamaints_1"] = clamaints[1].pincodeBank;
    //   payload["placeOfBirth_clamaints_1"] = clamaints[1].placeOfBirth;
    //   payload["husbandName_clamaints_1"] = clamaints[1].husbandName;
    //   payload["occupation_clamaints_1"] = clamaints[1].occupation;
    //   payload["branchName_clamaints_1"] = clamaints[1].branchName;
    //   payload["accountOpeningDate_clamaints_1"] = clamaints[1]
    //     .accountOpeningDate
    //     ? dayjs(clamaints[1].accountOpeningDate).format("DD-MM-YYYY")
    //     : "";
    //   payload["state_clamaints_1"] = clamaints[1].state;
    // } else {
    //   payload["hasClamaint_1"] = false;
    // }
    // if (clamaints.length >= 3) {
    //   payload["hasClamaint_2"] = true;
    //   payload["namePan_clamaints_2"] = clamaints[2].namePan;
    //   payload["DPID_clamaints_2"] = clamaints[2].DPID;
    //   payload["aadhar_clamaints_2"] = clamaints[2].aadhar;
    //   payload["addressBank_clamaints_2"] = clamaints[2].addressBank;
    //   payload["addressAadhar_clamaints_2"] = clamaints[2].addressAadhar;
    //   payload["age_clamaints_2"] = clamaints[2].age;
    //   payload["bankAccountNo_clamaints_2"] = clamaints[2].bankAccountNo;
    //   payload["bankAccountType_clamaints_2"] = clamaints[2].bankAccountType;
    //   payload["bankAddress_clamaints_2"] = clamaints[2].bankAddress;
    //   payload["bankEmail_clamaints_2"] = clamaints[2].bankEmail;
    //   payload["bankIFS_clamaints_2"] = clamaints[2].bankIFS;
    //   payload["bankMICR_clamaints_2"] = clamaints[2].bankMICR;
    //   payload["bankName_clamaints_2"] = clamaints[2].bankName;
    //   payload["bankPhone_clamaints_2"] = clamaints[2].bankPhone;
    //   payload["city_clamaints_2"] = clamaints[2].city;
    //   payload["countryOfBirth_clamaints_2"] = clamaints[2].countryOfBirth;
    //   payload["dematAccountNo_clamaints_2"] = clamaints[2].dematAccountNo;
    //   payload["dob_clamaints_2"] = clamaints[2].dob
    //     ? dayjs(clamaints[2].dob).format("DD-MM-YYYY")
    //     : "";
    //   payload["email_clamaints_2"] = clamaints[2].email;
    //   payload["emailBank_clamaints_2"] = clamaints[2].emailBank;
    //   payload["nameAadhar_clamaints_2"] = clamaints[2].nameAadhar;
    //   payload["nameBank_clamaints_2"] = clamaints[2].nameBank;
    //   payload["nameCml_clamaints_2"] = clamaints[2].nameCml;
    //   payload["namePan_clamaints_2"] = clamaints[2].namePan;
    //   payload["nationality_clamaints_2"] = clamaints[2].nationality;
    //   payload["pan_clamaints_2"] = clamaints[2].pan;
    //   payload["phone_clamaints_2"] = clamaints[2].phone;
    //   payload["phoneBank_clamaints_2"] = clamaints[2].phoneBank;
    //   payload["pincodeBank_clamaints_2"] = clamaints[2].pincodeBank;
    //   payload["placeOfBirth_clamaints_2"] = clamaints[2].placeOfBirth;
    //   payload["husbandName_clamaints_2"] = clamaints[2].husbandName;
    //   payload["occupation_clamaints_2"] = clamaints[2].occupation;
    //   payload["branchName_clamaints_2"] = clamaints[2].branchName;
    //   payload["accountOpeningDate_clamaints_2"] = clamaints[2]
    //     .accountOpeningDate
    //     ? dayjs(clamaints[2].accountOpeningDate).format("DD-MM-YYYY")
    //     : "";
    //   payload["state_clamaints_2"] = clamaints[2].state;
    // } else {
    //   payload["hasClamaint_2"] = false;
    // }
    // payload["non_clamaints"] = legalHeirDetails
    //   .filter((itmm) => clamaints.map((i) => i.id).includes(itmm.id) === false)
    //   .map((itmm, i) => ({
    //     ...itmm,
    //     dob: itmm.dob ? dayjs(itmm.dob).format("DD-MM-YYYY") : "",
    //     accountOpeningDate: itmm.accountOpeningDate
    //       ? dayjs(itmm.accountOpeningDate).format("DD-MM-YYYY")
    //       : "",
    //     index: i + 1,
    //   }));
    // payload["survivors"] = payload["shareHolderDetails"]
    //   .filter((itmm) => itmm.id !== payload["deadShareholder"]?.id)
    //   .map((itmm, i) => ({
    //     ...itmm,
    //     dob: itmm.dob ? dayjs(itmm.dob).format("DD-MM-YYYY") : "",
    //     accountOpeningDate: itmm.accountOpeningDate
    //       ? dayjs(itmm.accountOpeningDate).format("DD-MM-YYYY")
    //       : "",
    //     index: i + 1,
    //   }));
    mainData.push(payload);
  });

  const caseType = {
    Claim: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Affidavit",
    ],
    ClaimTransposition: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Affidavit",
    ],
    ClaimIssueDuplicate: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Form_A_Duplicate",
      "Form_B_Duplicate",
      "Affidavit",
    ],
    Transmission: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "ISR5",
      "form_no_sh_13",
      "Form_SH_14",
      "Annexure_D",
      "Annexure_E",
      "Annexure_F",
      "Affidavit",
    ],
    TransmissionIssueDuplicate: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "ISR5",
      "form_no_sh_13",
      "Form_SH_14",
      "Form_A_Duplicate",
      "Form_B_Duplicate",
      "Annexure_D",
      "Annexure_E",
      "Annexure_F",
      "Affidavit",
    ],
    TransmissionIssueDuplicateTransposition: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "ISR5",
      "form_no_sh_13",
      "Form_SH_14",
      "Form_A_Duplicate",
      "Form_B_Duplicate",
      "Annexure_D",
      "Annexure_E",
      "Annexure_F",
      "Affidavit",
    ],
    Deletion: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Deletion",
    ],
    DeletionIssueDuplicate: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Deletion",
      "Form_A_Duplicate",
      "Form_B_Duplicate",
      "Affidavit",
    ],
    DeletionIssueDuplicateTransposition: [
      "ISR1",
      "ISR2",
      "ISR3",
      "ISR4",
      "form_no_sh_13",
      "Form_SH_14",
      "Deletion",
      "Form_A_Duplicate",
      "Form_B_Duplicate",
      "Annexure_D",
      "Annexure_E",
      "Annexure_F",
      "Affidavit",
    ],
  };

  const folderName = "doc_" + id + "_" + Date.now();

  const folderPath = path.resolve(
    __dirname,
    "../../../static/word_output/" + folderName
  );
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  for (const [index, item] of mainData.entries()) {
    const folioFolderName = item.Folio.replace(/\//g, "_");

    const folioFolderPath = path.resolve(
      __dirname,
      `../../../static/word_output/${folderName}/${folioFolderName}`
    );

    if (!fs.existsSync(folioFolderPath)) {
      fs.mkdirSync(folioFolderPath);
    }

    const data = { ...item };

    for (const casee of caseType[item.Case]) {
      if (casee === "ISR2") {
        if (item.Case.includes("Transmission")) {
          for (let idx = 0; idx < item.isr2_clamaints.length; idx++) {
            const i = item.isr2_clamaints[idx];
            const wordOutputPath = path.resolve(
              __dirname,
              folioFolderPath + "/" + casee + "_" + (idx + 1) + ".docx"
            );
            await generateISR2Doc(i, wordOutputPath);
          }
        } else {
          const wordOutputPath = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
          );
          await generateISR2Doc(data, wordOutputPath);
        }
      } 
      else if (casee === "ISR3") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateISR3Doc(data, wordOutputPath);
      } else if (casee === "ISR4") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateISR4Doc(data, wordOutputPath);
      } 
      else if (casee === "Annexure_D") {
        for (let idx = 0; idx < item.legalHeirDetails.length; idx++) {
          const i = item.legalHeirDetails[idx];
          const wordOutputPath = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee + "_" + (idx + 1) + ".docx"
          );
          await generateAnnexureDDoc(
            {
              namePan: i.namePan,
              deceasedRelationship: i.deceasedRelationship,
              addressAadhar: i.addressAadhar,
              pincodeBank: i.pincodeBank,
              shareholderNameDeath: item.shareholderNameDeath,
              companyName: item.companyName,
              companyOldName: item.companyOldName,
              certificate: item.certificate,
              legalHeirDetails: item.legalHeirDetails,
            },
            wordOutputPath
          );
        }
      } 
      else if (casee === "form_no_sh_13") {
        for (let idx = 0; idx < item.nominations.length; idx++) {
          const i = item.nominations[idx];
          const wordOutputPath = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee + "_" + (idx + 1) + ".docx"
          );
          await generateFormSH13Doc(
            {
              ...i,
              fullName: i.fullName ? i.fullName : "",
              address: i.address ? i.address : "",
              dobMinor: i.dobMinor ? i.dobMinor : "",
              fatherName: i.fatherName ? i.fatherName : "",
              occupation: i.occupation ? i.occupation : "",
              nationality: i.nationality ? i.nationality : "",
              email: i.email ? i.email : "",
              pan: i.pan ? i.pan : "",
              mobile: i.mobile ? i.mobile : "",
              relationship: i.relationship ? i.relationship : "",
              dateMajority: i.dateMajority ? i.dateMajority : "",
              gurdianName: i.gurdianName ? i.gurdianName : "",
              gurdianAddress: i.gurdianAddress ? i.gurdianAddress : "",
              deceasedName: i.deceasedName ? i.deceasedName : "",
              dobDeceased: i.dobDeceased ? i.dobDeceased : "",
              deceasedFatherName: i.deceasedFatherName
                ? i.deceasedFatherName
                : "",
              deceasedOccupation: i.deceasedOccupation
                ? i.deceasedOccupation
                : "",
              deceasedNationality: i.deceasedNationality
                ? i.deceasedNationality
                : "",
              deceasedAddress: i.deceasedAddress ? i.deceasedAddress : "",
              deceasedEmail: i.deceasedEmail ? i.deceasedEmail : "",
              deceasedPan: i.deceasedPan ? i.deceasedPan : "",
              deceasedRelationship: i.deceasedRelationship
                ? i.deceasedRelationship
                : "",
              deceasedRelationshipMinor: i.deceasedRelationshipMinor
                ? i.deceasedRelationshipMinor
                : "",
              certificate: item.certificate,
              declaration: item.declaration,
              companyName: item.companyName,
              companyOldName: item.companyOldName,
              companyCity: item.companyCity,
              companyState: item.companyState,
              companyPincode: item.companyPincode,
              companyRegisteredOffice: item.companyRegisteredOffice,
              shareholderCertificateNames: item.shareholderCertificateNames,
              Folio: item.Folio,
            },
            wordOutputPath
          );
        }
      } 
      else if (casee === "Form_SH_14") {
        for (let idx = 0; idx < item.nominations.length; idx++) {
          const i = item.nominations[idx];
          const wordOutputPath = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee + "_" + (idx + 1) + ".docx"
          );
          await generateFormSH14Doc(
            {
              ...i,
              fullName: i.fullName ? i.fullName : "",
              address: i.address ? i.address : "",
              dobMinor: i.dobMinor ? i.dobMinor : "",
              fatherName: i.fatherName ? i.fatherName : "",
              occupation: i.occupation ? i.occupation : "",
              nationality: i.nationality ? i.nationality : "",
              email: i.email ? i.email : "",
              pan: i.pan ? i.pan : "",
              relationship: i.relationship ? i.relationship : "",
              dateMajority: i.dateMajority ? i.dateMajority : "",
              gurdianName: i.gurdianName ? i.gurdianName : "",
              gurdianAddress: i.gurdianAddress ? i.gurdianAddress : "",
              deceasedName: i.deceasedName ? i.deceasedName : "",
              dobDeceased: i.dobDeceased ? i.dobDeceased : "",
              deceasedFatherName: i.deceasedFatherName
                ? i.deceasedFatherName
                : "",
              deceasedOccupation: i.deceasedOccupation
                ? i.deceasedOccupation
                : "",
              deceasedNationality: i.deceasedNationality
                ? i.deceasedNationality
                : "",
              deceasedAddress: i.deceasedAddress ? i.deceasedAddress : "",
              deceasedEmail: i.deceasedEmail ? i.deceasedEmail : "",
              deceasedPan: i.deceasedPan ? i.deceasedPan : "",
              deceasedRelationship: i.deceasedRelationship
                ? i.deceasedRelationship
                : "",
              deceasedRelationshipMinor: i.deceasedRelationshipMinor
                ? i.deceasedRelationshipMinor
                : "",
              certificate: item.certificate,
              declaration: item.declaration,
              companyName: item.companyName,
              companyOldName: item.companyOldName,
              companyCity: item.companyCity,
              companyState: item.companyState,
              companyPincode: item.companyPincode,
              companyRegisteredOffice: item.companyRegisteredOffice,
            },
            wordOutputPath
          );
        }
      } 
      else if (casee === "ISR5") {
        for (let idx = 0; idx < item.clamaints.length; idx++) {
          const i = item.clamaints[idx];
          const wordOutputPath = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee + "_" + (idx + 1) + ".docx"
          );
          await generateISR5Doc(
            {
              ...i,
              certificate: item.certificate,
              companyName: item.companyName,
              companyOldName: item.companyOldName,
              companyRTA: item.companyRTA,
              companyRTAAddress: item.companyRTAAddress,
              companyRTAPincode: item.companyRTAPincode,
              isMinor: item.isMinor,
              guardianName: item.guardianName,
              dobMinor: item.dobMinor,
              shareholderNameDeath: item.shareholderNameDeath,
              dod: item.dod,
              Folio: item.Folio,
              percentageClaimant: item.percentageClaimant,
            },
            wordOutputPath
          );
        }
      } 
      else if (casee === "Annexure_E") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateAnnexureEDoc(data, wordOutputPath);
      } else if (casee === "Annexure_F") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateAnnexureFDoc(data, wordOutputPath);
      } else if (casee === "Deletion") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateDeletionDoc(data, wordOutputPath);
      } else if (casee === "ISR1") {
        const wordOutputPath = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee + "_" + (index + 1) + ".docx"
        );
        await generateISR1Doc(data, wordOutputPath);
      }
    }
  }

  const folderZip = new AdmZip();
  folderZip.addLocalFolder(folderPath);
  console.log("zipping folder")
  await folderZip.writeZipPromise(
    path.resolve(
      __dirname,
      "../../../static/word_output/" + folderName + ".zip"
    )
  );
  console.log("zipping folder done");
  fs.rm(folderPath, { recursive: true }, (err) => {});

  return path.resolve(
    __dirname,
    "../../../static/word_output/" + folderName + ".zip"
  );

  // generateISR1Doc();
  // generateISR2Doc();
  // generateISR3Doc();
  // generateISR4Doc();
  // generateISR5Doc();
  // generateSuretyDoc();
  // generateDeletionDoc();
  // generateAnnexureDDoc();
  // generateAnnexureEDoc();
  // generateAnnexureFDoc();
  // generateAffidavitDoc();
  // generateAffidavit2Doc();
  // generateFormADoc();
  // generateFormBDoc();
  // generateFormSH13Doc();
  // generateFormSH14Doc();
  return "";
}