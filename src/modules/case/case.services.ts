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
    affidavits: (LegalHeirDetailType | ShareHolderDetailType)[];
  }
> {
  const { id } = params;
  let foliosSet: FolioType[] = [];
  let clamaints: LegalHeirDetailType[] = [];
  let affidavits: (LegalHeirDetailType | ShareHolderDetailType)[] = [];
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
      shareHolderMaster.selectAffidavit &&
      shareHolderMaster.selectAffidavit.split("_").length > 0
    ) {
      const inAffidavits = shareHolderMaster.selectAffidavit
        ?.split("_")
        .map((claimant) =>
          isNaN(Number(claimant)) ? undefined : Number(claimant)
        )
        .filter((claimant) => claimant !== undefined) as number[];
      if (inAffidavits.length > 0) {
        if (shareHolderMaster.caseType.includes("Transmission")) {
          affidavits = await prisma.legalHeirDetail.findMany({
            where: {
              id: {
                in: inAffidavits,
              },
            },
          });
        } else {
          affidavits = await prisma.shareHolderDetail.findMany({
            where: {
              id: {
                in: inAffidavits,
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
    affidavits,
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
      affidavits: (LegalHeirDetailType | ShareHolderDetailType)[];
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
      let affidavits: (LegalHeirDetailType | ShareHolderDetailType)[] = [];
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
          shareHolderMaster.selectAffidavit &&
          shareHolderMaster.selectAffidavit.split("_").length > 0
        ) {
          const inAffidavits = shareHolderMaster.selectAffidavit
            ?.split("_")
            .map((claimant) =>
              isNaN(Number(claimant)) ? undefined : Number(claimant)
            )
            .filter((claimant) => claimant !== undefined) as number[];
            if (inAffidavits.length > 0) {
              if (shareHolderMaster.caseType.includes("Transmission")) {
                affidavits = await prisma.legalHeirDetail.findMany({
                  where: {
                    id: {
                      in: inAffidavits,
                    },
                  },
                });
              }else{
                affidavits = await prisma.shareHolderDetail.findMany({
                  where: {
                    id: {
                      in: inAffidavits,
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
        affidavits,
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

  const legalHeirDetails = await prisma.legalHeirDetail.findMany({
    where: {
      projectID: shareHolderMaster.shareCertificateMaster?.projectID
    },
  })

  const mainData: any[] = [];
  foliosSet.forEach((folio) => {
    const payload: any = {};
    payload["Case"] = shareHolderMaster.caseType;
    payload["isDeceased"] = shareHolderMaster.isDeceased==="Yes" ? true : false;
    payload["shareholderNameDeath"] = shareHolderMaster.shareholderNameDeath;
    payload["deceasedRelationship"] = shareHolderMaster.deceasedRelationship;
    payload["dod"] = shareHolderMaster.dod
      ? dayjs(shareHolderMaster.dod).format("DD-MM-YYYY")
      : null;
    payload["isTestate"] = shareHolderMaster.isTestate==="Yes" ? true : false;
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
    if(folio.shareholderName1){
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
    if (clamaints.length >= 1) {
      payload["clamaint_hasShareholder_" + 1] = true;
      payload["clamaint_namePan_" + 1] = clamaints[0].namePan;
      payload["clamaint_DPID_" + 1] = clamaints[0].DPID;
      payload["clamaint_aadhar_" + 1] = clamaints[0].aadhar;
      payload["clamaint_addressBank_" + 1] = clamaints[0].addressBank;
      payload["clamaint_age_" + 1] = clamaints[0].age;
      payload["clamaint_bankAccountNo_" + 1] = clamaints[0].bankAccountNo;
      payload["clamaint_bankAccountType_" + 1] = clamaints[0].bankAccountType;
      payload["clamaint_bankAddress_" + 1] = clamaints[0].bankAddress;
      payload["clamaint_bankEmail_" + 1] = clamaints[0].bankEmail;
      payload["clamaint_bankIFS_" + 1] = clamaints[0].bankIFS;
      payload["clamaint_bankMICR_" + 1] = clamaints[0].bankMICR;
      payload["clamaint_bankName_" + 1] = clamaints[0].bankName;
      payload["clamaint_bankPhone_" + 1] = clamaints[0].bankPhone;
      payload["clamaint_city_" + 1] = clamaints[0].city;
      payload["clamaint_countryOfBirth_" + 1] = clamaints[0].countryOfBirth;
      payload["clamaint_dematAccountNo_" + 1] = clamaints[0].dematAccountNo;
      payload["clamaint_dob_" + 1] = clamaints[0].dob
        ? dayjs(clamaints[0].dob).format("DD-MM-YYYY")
        : null;
      payload["clamaint_email_" + 1] = clamaints[0].email;
      payload["clamaint_emailBank_" + 1] = clamaints[0].emailBank;
      payload["clamaint_nameAadhar_" + 1] = clamaints[0].nameAadhar;
      payload["clamaint_nameBank_" + 1] = clamaints[0].nameBank;
      payload["clamaint_nameCml_" + 1] = clamaints[0].nameCml;
      payload["clamaint_namePan_" + 1] = clamaints[0].namePan;
      payload["clamaint_nationality_" + 1] = clamaints[0].nationality;
      payload["clamaint_pan_" + 1] = clamaints[0].pan;
      payload["clamaint_phone_" + 1] = clamaints[0].phone;
      payload["clamaint_phoneBank_" + 1] = clamaints[0].phoneBank;
      payload["clamaint_pincodeBank_" + 1] = clamaints[0].pincodeBank;
      payload["clamaint_placeOfBirth_" + 1] = clamaints[0].placeOfBirth;
      payload["clamaint_husbandName_" + 1] = clamaints[0].husbandName;
      payload["clamaint_occupation_" + 1] = clamaints[0].occupation;
      payload["clamaint_branchName_" + 1] = clamaints[0].branchName;
      payload["clamaint_accountOpeningDate_" + 1] = clamaints[0]
        .accountOpeningDate
        ? dayjs(clamaints[0].accountOpeningDate).format("DD-MM-YYYY")
        : null;
      payload["clamaint_state_" + 1] = clamaints[0].state;
    } else {
      payload["clamaint_hasShareholder_" + 1] = false;
    }
    if (clamaints.length >= 2) {
      payload["clamaint_hasShareholder_" + 2] = true;
      payload["clamaint_namePan_" + 2] = clamaints[1].namePan;
      payload["clamaint_DPID_" + 2] = clamaints[1].DPID;
      payload["clamaint_aadhar_" + 2] = clamaints[1].aadhar;
      payload["clamaint_addressBank_" + 2] = clamaints[1].addressBank;
      payload["clamaint_age_" + 2] = clamaints[1].age;
      payload["clamaint_bankAccountNo_" + 2] = clamaints[1].bankAccountNo;
      payload["clamaint_bankAccountType_" + 2] = clamaints[1].bankAccountType;
      payload["clamaint_bankAddress_" + 2] = clamaints[1].bankAddress;
      payload["clamaint_bankEmail_" + 2] = clamaints[1].bankEmail;
      payload["clamaint_bankIFS_" + 2] = clamaints[1].bankIFS;
      payload["clamaint_bankMICR_" + 2] = clamaints[1].bankMICR;
      payload["clamaint_bankName_" + 2] = clamaints[1].bankName;
      payload["clamaint_bankPhone_" + 2] = clamaints[1].bankPhone;
      payload["clamaint_city_" + 2] = clamaints[1].city;
      payload["clamaint_countryOfBirth_" + 2] = clamaints[1].countryOfBirth;
      payload["clamaint_dematAccountNo_" + 2] = clamaints[1].dematAccountNo;
      payload["clamaint_dob_" + 2] = clamaints[1].dob
        ? dayjs(clamaints[1].dob).format("DD-MM-YYYY")
        : null;
      payload["clamaint_email_" + 2] = clamaints[1].email;
      payload["clamaint_emailBank_" + 2] = clamaints[1].emailBank;
      payload["clamaint_nameAadhar_" + 2] = clamaints[1].nameAadhar;
      payload["clamaint_nameBank_" + 2] = clamaints[1].nameBank;
      payload["clamaint_nameCml_" + 2] = clamaints[1].nameCml;
      payload["clamaint_namePan_" + 2] = clamaints[1].namePan;
      payload["clamaint_nationality_" + 2] = clamaints[1].nationality;
      payload["clamaint_pan_" + 2] = clamaints[1].pan;
      payload["clamaint_phone_" + 2] = clamaints[1].phone;
      payload["clamaint_phoneBank_" + 2] = clamaints[1].phoneBank;
      payload["clamaint_pincodeBank_" + 2] = clamaints[1].pincodeBank;
      payload["clamaint_placeOfBirth_" + 2] = clamaints[1].placeOfBirth;
      payload["clamaint_husbandName_" + 2] = clamaints[1].husbandName;
      payload["clamaint_occupation_" + 2] = clamaints[1].occupation;
      payload["clamaint_branchName_" + 2] = clamaints[1].branchName;
      payload["clamaint_accountOpeningDate_" + 2] = clamaints[1]
        .accountOpeningDate
        ? dayjs(clamaints[1].accountOpeningDate).format("DD-MM-YYYY")
        : null;
      payload["clamaint_state_" + 2] = clamaints[1].state;
    } else {
      payload["clamaint_hasShareholder_" + 2] = false;
    }
    if (clamaints.length >= 3) {
      payload["clamaint_hasShareholder_" + 3] = true;
      payload["clamaint_namePan_" + 3] = clamaints[2].namePan;
      payload["clamaint_DPID_" + 3] = clamaints[2].DPID;
      payload["clamaint_aadhar_" + 3] = clamaints[2].aadhar;
      payload["clamaint_addressBank_" + 3] = clamaints[2].addressBank;
      payload["clamaint_age_" + 3] = clamaints[2].age;
      payload["clamaint_bankAccountNo_" + 3] = clamaints[2].bankAccountNo;
      payload["clamaint_bankAccountType_" + 3] = clamaints[2].bankAccountType;
      payload["clamaint_bankAddress_" + 3] = clamaints[2].bankAddress;
      payload["clamaint_bankEmail_" + 3] = clamaints[2].bankEmail;
      payload["clamaint_bankIFS_" + 3] = clamaints[2].bankIFS;
      payload["clamaint_bankMICR_" + 3] = clamaints[2].bankMICR;
      payload["clamaint_bankName_" + 3] = clamaints[2].bankName;
      payload["clamaint_bankPhone_" + 3] = clamaints[2].bankPhone;
      payload["clamaint_city_" + 3] = clamaints[2].city;
      payload["clamaint_countryOfBirth_" + 3] = clamaints[2].countryOfBirth;
      payload["clamaint_dematAccountNo_" + 3] = clamaints[2].dematAccountNo;
      payload["clamaint_dob_" + 3] = clamaints[2].dob
        ? dayjs(clamaints[2].dob).format("DD-MM-YYYY")
        : null;
      payload["clamaint_email_" + 3] = clamaints[2].email;
      payload["clamaint_emailBank_" + 3] = clamaints[2].emailBank;
      payload["clamaint_nameAadhar_" + 3] = clamaints[2].nameAadhar;
      payload["clamaint_nameBank_" + 3] = clamaints[2].nameBank;
      payload["clamaint_nameCml_" + 3] = clamaints[2].nameCml;
      payload["clamaint_namePan_" + 3] = clamaints[2].namePan;
      payload["clamaint_nationality_" + 3] = clamaints[2].nationality;
      payload["clamaint_pan_" + 3] = clamaints[2].pan;
      payload["clamaint_phone_" + 3] = clamaints[2].phone;
      payload["clamaint_phoneBank_" + 3] = clamaints[2].phoneBank;
      payload["clamaint_pincodeBank_" + 3] = clamaints[2].pincodeBank;
      payload["clamaint_placeOfBirth_" + 3] = clamaints[2].placeOfBirth;
      payload["clamaint_husbandName_" + 3] = clamaints[2].husbandName;
      payload["clamaint_occupation_" + 3] = clamaints[2].occupation;
      payload["clamaint_branchName_" + 3] = clamaints[2].branchName;
      payload["clamaint_accountOpeningDate_" + 3] = clamaints[2]
        .accountOpeningDate
        ? dayjs(clamaints[2].accountOpeningDate).format("DD-MM-YYYY")
        : null;
      payload["clamaint_state_" + 3] = clamaints[2].state;
    } else {
      payload["clamaint_hasShareholder_" + 3] = false;
    }
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

  // const Affidavit = {
  //   name: "Affidavit",
  //   path: path.resolve(
  //     __dirname,
  //     "../../../static/word_template/Affidavit.docx"
  //   )
  // }

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
    Claim: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13],
    ClaimTransposition: [ISR1, ISR2, ISR3, ISR4, form_no_sh_13],
    ClaimIssueDuplicate: [
      ISR1,
      ISR2,
      ISR3,
      ISR4,
      Form_A_Duplicate,
      Form_B_Duplicate,
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

      // Render the document by filling in the data
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