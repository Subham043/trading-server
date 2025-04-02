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
import { numberInWords } from "../../utils/numberInWords";
import dayjs from "dayjs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import AdmZip from "adm-zip";

const caseName = {
  Claim: "Claim",
  ClaimTransposition: "ClaimTransposition",
  ClaimIssueDuplicate: "ClaimIssueDuplicate",
  Transmission: "Transmission",
  TransmissionIssueDuplicate: "TransmissionIssueDuplicate",
  TransmissionIssueDuplicateTransposition:
    "TransmissionIssueDuplicateTransposition",
  Deletion: "Deletion",
  DeletionIssueDuplicate: "DeletionIssueDuplicate",
  DeletionIssueDuplicateTransposition: "DeletionIssueDuplicateTransposition",
} as const;

const templateName = {
  ISR1: "ISR1",
  ISR2: "ISR2",
  ISR3: "ISR3",
  ISR4: "ISR4",
  ISR5: "ISR5",
  Affidavit: "Affidavit",
  Affidavit2: "Affidavit2",
  Annexure_D: "Annexure_D",
  Annexure_E: "Annexure_E",
  Annexure_F: "Annexure_F",
  Deletion: "Deletion",
  Form_A_Duplicate: "Form_A_Duplicate",
  Form_B_Duplicate: "Form_B_Duplicate",
  form_no_sh_13: "form_no_sh_13",
  Form_SH_14: "Form_SH_14",
} as const;

const templates = {
  ISR1: path.resolve(__dirname, "../../../static/word_template/ISR1.docx"),
  ISR2: path.resolve(__dirname, "../../../static/word_template/ISR2.docx"),
  ISR3: path.resolve(__dirname, "../../../static/word_template/ISR3.docx"),
  ISR4: path.resolve(__dirname, "../../../static/word_template/ISR4.docx"),
  ISR5: path.resolve(__dirname, "../../../static/word_template/ISR5.docx"),
  Affidavit: path.resolve(
    __dirname,
    "../../../static/word_template/Affidavit.docx"
  ),
  Affidavit2: path.resolve(
    __dirname,
    "../../../static/word_template/Affidavit2.docx"
  ),
  Annexure_D: path.resolve(
    __dirname,
    "../../../static/word_template/Annexure_D.docx"
  ),
  Annexure_E: path.resolve(
    __dirname,
    "../../../static/word_template/Annexure_E.docx"
  ),
  Annexure_F: path.resolve(
    __dirname,
    "../../../static/word_template/Annexure_F.docx"
  ),
  Deletion: path.resolve(
    __dirname,
    "../../../static/word_template/Deletion.docx"
  ),
  Form_A_Duplicate: path.resolve(
    __dirname,
    "../../../static/word_template/Form_A_Duplicate_1.docx"
  ),
  Form_A_Duplicate_2: path.resolve(
    __dirname,
    "../../../static/word_template/Form_A_Duplicate_2.docx"
  ),
  Form_B_Duplicate: path.resolve(
    __dirname,
    "../../../static/word_template/Form_B_Duplicate_1.docx"
  ),
  Form_B_Duplicate_2: path.resolve(
    __dirname,
    "../../../static/word_template/Form_B_Duplicate_2.docx"
  ),
  form_no_sh_13: path.resolve(
    __dirname,
    "../../../static/word_template/form_no_sh_13.docx"
  ),
  Form_SH_14: path.resolve(
    __dirname,
    "../../../static/word_template/Form_SH_14.docx"
  ),
};

const caseType = {
  Claim: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
  ],
  ClaimTransposition: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
  ],
  ClaimIssueDuplicate: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Form_A_Duplicate,
      template: templates.Form_A_Duplicate,
    },
    {
      name: templateName.Form_B_Duplicate,
      template: templates.Form_B_Duplicate,
    },
  ],
  Transmission: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.ISR5,
      template: templates.ISR5,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Annexure_D,
      template: templates.Annexure_D,
    },
    {
      name: templateName.Annexure_E,
      template: templates.Annexure_E,
    },
    {
      name: templateName.Annexure_F,
      template: templates.Annexure_F,
    },
  ],
  TransmissionIssueDuplicate: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Form_A_Duplicate,
      template: templates.Form_A_Duplicate,
    },
    {
      name: templateName.Form_B_Duplicate,
      template: templates.Form_B_Duplicate,
    },
    {
      name: templateName.Annexure_D,
      template: templates.Annexure_D,
    },
    {
      name: templateName.Annexure_E,
      template: templates.Annexure_E,
    },
    {
      name: templateName.Annexure_F,
      template: templates.Annexure_F,
    },
  ],
  TransmissionIssueDuplicateTransposition: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.ISR5,
      template: templates.ISR5,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Form_A_Duplicate,
      template: templates.Form_A_Duplicate,
    },
    {
      name: templateName.Form_B_Duplicate,
      template: templates.Form_B_Duplicate,
    },
    {
      name: templateName.Annexure_D,
      template: templates.Annexure_D,
    },
    {
      name: templateName.Annexure_E,
      template: templates.Annexure_E,
    },
    {
      name: templateName.Annexure_F,
      template: templates.Annexure_F,
    },
  ],
  Deletion: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Deletion,
      template: templates.Deletion,
    },
  ],
  DeletionIssueDuplicate: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Form_A_Duplicate,
      template: templates.Form_A_Duplicate,
    },
    {
      name: templateName.Form_B_Duplicate,
      template: templates.Form_B_Duplicate,
    },
    {
      name: templateName.Deletion,
      template: templates.Deletion,
    },
  ],
  DeletionIssueDuplicateTransposition: [
    {
      name: templateName.ISR1,
      template: templates.ISR1,
    },
    {
      name: templateName.ISR2,
      template: templates.ISR2,
    },
    {
      name: templateName.ISR3,
      template: templates.ISR3,
    },
    {
      name: templateName.ISR4,
      template: templates.ISR4,
    },
    {
      name: templateName.form_no_sh_13,
      template: templates.form_no_sh_13,
    },
    {
      name: templateName.Form_SH_14,
      template: templates.Form_SH_14,
    },
    {
      name: templateName.Affidavit,
      template: templates.Affidavit,
    },
    {
      name: templateName.Form_A_Duplicate,
      template: templates.Form_A_Duplicate,
    },
    {
      name: templateName.Form_B_Duplicate,
      template: templates.Form_B_Duplicate,
    },
    {
      name: templateName.Annexure_D,
      template: templates.Annexure_D,
    },
    {
      name: templateName.Annexure_E,
      template: templates.Annexure_E,
    },
    {
      name: templateName.Annexure_F,
      template: templates.Annexure_F,
    },
    {
      name: templateName.Deletion,
      template: templates.Deletion,
    },
  ],
};

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
            nameChangeMasters: true;
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
export default class CaseDocGenerator {
  private readonly id: number;
  private folderName: string = "";
  private folderPath: string = "";
  private outputFolderPath: string = "";
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
    this.outputFolderPath = `../../../static/word_output/${this.folderName}`;
    this.init();
  }

  private async init() {
    this.folderPath = path.resolve(__dirname, this.outputFolderPath);
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

  private async getCase(): Promise<ShareHolderMasterType> {
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

  private async getFolios(): Promise<
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

  private async getClaimants(): Promise<LegalHeirDetailType[]> {
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

  private async getAffidavitShareholders(): Promise<ShareHolderDetailType[]> {
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

  private async getAffidavitLegalHeirs(): Promise<LegalHeirDetailType[]> {
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

  private async getNominations(): Promise<NominationType[]> {
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

  private async getLegalHeirs(): Promise<LegalHeirDetailType[]> {
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

  private async setup(): Promise<void> {
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
        payload["isDeceased"] = this.setupBooleanPayload(
          this.shareHolderMaster!.isDeceased
        );
        payload["deadShareholder"] = this.shareHolderMaster!.deadShareholder;
        payload["shareholderNameDeath"] =
          this.shareHolderMaster!.shareholderNameDeath;
        payload["deceasedRelationship"] =
          this.shareHolderMaster!.deceasedRelationship;
        payload["placeOfDeath"] = this.shareHolderMaster!.placeOfDeath;
        payload["dod"] = this.setupDatePayload(this.shareHolderMaster!.dod);
        payload["isTestate"] = this.setupBooleanPayload(
          this.shareHolderMaster!.isTestate
        );
        payload["isInTestate"] = !this.setupBooleanPayload(
          this.shareHolderMaster!.isTestate
        );
        payload["isMinor"] = this.setupBooleanPayload(
          this.shareHolderMaster!.isMinor
        );
        payload["dobMinor"] = this.setupDatePayload(
          this.shareHolderMaster!.dobMinor
        );
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

  private setupFolioShareholderPayload(
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

  private setupBooleanPayload(value: $Enums.TruthType): boolean {
    return value === "Yes" ? true : false;
  }

  private setupDatePayload(value: string | Date | null | undefined): string {
    return value ? dayjs(value).format("DD-MM-YYYY") : "";
  }

  private setupYearPayload(value: string | Date | null | undefined): string {
    return value ? dayjs(value).format("YYYY") : "";
  }

  private resolveFolderPath(folderPath: string): string {
    return path.resolve(__dirname, `${this.outputFolderPath}/${folderPath}`);
  }

  private generateAnnexureDDoc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    const folioFolderAnxDPath = this.resolveFolderPath(
      `${folioFolderName}/${casee_name}`
    );
    if (!fs.existsSync(folioFolderAnxDPath)) {
      fs.mkdirSync(folioFolderAnxDPath);
    }
    data.legalHeirDetails.forEach((i, idx) => {
      const annxDWordTemplate = templates.Annexure_D;
      const annxDContent = fs.readFileSync(annxDWordTemplate, "binary");

      // Create a zip instance of the file
      const annxDZip = new PizZip(annxDContent);

      // Create a Docxtemplater instance
      const annxDDoc = new Docxtemplater(annxDZip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      const dataRender: any = { ...i };
      dataRender["companyName"] = data["companyName"];
      dataRender["companyOldName"] = data["companyOldName"];
      dataRender["companyOldName2"] = data["companyOldName2"];
      dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
      dataRender["deceasedRelationship"] = data["deceasedRelationship"];
      dataRender["Folio"] = data["Folio"];
      dataRender["certificate"] = data["certificate"];
      dataRender["legalHeirDetails"] = data.legalHeirDetails.filter(
        (_it, itx) => itx !== idx
      );
      annxDDoc.render(dataRender);

      // Get the generated document as a buffer
      const buf = annxDDoc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const annxDWordOutput = path.resolve(
        __dirname,
        folioFolderAnxDPath + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(annxDWordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateISR5Doc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    const folioFolderISR5DPath = this.resolveFolderPath(
      `${folioFolderName}/${casee_name}`
    );
    if (!fs.existsSync(folioFolderISR5DPath)) {
      fs.mkdirSync(folioFolderISR5DPath);
    }
    data.clamaints.forEach((i, idx) => {
      const ISR5WordTemplate = templates.ISR5;
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
      dataRender["companyOldName"] = data["companyOldName"];
      dataRender["companyOldName2"] = data["companyOldName2"];
      dataRender["companyRTA"] = data["companyRTA"];
      dataRender["companyRTAAddress"] = data["companyRTAAddress"];
      dataRender["companyRTAPincode"] = data["companyRTAPincode"];
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
      dataRender["politicalExposureClaimant"] =
        data["politicalExposureClaimant"];
      dataRender["annualIncomeClaimant"] = data["annualIncomeClaimant"];
      dataRender["Folio"] = data["Folio"];
      dataRender["certificate"] = data["certificate"];
      ISR5Doc.render(dataRender);

      // Get the generated document as a buffer
      const buf = ISR5Doc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const ISR5WordOutput = path.resolve(
        __dirname,
        folioFolderISR5DPath + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(ISR5WordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateFormADuplicate2Doc(
    casee_name: string,
    folioFolderPath: string,
    index: number,
    data: any
  ): void {
    // Load the docx file as a binary
    const wordTemplate = templates.Form_A_Duplicate_2;
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
      folioFolderPath + "/" + casee_name + "_" + (index + 1) + ".docx"
    );
    fs.writeFileSync(wordOutput, buf);

    console.log(casee_name + "Document created successfully!");
  }

  private generateFormADuplicateDoc(
    casee_name: string,
    folioFolderPath: string,
    index: number,
    data: any
  ): void {
    // Load the docx file as a binary
    const wordTemplate = templates.Form_A_Duplicate;
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
      folioFolderPath + "/" + casee_name + "_" + (index + 1) + ".docx"
    );
    fs.writeFileSync(wordOutput, buf);

    console.log(casee_name + " Document created successfully!");
  }

  private generateFormBDuplicate2Doc(
    casee_name: string,
    folioFolderPath: string,
    index: number,
    data: any
  ): void {
    // Load the docx file as a binary
    const wordTemplate = templates.Form_B_Duplicate_2;
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
      folioFolderPath + "/" + casee_name + "_" + (index + 1) + ".docx"
    );
    fs.writeFileSync(wordOutput, buf);

    console.log(casee_name + " Document created successfully!");
  }

  private generateFormBDuplicateDoc(
    casee_name: string,
    folioFolderPath: string,
    index: number,
    data: any
  ): void {
    // Load the docx file as a binary
    const wordTemplate = templates.Form_B_Duplicate;
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
      folioFolderPath + "/" + casee_name + "_" + (index + 1) + ".docx"
    );
    fs.writeFileSync(wordOutput, buf);

    console.log(casee_name + " Document created successfully!");
  }

  private generateAffidavitDoc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    // Load the docx file as a binary
    const folioFolderAffidavitDPath = this.resolveFolderPath(
      `${folioFolderName}/AffidavitLegalHeir`
    );
    if (!fs.existsSync(folioFolderAffidavitDPath)) {
      fs.mkdirSync(folioFolderAffidavitDPath);
    }
    data.affidavitLegalHeirs.forEach((i, idx) => {
      const affidavitWordTemplate = templates.Affidavit;
      const affidavitContent = fs.readFileSync(affidavitWordTemplate, "binary");

      // Create a zip instance of the file
      const affidavitZip = new PizZip(affidavitContent);

      // Create a Docxtemplater instance
      const affidavitDoc = new Docxtemplater(affidavitZip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const dataRender: any = { ...i };
      dataRender["companyName"] = data["companyName"];
      dataRender["companyOldName"] = data["companyOldName"];
      dataRender["companyOldName2"] = data["companyOldName2"];
      dataRender["shareholderNameDeath"] = data["shareholderNameDeath"];
      dataRender["deceasedRelationship"] = data["deceasedRelationship"];
      dataRender["placeOfDeath"] = data["placeOfDeath"];

      affidavitDoc.render(dataRender);

      // Get the generated document as a buffer
      const buf = affidavitDoc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const affidavitWordOutput = path.resolve(
        __dirname,
        folioFolderAffidavitDPath + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(affidavitWordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateAffidavit2Doc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    // Load the docx file as a binary
    const folioFolderAffidavitDPath = this.resolveFolderPath(
      `${folioFolderName}/AffidavitShareholder`
    );
    if (!fs.existsSync(folioFolderAffidavitDPath)) {
      fs.mkdirSync(folioFolderAffidavitDPath);
    }
    data.affidavits.forEach((i, idx) => {
      const affidavitWordTemplate = templates.Affidavit2;
      const affidavitContent = fs.readFileSync(affidavitWordTemplate, "binary");

      // Create a zip instance of the file
      const affidavitZip = new PizZip(affidavitContent);

      // Create a Docxtemplater instance
      const affidavitDoc = new Docxtemplater(affidavitZip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const dataRender: any = { ...i };

      const indx = data["shareHolderDetails"].findIndex(
        (i: any) => i.id === i.id
      );

      dataRender["shareholderNameCertificate"] =
        indx !== -1
          ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
          : "";

      affidavitDoc.render(dataRender);

      // Get the generated document as a buffer
      const buf = affidavitDoc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const affidavitWordOutput = path.resolve(
        __dirname,
        folioFolderAffidavitDPath + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(affidavitWordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateFormSH13Doc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    // Load the docx file as a binary
    const folioFolderSH13Path = this.resolveFolderPath(
      `${folioFolderName}/${casee_name}`
    );
    if (!fs.existsSync(folioFolderSH13Path)) {
      fs.mkdirSync(folioFolderSH13Path);
    }
    data.nominations.forEach((i, idx) => {
      const sh13WordTemplate = templates.form_no_sh_13;
      const sh13Content = fs.readFileSync(sh13WordTemplate, "binary");

      // Create a zip instance of the file
      const sh13Zip = new PizZip(sh13Content);

      // Create a Docxtemplater instance
      const sh13Doc = new Docxtemplater(sh13Zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const dataRender: any = { ...i, ...data };

      const indx = data["shareHolderDetails"].findIndex(
        (i: any) => i.id === i.id
      );

      dataRender["shareholderNameCertificate"] =
        indx !== -1
          ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
          : "";

      sh13Doc.render(dataRender);

      // Get the generated document as a buffer
      const buf = sh13Doc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const sh13WordOutput = path.resolve(
        __dirname,
        folioFolderSH13Path + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(sh13WordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateFormSH14Doc(
    casee_name: string,
    folioFolderName: string,
    data: any
  ): void {
    // Load the docx file as a binary
    const folioFolderSH14Path = this.resolveFolderPath(
      `${folioFolderName}/${casee_name}`
    );
    if (!fs.existsSync(folioFolderSH14Path)) {
      fs.mkdirSync(folioFolderSH14Path);
    }
    data.nominations.forEach((i, idx) => {
      const sh14WordTemplate = templates.Form_SH_14;
      const sh14Content = fs.readFileSync(sh14WordTemplate, "binary");

      // Create a zip instance of the file
      const sh14Zip = new PizZip(sh14Content);

      // Create a Docxtemplater instance
      const sh14Doc = new Docxtemplater(sh14Zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const dataRender: any = { ...i, ...data };

      const indx = data["shareHolderDetails"].findIndex(
        (i: any) => i.id === i.id
      );

      dataRender["shareholderNameCertificate"] =
        indx !== -1
          ? data["shareHolderDetails"][indx]["shareholderNameCertificate"]
          : "";

      sh14Doc.render(dataRender);

      // Get the generated document as a buffer
      const buf = sh14Doc.getZip().generate({ type: "nodebuffer" });

      // Write the buffer to a file (output.docx)
      const sh14WordOutput = path.resolve(
        __dirname,
        folioFolderSH14Path + "/" + casee_name + "_" + (idx + 1) + ".docx"
      );
      fs.writeFileSync(sh14WordOutput, buf);

      console.log(casee_name + " Document created successfully!");
    });
  }

  private generateCommonDoc(
    casee_name: string,
    folioFolderPath: string,
    index: number,
    data: any
  ): void {
    // Load the docx file as a binary
    const wordTemplate = templates[casee_name];
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
      folioFolderPath + "/" + casee_name + "_" + (index + 1) + ".docx"
    );
    fs.writeFileSync(wordOutput, buf);

    console.log(casee_name + " Document created successfully!");
  }

  async generateDoc(): Promise<string> {
    this.mainData.forEach((item, index) => {
      const folioFolderName = item.Folio.replace(/\//g, "_");

      const folioFolderPath = this.resolveFolderPath(folioFolderName);
      if (!fs.existsSync(folioFolderPath)) {
        fs.mkdirSync(folioFolderPath);
      }
      const data = {
        ...item,
      };

      caseType[item.Case].forEach((casee) => {
        if (casee.name === templateName.Annexure_D) {
          this.generateAnnexureDDoc(casee.name, folioFolderName, data);
        } else if (casee.name === templateName.ISR5) {
          this.generateISR5Doc(casee.name, folioFolderName, data);
        } else if (casee.name === templateName.Form_A_Duplicate) {
          if (item.Case === caseName.TransmissionIssueDuplicate) {
            this.generateFormADuplicate2Doc(
              casee.name,
              folioFolderPath,
              index,
              data
            );
          } else {
            this.generateFormADuplicateDoc(
              casee.name,
              folioFolderPath,
              index,
              data
            );
          }
        } else if (casee.name === templateName.Form_B_Duplicate) {
          if (item.Case === caseName.TransmissionIssueDuplicate) {
            this.generateFormBDuplicate2Doc(
              casee.name,
              folioFolderPath,
              index,
              data
            );
          } else {
            this.generateFormBDuplicateDoc(
              casee.name,
              folioFolderPath,
              index,
              data
            );
          }
        } else if (casee.name === templateName.Affidavit) {
          if (data.allowAffidavit) {
            if (item.Case.includes(caseName.Transmission)) {
              this.generateAffidavitDoc(casee.name, folioFolderName, data);
            }
            this.generateAffidavit2Doc(casee.name, folioFolderName, data);
          }
        } else if (casee.name === templateName.form_no_sh_13) {
          this.generateFormSH13Doc(casee.name, folioFolderName, data);
        } else if (casee.name === templateName.Form_SH_14) {
          this.generateFormSH14Doc(casee.name, folioFolderName, data);
        } else {
          this.generateCommonDoc(casee.name, folioFolderPath, index, data);
        }
      });
    });

    const folderZip = new AdmZip();
    folderZip.addLocalFolder(this.folderPath);
    await folderZip.writeZipPromise(
      path.resolve(__dirname, this.outputFolderPath + ".zip")
    );
    fs.rm(this.folderPath, { recursive: true }, (err) => {});

    return path.resolve(__dirname, this.outputFolderPath + ".zip");
  }
}
