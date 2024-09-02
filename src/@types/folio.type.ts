import { Prisma } from "@prisma/client";
import { prisma } from "../db";

type ShareCertificateMasterQueryType = {
  instrumentType:
    | "InvIT"
    | "IDR"
    | "MFs"
    | "PreferenceShares"
    | "REiT"
    | "Equity"
    | "Warrant";
};

export type FolioType = {
  id: number;
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
  Folio: string;
  certificateNumber?: string | null | undefined;
  certificateSerialNumber?: string | null | undefined;
  shareholderName1?: string | null | undefined;
  shareholderName2?: string | null | undefined;
  shareholderName3?: string | null | undefined;
  noOfShares?: string | null | undefined;
  noOfSharesWords?: string | null | undefined;
  dateOfAllotment?: Date | null | undefined;
  faceValue: number | null | undefined;
  distinctiveNosFrom?: string | null | undefined;
  distinctiveNosTo?: string | null | undefined;
  shareCertificateMaster?: ShareCertificateMasterQueryType | null;
  shareCertificateID?: number | null;
  createdAt?: Date | null | undefined;
};

export type FolioCreateType = Omit<
  FolioType,
  "id" | "dateOfAllotment" | "createdAt" | "shareCertificateMaster"
> & {
  dateOfAllotment: Date | string | undefined;
};

export interface FolioUpdateType extends FolioCreateType {}

export type FolioRepoCreateType = Prisma.Args<
  typeof prisma.folio,
  "create"
>["data"];
export type FolioRepoUpdateType = Prisma.Args<
  typeof prisma.folio,
  "update"
>["data"];

export type FolioCorporateMasterType = {
  type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
  date: Date;
  numerator?: string | null;
  denominator?: string | null;
  originalHolding?: string | null;
  exchange?: string | null;
  consolidatedHolding?: string | null;
};

export type FolioDividendMasterType = {
  recorded_date: Date;
  recorded_year: number;
  financial_year?: string | null;
  dividend_per_share?: string | null;
  no_of_shares?: string | null;
  total_dividend?: string | null;
  cumulative_dividend?: string | null;
};
