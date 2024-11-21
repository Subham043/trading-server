import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { Decimal } from "@prisma/client/runtime/library";

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
  faceValue?: Decimal | null | undefined;
  closingPriceNSE?: Decimal | null | undefined;
  closingPriceBSE?: Decimal | null | undefined;
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
  companyMaster?: CompanyMasterQueryType | null;
  companyID?: number | null;
  projectID?: number | null;
  createdAt?: Date | null;
};

export type ShareCertificateMasterCreateType = Omit<
  ShareCertificateMasterType,
  "id" | "createdAt" | "projectID" | "companyMaster"
>;

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
