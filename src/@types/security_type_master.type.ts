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

export type SecurityTypeMasterType = {
  id: number;
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
  Symbol?: string | null;
  Series?: string | null;
  securityName?: string | null;
  dateOfListing?: Date | null;
  dateOfAllotment?: Date | null;
  redemptionDate?: Date | null;
  conversionDate?: Date | null;
  paidUpValue: number | null;
  dividend: number | null;
  redemptionAmount: number | null;
  conversionAmount: number | null;
  marketLot?: string | null;
  isinNumber?: string | null;
  distinctiveNosFrom?: string | null;
  distinctiveNosTo?: string | null;
  companyMaster?: CompanyMasterQueryType | null;
  companyID?: number | null;
  createdAt?: Date | null;
};

export type SecurityTypeMasterCreateType = Omit<
  SecurityTypeMasterType,
  | "id"
  | "dateOfListing"
  | "dateOfAllotment"
  | "redemptionDate"
  | "conversionDate"
  | "createdAt"
  | "companyMaster"
> & {
  dateOfListing: Date | string | undefined;
  dateOfAllotment: Date | string | undefined;
  redemptionDate: Date | string | undefined;
  conversionDate: Date | string | undefined;
};

export interface SecurityTypeMasterUpdateType
  extends SecurityTypeMasterCreateType {}

export type SecurityTypeMasterRepoCreateType = Prisma.Args<
  typeof prisma.securityTypeMaster,
  "create"
>["data"];
export type SecurityTypeMasterRepoUpdateType = Prisma.Args<
  typeof prisma.securityTypeMaster,
  "update"
>["data"];
