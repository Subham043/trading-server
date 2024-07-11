import { Prisma } from "@prisma/client";
import { prisma } from "../db";

type CompanyMasterQueryType = {
  id?: number | undefined;
  nameChangeMasters?:
    | {
        id: number | undefined;
        NSE: string | null;
        BSE: string | null;
        previousName: string | null;
        currentName: string | null;
        dateNameChange: Date;
      }[]
    | undefined;
  currentNameChangeMasters?: {
    id?: number | null | undefined;
    NSE?: string | null;
    BSE?: string | null;
    previousName?: string | null;
    currentName?: string | null;
    dateNameChange?: Date;
  } | null;
  CIN?: string | null | undefined;
  ISIN?: string | null | undefined;
  faceValue?: number | null | undefined;
  createdAt?: Date | null | undefined;
};

export type ShareCertificateMasterType = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null;
  endorsementDate?: Date | null;
  endorsementShareholderName1?: string | null;
  endorsementShareholderName2?: string | null;
  endorsementShareholderName3?: string | null;
  companyMaster?: CompanyMasterQueryType | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export type ShareCertificateMasterCreateType = Omit<
  ShareCertificateMasterType,
  "id" | "endorsementDate" | "createdAt" | "companyMaster"
> & {
  endorsementDate: Date | string | undefined;
};

export interface ShareCertificateMasterUpdateType
  extends ShareCertificateMasterCreateType {}

export type ShareCertificateMasterRepoCreateType = Prisma.Args<
  typeof prisma.shareCertificateMaster,
  "create"
>["data"];
export type ShareCertificateMasterRepoUpdateType = Prisma.Args<
  typeof prisma.shareCertificateMaster,
  "update"
>["data"];
