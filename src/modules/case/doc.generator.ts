import path from "path";
import fs from "fs";
import { $Enums, Prisma } from "@prisma/client";
import { NameChangeMasterColumn } from "../company_master/company_master.model";
import { prisma } from "../../db";
import { NotFoundError } from "../../utils/exceptions";
import { FolioType } from "../../@types/folio.type";
import { CertificateType } from "../../@types/certificate.type";
import { LegalHeirDetailType } from "../../@types/legal_heir_detail.type";
import { ShareHolderDetailType } from "../../@types/share_holder_detail.type";
import { NominationType } from "../../@types/nomination.type";
import dayjs from "dayjs";
import { numberInWords } from "../../utils/numberInWords";

// const templates = {
//  ISR1: path.resolve(__dirname, "../../../static/word_template/ISR1.docx"),
//  ISR2: path.resolve(__dirname, "../../../static/word_template/ISR2.docx"),
//  ISR3: path.resolve(__dirname, "../../../static/word_template/ISR3.docx"),
//  ISR4: path.resolve(__dirname, "../../../static/word_template/ISR4.docx"),
//  ISR5: path.resolve(__dirname, "../../../static/word_template/ISR5.docx"),
//  Affidavit: path.resolve(
//   __dirname,
//   "../../../static/word_template/Affidavit.docx"
//  ),
//  Annexure_D: path.resolve(
//   __dirname,
//   "../../../static/word_template/Annexure_D.docx"
//  ),
//  Annexure_E: path.resolve(
//   __dirname,
//   "../../../static/word_template/Annexure_E.docx"
//  ),
//  Annexure_F: path.resolve(
//   __dirname,
//   "../../../static/word_template/Annexure_F.docx"
//  ),
//  Deletion: path.resolve(
//   __dirname,
//   "../../../static/word_template/Deletion.docx"
//  ),
//  Form_A_Duplicate: path.resolve(
//   __dirname,
//   "../../../static/word_template/Form_A_Duplicate.docx"
//  ),
//  Form_B_Duplicate: path.resolve(
//   __dirname,
//   "../../../static/word_template/Form_B_Duplicate.docx"
//  ),
//  form_no_sh_13: path.resolve(
//   __dirname,
//   "../../../static/word_template/form_no_sh_13.docx"
//  ),
//  Form_SH_14: path.resolve(
//   __dirname,
//   "../../../static/word_template/Form_SH_14.docx"
//  ),
// };

// const caseType = {
//  Claim: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Affidavit,
//  ],
//  ClaimTransposition: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Affidavit,
//  ],
//  ClaimIssueDuplicate: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Form_A_Duplicate,
//   templates.Form_B_Duplicate,
//   templates.Affidavit,
//  ],
//  Transmission: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.ISR5,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Annexure_D,
//   templates.Annexure_E,
//   templates.Annexure_F,
//   templates.Affidavit,
//  ],
//  TransmissionIssueDuplicate: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Form_A_Duplicate,
//   templates.Form_B_Duplicate,
//   templates.Annexure_D,
//   templates.Annexure_E,
//   templates.Annexure_F,
//   templates.Affidavit,
//  ],
//  TransmissionIssueDuplicateTransposition: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.ISR5,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Form_A_Duplicate,
//   templates.Form_B_Duplicate,
//   templates.Annexure_D,
//   templates.Annexure_E,
//   templates.Annexure_F,
//   templates.Affidavit,
//  ],
//  Deletion: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Deletion,
//  ],
//  DeletionIssueDuplicate: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Deletion,
//   templates.Form_A_Duplicate,
//   templates.Form_B_Duplicate,
//   templates.Affidavit,
//  ],
//  DeletionIssueDuplicateTransposition: [
//   templates.ISR1,
//   templates.ISR2,
//   templates.ISR3,
//   templates.ISR4,
//   templates.form_no_sh_13,
//   templates.Form_SH_14,
//   templates.Deletion,
//   templates.Form_A_Duplicate,
//   templates.Form_B_Duplicate,
//   templates.Annexure_D,
//   templates.Annexure_E,
//   templates.Annexure_F,
//   templates.Affidavit,
//  ],
// };

type CaseDocGeneratorType = {
 id: number;
};

type ShareHolderMasterType = Prisma.CaseGetPayload<{
 include: {
  deadShareholder: true;
  shareCertificateMaster: {
   include: {
    companyMaster: {
     include: {
      nameChangeMasters: true,
      registrarMasterBranch: {
       include: {
        registrarMaster: true;
       };
      };
     };
    };
   };
  };
 };
}>;
class CaseDocGenerator {
 private readonly id: number;
 private folderName: string = "";
 private folderPath: string = "";
 private shareHolderMaster: ShareHolderMasterType | null = null;
 private foliosSet: (FolioType & { certificate: CertificateType[] })[] = [];
 private clamaints: LegalHeirDetailType[] = [];
 private affidavitShareholders: ShareHolderDetailType[] = [];
 private affidavitLegalHeirs: LegalHeirDetailType[] = [];
 private nominations: NominationType[] = [];
 private legalHeirDetails: LegalHeirDetailType[] = [];
 private mainData: any[] = [];

 constructor(parameters: CaseDocGeneratorType) {
  this.id = parameters.id;
  this.folderName = "doc_" + parameters.id + "_" + Date.now();
  this.init();
 }

 async init() {
  this.folderPath = path.resolve(
   __dirname,
   "../../../static/word_output/" + this.folderName
  );
  if (!fs.existsSync(this.folderPath)) {
   fs.mkdirSync(this.folderPath);
  }

  this.shareHolderMaster = await this.getCase();
  this.foliosSet = await this.getFolios();
  this.clamaints = await this.getClaimants();
  this.affidavitShareholders = await this.getAffidavitShareholders();
  this.affidavitLegalHeirs = await this.getAffidavitLegalHeirs();
  this.nominations = await this.getNominations();
  this.legalHeirDetails = await this.getLegalHeirs();

  await this.setup();
 }

 async getCase(): Promise<ShareHolderMasterType> {
  const shareHolderMaster = await prisma.case.findUnique({
   where: {
    id: Number(this.id),
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
  return shareHolderMaster;
 }

 async getFolios(): Promise<
  (FolioType & { certificate: CertificateType[] })[]
 > {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.folios &&
   this.shareHolderMaster.folios.split("_").length > 0
  ) {
   const inFolios = this.shareHolderMaster.folios
    .split("_")
    .map((folio) => (isNaN(Number(folio)) ? undefined : Number(folio)))
    .filter((folio) => folio !== undefined) as number[];
   if (inFolios.length > 0) {
    return await prisma.folio.findMany({
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
      },
      shareCertificateMaster: true,
     },
    });
   }
  }
  return [];
 }

 async getClaimants(): Promise<LegalHeirDetailType[]> {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.selectClaimant &&
   this.shareHolderMaster.selectClaimant.split("_").length > 0
  ) {
   const inClaimants = this.shareHolderMaster.selectClaimant
    ?.split("_")
    .map((claimant) =>
     isNaN(Number(claimant)) ? undefined : Number(claimant)
    )
    .filter((claimant) => claimant !== undefined) as number[];
   if (inClaimants.length > 0) {
    return await prisma.legalHeirDetail.findMany({
     where: {
      id: {
       in: inClaimants,
      },
     },
    });
   }
  }
  return [];
 }

 async getAffidavitShareholders(): Promise<ShareHolderDetailType[]> {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.allowAffidavit === "Yes" &&
   this.shareHolderMaster.selectAffidavitShareholder &&
   this.shareHolderMaster.selectAffidavitShareholder.split("_").length > 0
  ) {
   const inAffidavitShareholders =
    this.shareHolderMaster.selectAffidavitShareholder
     ?.split("_")
     .map((claimant) =>
      isNaN(Number(claimant)) ? undefined : Number(claimant)
     )
     .filter((claimant) => claimant !== undefined) as number[];
   if (inAffidavitShareholders.length > 0) {
    return await prisma.shareHolderDetail.findMany({
     where: {
      id: {
       in: inAffidavitShareholders,
      },
     },
    });
   }
  }
  return [];
 }

 async getAffidavitLegalHeirs(): Promise<LegalHeirDetailType[]> {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.allowAffidavit === "Yes" &&
   this.shareHolderMaster.selectAffidavitLegalHeir &&
   this.shareHolderMaster.selectAffidavitLegalHeir.split("_").length > 0
  ) {
   const inAffidavitLegalHeirs =
    this.shareHolderMaster.selectAffidavitLegalHeir
     ?.split("_")
     .map((claimant) =>
      isNaN(Number(claimant)) ? undefined : Number(claimant)
     )
     .filter((claimant) => claimant !== undefined) as number[];
   if (inAffidavitLegalHeirs.length > 0) {
    if (this.shareHolderMaster.caseType.includes("Transmission")) {
     return await prisma.legalHeirDetail.findMany({
      where: {
       id: {
        in: inAffidavitLegalHeirs,
       },
      },
     });
    }
   }
  }
  return [];
 }

 async getNominations(): Promise<NominationType[]> {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.selectNomination &&
   this.shareHolderMaster.selectNomination.split("_").length > 0
  ) {
   const inNominations = this.shareHolderMaster.selectNomination
    ?.split("_")
    .map((claimant) =>
     isNaN(Number(claimant)) ? undefined : Number(claimant)
    )
    .filter((claimant) => claimant !== undefined) as number[];
   if (inNominations.length > 0) {
    return await prisma.nomination.findMany({
     where: {
      id: {
       in: inNominations,
      },
     },
    });
   }
  }
  return [];
 }

 async getLegalHeirs(): Promise<LegalHeirDetailType[]> {
  if (
   this.shareHolderMaster &&
   this.shareHolderMaster.shareCertificateMaster &&
   this.shareHolderMaster.shareCertificateMaster.projectID
  ) {
   return await prisma.legalHeirDetail.findMany({
    where: {
     projectID: this.shareHolderMaster.shareCertificateMaster.projectID,
    },
   });
  }
  return [];
 }

 async setup(): Promise<void> {
  new Promise((resolve) => {
   this.foliosSet.forEach((folio) => {
    const payload: any = {};
    payload["Case"] = this.shareHolderMaster!.caseType;
    payload["allowAffidavit"] = this.setupBooleanPayload(
     this.shareHolderMaster!.allowAffidavit
    );
    payload["affidavits"] = this.affidavitShareholders.map((item, i) => ({
     ...item,
     dob: this.setupDatePayload(item.dob),
     accountOpeningDate: this.setupDatePayload(item.accountOpeningDate),
     index: i + 1,
    }));
    payload["affidavitLegalHeirs"] = this.affidavitLegalHeirs.map(
     (item, i) => ({
      ...item,
      dob: this.setupDatePayload(item.dob),
      accountOpeningDate: this.setupDatePayload(item.accountOpeningDate),
      index: i + 1,
     })
    );
    payload["nominations"] = this.nominations.map((item, i) => ({
     ...item,
     dobMinor: this.setupDatePayload(item.dobMinor),
     dobDeceased: this.setupDatePayload(item.dobDeceased),
     dateMajority: this.setupDatePayload(item.dateMajority),
     isMinor: this.setupBooleanPayload(item.isMinor),
     isDeceased: this.setupBooleanPayload(item.isDeceased),
     index: i + 1,
    }));
    payload["isDeceased"] =
     this.setupBooleanPayload(this.shareHolderMaster!.isDeceased);
    payload["deadShareholder"] = this.shareHolderMaster!.deadShareholder;
    payload["shareholderNameDeath"] =
     this.shareHolderMaster!.shareholderNameDeath;
    payload["deceasedRelationship"] =
     this.shareHolderMaster!.deceasedRelationship;
    payload["placeOfDeath"] = this.shareHolderMaster!.placeOfDeath;
    payload["dod"] = this.setupDatePayload(this.shareHolderMaster!.dod);
    payload["isTestate"] =
     this.setupBooleanPayload(this.shareHolderMaster!.isTestate);
    payload["isInTestate"] =
     !this.setupBooleanPayload(this.shareHolderMaster!.isTestate);
    payload["isMinor"] =
     this.setupBooleanPayload(this.shareHolderMaster!.isMinor);
    payload["dobMinor"] = this.setupDatePayload(this.shareHolderMaster!.dobMinor);
    payload["guardianName"] = this.shareHolderMaster!.guardianName;
    payload["guardianRelationship"] =
     this.shareHolderMaster!.guardianRelationship;
    payload["guardianPan"] = this.shareHolderMaster!.guardianPan;
    payload["taxStatus"] = this.shareHolderMaster!.taxStatus;
    payload["statusClaimant"] = this.shareHolderMaster!.statusClaimant;
    payload["percentageClaimant"] =
     this.shareHolderMaster!.percentageClaimant;
    payload["occupationClaimant"] =
     this.shareHolderMaster!.occupationClaimant;
    payload["politicalExposureClaimant"] =
     this.shareHolderMaster!.politicalExposureClaimant;
    payload["annualIncomeClaimant"] =
     this.shareHolderMaster!.annualIncomeClaimant;

    payload["Folio"] = folio.Folio;
    payload["certificateCount"] = folio.certificate.length;
    payload["grandTotalNoOfShares"] = folio.certificate.reduce(
     (total, item) => total + (Number(item.noOfShares) || 0),
     0
    );
    payload["certificate"] = folio.certificate.map((item, i) => ({
     ...item,
     totalFaceValue: item.faceValue,
     totalNoOfShares: item.noOfShares,
     totalNoOfSharesWords: item.noOfSharesWords,
     distinctiveNos: item.distinctiveNosFrom + "-" + item.distinctiveNosTo,
     certificateYear: this.setupYearPayload(item.dateOfAllotment),
     index: i + 1,
    }));
    payload["combinedTotalNoOfShares"] = folio.certificate.reduce(
     (total, item) => total + (Number(item.noOfShares) || 0),
     0
    );
    payload["combinedTotalNoOfSharesWords"] = numberInWords(
     payload["combinedTotalNoOfShares"]
    );
    payload["combinedTotalFaceValue"] =
     folio.certificate.length > 0
      ? folio.certificate[0].faceValue ?? 0
      : 0;
    payload["instrumentType"] =
     folio.shareCertificateMaster!.instrumentType;
    payload["companyRTA"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.registrarMasterBranch?.registrarMaster?.registrar_name || "";
    payload["companyRTAAddress"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.registrarMasterBranch?.address || "";
    payload["companyRTAPincode"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.registrarMasterBranch?.pincode || "";
    payload["companyCIN"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster?.CIN ||
     "";
    payload["companyCity"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster?.city ||
     "";
    payload["companyState"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.state || "";
    payload["companyPincode"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.pincode || "";
    payload["companyName"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.nameChangeMasters[0].currentName || "";
    payload["companyOldName"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.nameChangeMasters[
      this.shareHolderMaster!.shareCertificateMaster?.companyMaster
       ?.nameChangeMasters.length - 1 || 0
     ].previousName || "";
    payload["companyOldName2"] =
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.nameChangeMasters[
      this.shareHolderMaster!.shareCertificateMaster?.companyMaster
       ?.nameChangeMasters.length - 1 || 0
     ].previousName ||
     this.shareHolderMaster!.shareCertificateMaster?.companyMaster
      ?.nameChangeMasters[0].currentName ||
     "";
    payload["shareHolderDetails"] = [];
    this.setupFolioShareholderPayload(payload, folio, 1);
    this.setupFolioShareholderPayload(payload, folio, 2);
    this.setupFolioShareholderPayload(payload, folio, 3);
    payload["legalHeirDetails"] = this.legalHeirDetails.map((item) => ({
     ...item,
     dob: this.setupDatePayload(item.dob),
     accountOpeningDate: this.setupDatePayload(item.accountOpeningDate),
    }));
    payload["clamaints"] = this.clamaints.map((item, i) => ({
     ...item,
     dob: this.setupDatePayload(item.dob),
     accountOpeningDate: this.setupDatePayload(item.accountOpeningDate),
     index: i + 1,
    }));
    payload["non_clamaints"] = this.legalHeirDetails
     .filter(
      (itmm) =>
       this.clamaints.map((i) => i.id).includes(itmm.id) === false
     )
     .map((itmm, i) => ({
      ...itmm,
      dob: this.setupDatePayload(itmm.dob),
      accountOpeningDate: this.setupDatePayload(itmm.accountOpeningDate),
      index: i + 1,
     }));
    payload["survivors"] = payload["shareHolderDetails"]
     .filter((itmm) => itmm.id !== payload["deadShareholder"]?.id)
     .map((itmm, i) => ({
      ...itmm,
      dob: this.setupDatePayload(itmm.dob),
      accountOpeningDate: this.setupDatePayload(itmm.accountOpeningDate),
      index: i + 1,
     }));
    this.mainData.push(payload);
   });
   resolve(this.mainData);
  });
 }

 setupFolioShareholderPayload(
  payload: any,
  folio: FolioType & {
   certificate: CertificateType[];
  },
  index: number
 ): void {
  if (folio["shareholderName" + index]) {
   payload["hasShareholder_" + index] = true;
   payload["namePan_" + index] = folio["shareholderName" + index].namePan;
   payload["DPID_" + index] = folio["shareholderName" + index].DPID;
   payload["aadhar_" + index] = folio["shareholderName" + index].aadhar;
   payload["addressBank_" + index] =
    folio["shareholderName" + index].addressBank;
   payload["addressAadhar_" + index] =
    folio["shareholderName" + index].addressAadhar;
   payload["age_" + index] = folio["shareholderName" + index].age;
   payload["bankAccountNo_" + index] =
    folio["shareholderName" + index].bankAccountNo;
   payload["bankAccountType_" + index] =
    folio["shareholderName" + index].bankAccountType;
   payload["bankAddress_" + index] =
    folio["shareholderName" + index].bankAddress;
   payload["bankEmail_" + index] =
    folio["shareholderName" + index].bankEmail;
   payload["bankIFS_" + index] = folio["shareholderName" + index].bankIFS;
   payload["bankMICR_" + index] = folio["shareholderName" + index].bankMICR;
   payload["bankName_" + index] = folio["shareholderName" + index].bankName;
   payload["bankPhone_" + index] =
    folio["shareholderName" + index].bankPhone;
   payload["city_" + index] = folio["shareholderName" + index].city;
   payload["countryOfBirth_" + index] =
    folio["shareholderName" + index].countryOfBirth;
   payload["dematAccountNo_" + index] =
    folio["shareholderName" + index].dematAccountNo;
   payload["dob_" + index] = folio["shareholderName" + index].dob
    ? dayjs(folio["shareholderName" + index].dob).format("DD-MM-YYYY")
    : "";
   payload["email_" + index] = folio["shareholderName" + index].email;
   payload["emailBank_" + index] =
    folio["shareholderName" + index].emailBank;
   payload["nameAadhar_" + index] =
    folio["shareholderName" + index].nameAadhar;
   payload["nameBank_" + index] = folio["shareholderName" + index].nameBank;
   payload["nameCml_" + index] = folio["shareholderName" + index].nameCml;
   payload["namePan_" + index] = folio["shareholderName" + index].namePan;
   payload["nationality_" + index] =
    folio["shareholderName" + index].nationality;
   payload["pan_" + index] = folio["shareholderName" + index].pan;
   payload["phone_" + index] = folio["shareholderName" + index].phone;
   payload["phoneBank_" + index] =
    folio["shareholderName" + index].phoneBank;
   payload["pincodeBank_" + index] =
    folio["shareholderName" + index].pincodeBank;
   payload["placeOfBirth_" + index] =
    folio["shareholderName" + index].placeOfBirth;
   payload["husbandName_" + index] =
    folio["shareholderName" + index].husbandName;
   payload["occupation_" + index] =
    folio["shareholderName" + index].occupation;
   payload["branchName_" + index] =
    folio["shareholderName" + index].branchName;
   payload["accountOpeningDate_" + index] = folio["shareholderName" + index]
    .accountOpeningDate
    ? dayjs(folio["shareholderName" + index].accountOpeningDate).format(
     "DD-MM-YYYY"
    )
    : "";
   payload["shareholderName_" + index] =
    folio["shareholderName" + index].shareholderName;
   payload["state_" + index] = folio["shareholderName" + index].state;
   payload["shareholderNameCertificate_" + index] =
    folio.certificate.length > 0
     ? folio.certificate[folio.certificate.length - index][
     "shareholderName" + index + "Txt"
     ] || ""
     : "";
   payload["shareHolderDetails"] = [
    {
     ...folio["shareholderName" + index],
     shareholderNameCertificate:
      folio.certificate.length > 0
       ? folio.certificate[folio.certificate.length - index][
       "shareholderName" + index + "Txt"
       ] || ""
       : "",
     index,
    },
    ...payload["shareHolderDetails"],
   ];
  } else {
   payload["hasShareholder_" + index] = false;
  }
 }

 setupBooleanPayload(value: $Enums.TruthType): boolean {
  return value === "Yes" ? true : false;
 }

 setupDatePayload(value: string | Date | null | undefined): string {
  return value ? dayjs(value).format("DD-MM-YYYY") : "";
 }

 setupYearPayload(value: string | Date | null | undefined): string {
  return value ? dayjs(value).format("YYYY") : "";
 }
}

export default CaseDocGenerator;
