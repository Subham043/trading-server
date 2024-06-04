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

export type SecurityMasterType = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio?: string | null;
  certificateNumber?: string | null;
  certificateSerialNumber?: string | null;
  shareholderName1?: string | null;
  shareholderName2?: string | null;
  shareholderName3?: string | null;
  noOfShares?: string | null;
  noOfSharesWords?: string | null;
  dateOfAllotment?: Date | null;
  faceValue: number | null;
  distinctiveNosFrom?: string | null;
  distinctiveNosTo?: string | null;
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

export type SecurityMasterCreateType = Omit<
  SecurityMasterType,
  "id" | "dateOfAllotment" | "endorsementDate" | "createdAt" | "companyMaster"
> & {
  endorsementDate: Date | string | undefined;
  dateOfAllotment: Date | string | undefined;
};

export interface SecurityMasterUpdateType extends SecurityMasterCreateType {}

export type SecurityMasterRepoCreateType = Prisma.Args<
  typeof prisma.securityMaster,
  "create"
>["data"];
export type SecurityMasterRepoUpdateType = Prisma.Args<
  typeof prisma.securityMaster,
  "update"
>["data"];
