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

import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import AdmZip from "adm-zip";
import { NameChangeMasterColumn } from "../company_master/company_master.model";
import dayjs from "dayjs";
import { LegalHeirDetailType } from "../../@types/legal_heir_detail.type";

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
  }
> {
  const { id } = params;
  let foliosSet: FolioType[] = [];
  let clamaints: LegalHeirDetailType[] = [];
  let affidavitShareholders: ShareHolderDetailType[] =
    [];
  let affidavitLegalHeirs: LegalHeirDetailType[] = [];
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


export async function generateDoc(
  params: GetIdParam
): Promise<string> {
  const { id } = params;

  const folderName = "doc_" + id + "_" + Date.now();

  const folderPath = path.resolve(
    __dirname,
    "../../../static/word_output/" + folderName
  );
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  
  const shareHolderMaster = await prisma.case.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      shareCertificateMaster: {
        include:{
          companyMaster: {
            include:{
              registrarMasterBranch: {
                include:{
                  registrarMaster: true
                }
              },
              nameChangeMasters: {
                select: NameChangeMasterColumn,
                orderBy: {
                  id: "desc",
                },
                take: 1,
              },
            }
          }
        }
      }
    }
  });
  
  if (!shareHolderMaster) {
    throw new NotFoundError();
  }

  let foliosSet: FolioType[] = [];
  let clamaints: LegalHeirDetailType[] = [];
  let affidavitShareholders: ShareHolderDetailType[] = [];
  let affidavitLegalHeirs: LegalHeirDetailType[] = [];
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
          equityType: true,
          Folio: true,
          certificateNumber: true,
          certificateSerialNumber: true,
          shareholderName1ID: true,
          shareholderName2ID: true,
          shareholderName3ID: true,
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
          shareholderName1: true,
          shareholderName2: true,
          shareholderName3: true,
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

  const legalHeirDetails = await prisma.legalHeirDetail.findMany({
    where: {
      projectID: shareHolderMaster.shareCertificateMaster?.projectID
    },
  })

  const mainData: any[] = [];
  foliosSet.forEach((folio) => {
    const payload: any = {};
    payload["Case"] = shareHolderMaster.caseType;
    payload["allowAffidavit"] =
      shareHolderMaster.allowAffidavit === "Yes" ? true : false;
    payload["affidavits"] = affidavitShareholders.map((item) => ({
      ...item,
      dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : null,
      accountOpeningDate: item.accountOpeningDate
        ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
        : null,
    }));
    payload["affidavitLegalHeirs"] = affidavitLegalHeirs.map((item) => ({
      ...item,
      dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : null,
      accountOpeningDate: item.accountOpeningDate
        ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
        : null,
    }));
    payload["isDeceased"] = shareHolderMaster.isDeceased==="Yes" ? true : false;
    payload["shareholderNameDeath"] = shareHolderMaster.shareholderNameDeath;
    payload["deceasedRelationship"] = shareHolderMaster.deceasedRelationship;
    payload["placeOfDeath"] = shareHolderMaster.placeOfDeath;
    payload["dod"] = shareHolderMaster.dod
      ? dayjs(shareHolderMaster.dod).format("DD-MM-YYYY")
      : null;
    payload["isTestate"] = shareHolderMaster.isTestate==="Yes" ? true : false;
    payload["isInTestate"] = shareHolderMaster.isTestate==="No" ? true : false;
    payload["isMinor"] = shareHolderMaster.isMinor==="Yes" ? true : false;
    payload["dobMinor"] = shareHolderMaster.dobMinor
      ? dayjs(shareHolderMaster.dobMinor).format("DD-MM-YYYY")
      : null;
    payload["guardianName"] = shareHolderMaster.guardianName;
    payload["guardianRelationship"] = shareHolderMaster.guardianRelationship;
    payload["guardianPan"] = shareHolderMaster.guardianPan;
    payload["taxStatus"] = shareHolderMaster.taxStatus;
    payload["statusClaimant"] = shareHolderMaster.statusClaimant;
    payload["percentageClaimant"] = shareHolderMaster.percentageClaimant;
    payload["occupationClaimant"] = shareHolderMaster.occupationClaimant;
    payload["politicalExposureClaimant"] = shareHolderMaster.politicalExposureClaimant;
    payload["annualIncomeClaimant"] = shareHolderMaster.annualIncomeClaimant;


    payload["equityType"] = folio.equityType;
    payload["Folio"] = folio.Folio;
    payload["totalFaceValue"] = folio.faceValue;
    payload["totalNoOfShares"] = folio.noOfShares;
    payload["totalNoOfSharesWords"] = folio.noOfSharesWords;
    payload["certificateNumber"] = folio.certificateNumber;
    payload["certificateSerialNumber"] = folio.certificateSerialNumber;
    payload["distinctiveNosFrom"] = folio.distinctiveNosFrom;
    payload["distinctiveNosTo"] = folio.distinctiveNosTo;
    payload["distinctiveNos"] =
      folio.distinctiveNosFrom + "-" + folio.distinctiveNosTo;
    payload["certificateYear"] = folio.dateOfAllotment
      ? dayjs(folio.dateOfAllotment).format("YYYY")
      : null;
    payload["instrumentType"] = folio.shareCertificateMaster!.instrumentType;
    payload["companyRTA"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.registrarMaster?.registrar_name || null;
    payload["companyRTAAddress"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.address || null;
    payload["companyRTAPincode"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.registrarMasterBranch?.pincode || null;
    payload["companyCIN"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.CIN || null;
    payload["companyCity"] = shareHolderMaster.shareCertificateMaster?.companyMaster?.city || null;
    payload["companyState"] =
      shareHolderMaster.shareCertificateMaster?.companyMaster?.state || null;
    payload["companyPincode"] =
      shareHolderMaster.shareCertificateMaster?.companyMaster?.pincode || null;
    payload["companyName"] =
      shareHolderMaster.shareCertificateMaster?.companyMaster?.nameChangeMasters[0].currentName ||
      null;
    payload["shareHolderDetails"] = [];
    if(folio.shareholderName1){
      payload["shareHolderDetails"] = [folio.shareholderName1, ...payload["shareHolderDetails"]];
      payload["hasShareholder_" + (1)] = true;
      payload["namePan_" + (1)] = folio.shareholderName1.namePan;
      payload["DPID_" + (1)] = folio.shareholderName1.DPID;
      payload["aadhar_" + (1)] = folio.shareholderName1.aadhar;
      payload["addressBank_" + (1)] = folio.shareholderName1.addressBank;
      payload["age_" + (1)] = folio.shareholderName1.age;
      payload["bankAccountNo_" + (1)] = folio.shareholderName1.bankAccountNo;
      payload["bankAccountType_" + (1)] =
        folio.shareholderName1.bankAccountType;
      payload["bankAddress_" + (1)] = folio.shareholderName1.bankAddress;
      payload["bankEmail_" + (1)] = folio.shareholderName1.bankEmail;
      payload["bankIFS_" + (1)] = folio.shareholderName1.bankIFS;
      payload["bankMICR_" + (1)] = folio.shareholderName1.bankMICR;
      payload["bankName_" + (1)] = folio.shareholderName1.bankName;
      payload["bankPhone_" + (1)] = folio.shareholderName1.bankPhone;
      payload["city_" + (1)] = folio.shareholderName1.city;
      payload["countryOfBirth_" + (1)] =
        folio.shareholderName1.countryOfBirth;
      payload["dematAccountNo_" + (1)] =
        folio.shareholderName1.dematAccountNo;
      payload["dob_" + 1] = folio.shareholderName1
        .dob
        ? dayjs(folio.shareholderName1.dob).format("DD-MM-YYYY")
        : null;
      payload["email_" + (1)] = folio.shareholderName1.email;
      payload["emailBank_" + (1)] = folio.shareholderName1.emailBank;
      payload["nameAadhar_" + (1)] = folio.shareholderName1.nameAadhar;
      payload["nameBank_" + (1)] = folio.shareholderName1.nameBank;
      payload["nameCml_" + (1)] = folio.shareholderName1.nameCml;
      payload["namePan_" + (1)] = folio.shareholderName1.namePan;
      payload["nationality_" + (1)] = folio.shareholderName1.nationality;
      payload["pan_" + (1)] = folio.shareholderName1.pan;
      payload["phone_" + (1)] = folio.shareholderName1.phone;
      payload["phoneBank_" + (1)] = folio.shareholderName1.phoneBank;
      payload["pincodeBank_" + (1)] = folio.shareholderName1.pincodeBank;
      payload["placeOfBirth_" + (1)] = folio.shareholderName1.placeOfBirth;
      payload["husbandName_" + 1] = folio.shareholderName1.husbandName;
      payload["occupation_" + 1] = folio.shareholderName1.occupation;
      payload["branchName_" + 1] = folio.shareholderName1.branchName;
      payload["accountOpeningDate_" + 1] =
        folio.shareholderName1.accountOpeningDate ? dayjs(folio.shareholderName1.accountOpeningDate).format("DD-MM-YYYY") : null;
      payload["shareholderName_" + (1)] =
        folio.shareholderName1.shareholderName;
      payload["shareholderNameCertificate_" + (1)] =
        folio.shareholderName1.shareholderNameCertificate;
      payload["state_" + (1)] = folio.shareholderName1.state;
    }else{
      payload["hasShareholder_" + (1)] = false;
    }
    if(folio.shareholderName2){
      payload["shareHolderDetails"] = [
        folio.shareholderName2,
        ...payload["shareHolderDetails"],
      ];
      payload["hasShareholder_" + (2)] = true;
      payload["namePan_" + (2)] = folio.shareholderName2.namePan;
      payload["DPID_" + (2)] = folio.shareholderName2.DPID;
      payload["aadhar_" + (2)] = folio.shareholderName2.aadhar;
      payload["addressBank_" + (2)] = folio.shareholderName2.addressBank;
      payload["age_" + (2)] = folio.shareholderName2.age;
      payload["bankAccountNo_" + (2)] = folio.shareholderName2.bankAccountNo;
      payload["bankAccountType_" + (2)] =
        folio.shareholderName2.bankAccountType;
      payload["bankAddress_" + (2)] = folio.shareholderName2.bankAddress;
      payload["bankEmail_" + (2)] = folio.shareholderName2.bankEmail;
      payload["bankIFS_" + (2)] = folio.shareholderName2.bankIFS;
      payload["bankMICR_" + (2)] = folio.shareholderName2.bankMICR;
      payload["bankName_" + (2)] = folio.shareholderName2.bankName;
      payload["bankPhone_" + (2)] = folio.shareholderName2.bankPhone;
      payload["city_" + (2)] = folio.shareholderName2.city;
      payload["countryOfBirth_" + (2)] =
        folio.shareholderName2.countryOfBirth;
      payload["dematAccountNo_" + (2)] =
        folio.shareholderName2.dematAccountNo;
      payload["dob_" + 2] = folio.shareholderName2.dob
        ? dayjs(folio.shareholderName2.dob).format("DD-MM-YYYY")
        : null;
      payload["email_" + (2)] = folio.shareholderName2.email;
      payload["emailBank_" + (2)] = folio.shareholderName2.emailBank;
      payload["nameAadhar_" + (2)] = folio.shareholderName2.nameAadhar;
      payload["nameBank_" + (2)] = folio.shareholderName2.nameBank;
      payload["nameCml_" + (2)] = folio.shareholderName2.nameCml;
      payload["namePan_" + (2)] = folio.shareholderName2.namePan;
      payload["nationality_" + (2)] = folio.shareholderName2.nationality;
      payload["pan_" + (2)] = folio.shareholderName2.pan;
      payload["phone_" + (2)] = folio.shareholderName2.phone;
      payload["phoneBank_" + (2)] = folio.shareholderName2.phoneBank;
      payload["pincodeBank_" + (2)] = folio.shareholderName2.pincodeBank;
      payload["placeOfBirth_" + (2)] = folio.shareholderName2.placeOfBirth;
      payload["husbandName_" + 2] = folio.shareholderName2.husbandName;
      payload["occupation_" + 2] = folio.shareholderName2.occupation;
      payload["branchName_" + 2] = folio.shareholderName2.branchName;
      payload["accountOpeningDate_" + 2] = folio.shareholderName2
        .accountOpeningDate
        ? dayjs(folio.shareholderName2.accountOpeningDate).format("DD-MM-YYYY")
        : null;
      payload["shareholderName_" + (2)] =
        folio.shareholderName2.shareholderName;
      payload["shareholderNameCertificate_" + (2)] =
        folio.shareholderName2.shareholderNameCertificate;
      payload["state_" + (2)] = folio.shareholderName2.state;
    }else{
      payload["hasShareholder_" + (2)] = false;
    }
    if(folio.shareholderName3){
      payload["shareHolderDetails"] = [
        folio.shareholderName3,
        ...payload["shareHolderDetails"],
      ];
      payload["hasShareholder_" + (3)] = true;
      payload["namePan_" + (3)] = folio.shareholderName3.namePan;
      payload["DPID_" + (3)] = folio.shareholderName3.DPID;
      payload["aadhar_" + (3)] = folio.shareholderName3.aadhar;
      payload["addressBank_" + (3)] = folio.shareholderName3.addressBank;
      payload["age_" + (3)] = folio.shareholderName3.age;
      payload["bankAccountNo_" + (3)] = folio.shareholderName3.bankAccountNo;
      payload["bankAccountType_" + (3)] =
        folio.shareholderName3.bankAccountType;
      payload["bankAddress_" + (3)] = folio.shareholderName3.bankAddress;
      payload["bankEmail_" + (3)] = folio.shareholderName3.bankEmail;
      payload["bankIFS_" + (3)] = folio.shareholderName3.bankIFS;
      payload["bankMICR_" + (3)] = folio.shareholderName3.bankMICR;
      payload["bankName_" + (3)] = folio.shareholderName3.bankName;
      payload["bankPhone_" + (3)] = folio.shareholderName3.bankPhone;
      payload["city_" + (3)] = folio.shareholderName3.city;
      payload["countryOfBirth_" + (3)] =
        folio.shareholderName3.countryOfBirth;
      payload["dematAccountNo_" + (3)] =
        folio.shareholderName3.dematAccountNo;
      payload["dob_" + 3] = folio.shareholderName3.dob
        ? dayjs(folio.shareholderName3.dob).format("DD-MM-YYYY")
        : null;
      payload["email_" + (3)] = folio.shareholderName3.email;
      payload["emailBank_" + (3)] = folio.shareholderName3.emailBank;
      payload["nameAadhar_" + (3)] = folio.shareholderName3.nameAadhar;
      payload["nameBank_" + (3)] = folio.shareholderName3.nameBank;
      payload["nameCml_" + (3)] = folio.shareholderName3.nameCml;
      payload["namePan_" + (3)] = folio.shareholderName3.namePan;
      payload["nationality_" + (3)] = folio.shareholderName3.nationality;
      payload["pan_" + (3)] = folio.shareholderName3.pan;
      payload["phone_" + (3)] = folio.shareholderName3.phone;
      payload["phoneBank_" + (3)] = folio.shareholderName3.phoneBank;
      payload["pincodeBank_" + (3)] = folio.shareholderName3.pincodeBank;
      payload["placeOfBirth_" + (3)] = folio.shareholderName3.placeOfBirth;
      payload["husbandName_" + 3] = folio.shareholderName3.husbandName;
      payload["occupation_" + 3] = folio.shareholderName3.occupation;
      payload["branchName_" + 3] = folio.shareholderName3.branchName;
      payload["accountOpeningDate_" + 3] = folio.shareholderName3
        .accountOpeningDate
        ? dayjs(folio.shareholderName3.accountOpeningDate).format("DD-MM-YYYY")
        : null;
      payload["shareholderName_" + (3)] =
        folio.shareholderName3.shareholderName;
      payload["shareholderNameCertificate_" + (3)] =
        folio.shareholderName3.shareholderNameCertificate;
      payload["state_" + (3)] = folio.shareholderName3.state;
    }else{
      payload["hasShareholder_" + (3)] = false;
    }
    payload["legalHeirDetails"] = legalHeirDetails.map((item) => ({
      ...item,
      dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : null,
      accountOpeningDate: item.accountOpeningDate ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY") : null,
    }));
    payload["clamaints"] = clamaints.map((item) => ({
      ...item,
      dob: item.dob ? dayjs(item.dob).format("DD-MM-YYYY") : null,
      accountOpeningDate: item.accountOpeningDate
        ? dayjs(item.accountOpeningDate).format("DD-MM-YYYY")
        : null,
    }));
    payload["non_clamaints"] = legalHeirDetails
      .filter((itmm) => clamaints.map(i => i.id).includes(itmm.id) === false)
      .map((itmm) => ({
        ...itmm,
        dob: itmm.dob ? dayjs(itmm.dob).format("DD-MM-YYYY") : null,
        accountOpeningDate: itmm.accountOpeningDate
          ? dayjs(itmm.accountOpeningDate).format("DD-MM-YYYY")
          : null,
      }));
    mainData.push(payload);
  })

  const ISR1 = {
    name: "ISR1",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/ISR1.docx"
    )
  }

  const ISR2 = {
    name: "ISR2",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/ISR2.docx"
    )
  }

  const ISR3 = {
    name: "ISR3",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/ISR3.docx"
    )
  }

  const ISR4 = {
    name: "ISR4",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/ISR4.docx"
    )
  }

  const ISR5 = {
    name: "ISR5",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/ISR5.docx"
    )
  }

  const Affidavit = {
    name: "Affidavit",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Affidavit.docx"
    )
  }

  const Annexure_D = {
    name: "Annexure_D",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Annexure_D.docx"
    )
  }

  const Annexure_E = {
    name: "Annexure_E",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Annexure_E.docx"
    )
  }

  const Annexure_F = {
    name: "Annexure_F",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Annexure_F.docx"
    )
  }

  const Deletion = {
    name: "Deletion",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Deletion.docx"
    )
  }

  const Form_A_Duplicate = {
    name: "Form_A_Duplicate",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Form_A_Duplicate.docx"
    )
  }

  const Form_B_Duplicate = {
    name: "Form_B_Duplicate",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Form_B_Duplicate.docx"
    )
  }

  const form_no_sh_13 = {
    name: "form_no_sh_13",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/form_no_sh_13.docx"
    )
  }

  const Form_SH_14 = {
    name: "Form_SH_14",
    path: path.resolve(
      __dirname,
      "../../../static/word_template/Form_SH_14.docx"
    )
  }

  const caseType = {
    Claim: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13, Affidavit],
    ClaimTransposition: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13, Affidavit],
    ClaimIssueDuplicate: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      Form_A_Duplicate,
      Form_B_Duplicate,
      Affidavit,
    ],
    Transmission: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      ISR5,
      form_no_sh_13,
      Form_SH_14,
      Annexure_D,
      Annexure_E,
      Annexure_F,
      Affidavit,
    ],
    TransmissionIssueDuplicate: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      form_no_sh_13,
      Form_SH_14,
      Form_A_Duplicate,
      Form_B_Duplicate,
      Annexure_D,
      Annexure_E,
      Annexure_F,
      Affidavit,
    ],
    TransmissionIssueDuplicateTransposition: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      ISR5,
      form_no_sh_13,
      Form_SH_14,
      Form_A_Duplicate,
      Form_B_Duplicate,
      Annexure_D,
      Annexure_E,
      Annexure_F,
      Affidavit,
    ],
    Deletion: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13, Form_SH_14, Deletion],
    DeletionIssueDuplicate: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      form_no_sh_13,
      Form_SH_14,
      Deletion,
      Form_A_Duplicate,
      Form_B_Duplicate,
      Affidavit,
    ],
    DeletionIssueDuplicateTransposition: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      form_no_sh_13,
      Form_SH_14,
      Deletion,
      Form_A_Duplicate,
      Form_B_Duplicate,
      Annexure_D,
      Annexure_E,
      Annexure_F,
      Affidavit,
    ],
  };

  mainData.forEach((item, index) => {
    const folioFolderName = item.Folio;

    const folioFolderPath = path.resolve(
      __dirname,
      `../../../static/word_output/${folderName}/${folioFolderName}`
    );
    if (!fs.existsSync(folioFolderPath)) {
      fs.mkdirSync(folioFolderPath);
    }
    const data = {
      ...item,
    };

    caseType[item.Case].forEach((casee) => {

      if (casee.name === "Annexure_D") {
        const folioFolderAnxDPath = path.resolve(
          __dirname,
          `../../../static/word_output/${folderName}/${folioFolderName}/Annexure_D`
        );
        if (!fs.existsSync(folioFolderAnxDPath)) {
          fs.mkdirSync(folioFolderAnxDPath);
        }
        data.legalHeirDetails.forEach((i, idx) => {
          const annxDWordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/" + casee.name + ".docx"
          );
          const annxDContent = fs.readFileSync(annxDWordTemplate, "binary");

          // Create a zip instance of the file
          const annxDZip = new PizZip(annxDContent);

          // Create a Docxtemplater instance
          const annxDDoc = new Docxtemplater(annxDZip, {
            paragraphLoop: true,
            linebreaks: true,
          });
          const dataRender:any = {...i};
          dataRender["companyName"] = data["companyName"];
          dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
          dataRender["deceasedRelationship"] = data["deceasedRelationship"];
          dataRender["Folio"] = data["Folio"];
          dataRender["totalNoOfShares"] = data["totalNoOfShares"];
          dataRender["legalHeirDetails"] = data.legalHeirDetails.filter(
            (_it, itx) => itx !== idx
          );
          annxDDoc.render(dataRender);
  
          // Get the generated document as a buffer
          const buf = annxDDoc.getZip().generate({ type: "nodebuffer" });
  
          // Write the buffer to a file (output.docx)
          const annxDWordOutput = path.resolve(
            __dirname,
            folioFolderAnxDPath + "/" + casee.name + "_" + (idx + 1) + ".docx"
          );
          fs.writeFileSync(annxDWordOutput, buf);
  
          console.log("Annexure D Document created successfully!");
        })
      } 
      else if (casee.name === "ISR5") {
        const folioFolderISR5DPath = path.resolve(
          __dirname,
          `../../../static/word_output/${folderName}/${folioFolderName}/ISR5`
        );
        if (!fs.existsSync(folioFolderISR5DPath)) {
          fs.mkdirSync(folioFolderISR5DPath);
        }
        data.clamaints.forEach((i, idx) => {
          const ISR5WordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/" + casee.name + ".docx"
          );
          const ISR5Content = fs.readFileSync(ISR5WordTemplate, "binary");

          // Create a zip instance of the file
          const ISR5Zip = new PizZip(ISR5Content);

          // Create a Docxtemplater instance
          const ISR5Doc = new Docxtemplater(ISR5Zip, {
            paragraphLoop: true,
            linebreaks: true,
          });
          const dataRender: any = { ...i };
          dataRender["companyName"] = data["companyName"];
          dataRender["isDeceased"] = data["isDeceased"];
          dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
          dataRender["deceasedRelationship"] = data["deceasedRelationship"];
          dataRender["dod"] = data["dod"];
          dataRender["placeOfDeath"] = data["placeOfDeath"];
          dataRender["isTestate"] = data["isTestate"];
          dataRender["isMinor"] = data["isMinor"];
          dataRender["dobMinor"] = data["dobMinor"];
          dataRender["guardianName"] = data["guardianName"];
          dataRender["guardianRelationship"] = data["guardianRelationship"];
          dataRender["guardianPan"] = data["guardianPan"];
          dataRender["taxStatus"] = data["taxStatus"];
          dataRender["statusClaimant"] = data["statusClaimant"];
          dataRender["percentageClaimant"] = data["percentageClaimant"];
          dataRender["occupationClaimant"] = data["occupationClaimant"];
          dataRender["politicalExposureClaimant"] = data["politicalExposureClaimant"];
          dataRender["annualIncomeClaimant"] = data["annualIncomeClaimant"];
          dataRender["Folio"] = data["Folio"];
          dataRender["totalNoOfShares"] = data["totalNoOfShares"];
          ISR5Doc.render(dataRender);

          // Get the generated document as a buffer
          const buf = ISR5Doc.getZip().generate({ type: "nodebuffer" });

          // Write the buffer to a file (output.docx)
          const ISR5WordOutput = path.resolve(
            __dirname,
            folioFolderISR5DPath + "/" + casee.name + "_" + (idx + 1) + ".docx"
          );
          fs.writeFileSync(ISR5WordOutput, buf);

          console.log("ISR5 Document created successfully!");
        });
      } 
      else if (casee.name === "Form_A_Duplicate") {
        if (item.Case === "TransmissionIssueDuplicate") {
          // Load the docx file as a binary
          const wordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/Form_A_Duplicate_2.docx"
          );
          const content = fs.readFileSync(wordTemplate, "binary");

          // Create a zip instance of the file
          const zip = new PizZip(content);

          // Create a Docxtemplater instance
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render(data);

          // Get the generated document as a buffer
          const buf = doc.getZip().generate({ type: "nodebuffer" });

          // Write the buffer to a file (output.docx)
          const wordOutput = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
          );
          fs.writeFileSync(wordOutput, buf);

          console.log("Document created successfully!");
        } else {
          // Load the docx file as a binary
          const wordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/Form_A_Duplicate_1.docx"
          );
          const content = fs.readFileSync(wordTemplate, "binary");

          // Create a zip instance of the file
          const zip = new PizZip(content);

          // Create a Docxtemplater instance
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render(data);

          // Get the generated document as a buffer
          const buf = doc.getZip().generate({ type: "nodebuffer" });

          // Write the buffer to a file (output.docx)
          const wordOutput = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
          );
          fs.writeFileSync(wordOutput, buf);

          console.log("Document created successfully!");
        }
      } 
      else if (casee.name === "Form_B_Duplicate") {
        if (item.Case === "TransmissionIssueDuplicate") {
          // Load the docx file as a binary
          const wordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/Form_B_Duplicate_2.docx"
          );
          const content = fs.readFileSync(wordTemplate, "binary");

          // Create a zip instance of the file
          const zip = new PizZip(content);

          // Create a Docxtemplater instance
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render(data);

          // Get the generated document as a buffer
          const buf = doc.getZip().generate({ type: "nodebuffer" });

          // Write the buffer to a file (output.docx)
          const wordOutput = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
          );
          fs.writeFileSync(wordOutput, buf);

          console.log("Document created successfully!");
        } else {
          // Load the docx file as a binary
          const wordTemplate = path.resolve(
            __dirname,
            "../../../static/word_template/Form_B_Duplicate_1.docx"
          );
          const content = fs.readFileSync(wordTemplate, "binary");

          // Create a zip instance of the file
          const zip = new PizZip(content);

          // Create a Docxtemplater instance
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.render(data);

          // Get the generated document as a buffer
          const buf = doc.getZip().generate({ type: "nodebuffer" });

          // Write the buffer to a file (output.docx)
          const wordOutput = path.resolve(
            __dirname,
            folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
          );
          fs.writeFileSync(wordOutput, buf);

          console.log("Document created successfully!");
        }
      } 
      else if (casee.name === "Affidavit") {
        if (data.allowAffidavit) {
          if (item.Case.includes("Transmission")) {
            // Load the docx file as a binary
            const folioFolderAffidavitDPath = path.resolve(
              __dirname,
              `../../../static/word_output/${folderName}/${folioFolderName}/AffidavitLegalHeir`
            );
            if (!fs.existsSync(folioFolderAffidavitDPath)) {
              fs.mkdirSync(folioFolderAffidavitDPath);
            }
            data.affidavitLegalHeirs.forEach((i, idx) => {
              const affidavitWordTemplate = path.resolve(
                __dirname,
                "../../../static/word_template/Affidavit.docx"
              );
              const affidavitContent = fs.readFileSync(
                affidavitWordTemplate,
                "binary"
              );

              // Create a zip instance of the file
              const affidavitZip = new PizZip(affidavitContent);

              // Create a Docxtemplater instance
              const affidavitDoc = new Docxtemplater(affidavitZip, {
                paragraphLoop: true,
                linebreaks: true,
              });

              const dataRender: any = { ...i };
              dataRender["companyName"] = data["companyName"];
              dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
              dataRender["deceasedRelationship"] = data["deceasedRelationship"];
              dataRender["placeOfDeath"] = data["placeOfDeath"];

              affidavitDoc.render(dataRender);

              // Get the generated document as a buffer
              const buf = affidavitDoc
                .getZip()
                .generate({ type: "nodebuffer" });

              // Write the buffer to a file (output.docx)
              const affidavitWordOutput = path.resolve(
                __dirname,
                folioFolderAffidavitDPath +
                  "/" +
                  casee.name +
                  "_" +
                  (idx + 1) +
                  ".docx"
              );
              fs.writeFileSync(affidavitWordOutput, buf);

              console.log("Annexure D Document created successfully!");
            });
          }

            const folioFolderAffidavitDPath = path.resolve(
              __dirname,
              `../../../static/word_output/${folderName}/${folioFolderName}/AffidavitShareholder`
            );
            if (!fs.existsSync(folioFolderAffidavitDPath)) {
              fs.mkdirSync(folioFolderAffidavitDPath);
            }
            data.affidavits.forEach((i, idx) => {
              const affidavitWordTemplate = path.resolve(
                __dirname,
                "../../../static/word_template/Affidavit2.docx"
              );
              const affidavitContent = fs.readFileSync(
                affidavitWordTemplate,
                "binary"
              );

              // Create a zip instance of the file
              const affidavitZip = new PizZip(affidavitContent);

              // Create a Docxtemplater instance
              const affidavitDoc = new Docxtemplater(affidavitZip, {
                paragraphLoop: true,
                linebreaks: true,
              });

              const dataRender: any = { ...i };

              affidavitDoc.render(dataRender);

              // Get the generated document as a buffer
              const buf = affidavitDoc
                .getZip()
                .generate({ type: "nodebuffer" });

              // Write the buffer to a file (output.docx)
              const affidavitWordOutput = path.resolve(
                __dirname,
                folioFolderAffidavitDPath +
                  "/" +
                  casee.name +
                  "_" +
                  (idx + 1) +
                  ".docx"
              );
              fs.writeFileSync(affidavitWordOutput, buf);

              console.log("Annexure D Document created successfully!");
            });
        }
      } 
      else {
        // Load the docx file as a binary
        const wordTemplate = path.resolve(
          __dirname,
          "../../../static/word_template/" + casee.name + ".docx"
        );
        const content = fs.readFileSync(wordTemplate, "binary");

        // Create a zip instance of the file
        const zip = new PizZip(content);

        // Create a Docxtemplater instance
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        doc.render(data);

        // Get the generated document as a buffer
        const buf = doc.getZip().generate({ type: "nodebuffer" });

        // Write the buffer to a file (output.docx)
        const wordOutput = path.resolve(
          __dirname,
          folioFolderPath + "/" + casee.name + "_" + (index + 1) + ".docx"
        );
        fs.writeFileSync(wordOutput, buf);

        console.log("Document created successfully!");
      }

      // Render the document by filling in the data
    });

  });


  const folderZip = new AdmZip();
  folderZip.addLocalFolder(folderPath);
  await folderZip.writeZipPromise(
    path.resolve(
      __dirname,
      "../../../static/word_output/" + folderName + ".zip"
    )
  );
  fs.rm(folderPath, { recursive: true }, (err) => {});

  return path.resolve(__dirname, "../../../static/word_output/" + folderName + ".zip");;
}