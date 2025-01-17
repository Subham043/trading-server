import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { ShareHolderDetailType } from "./share_holder_detail.type";

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
  Folio: string;
  shareholderName1?: ShareHolderDetailType | null | undefined;
  shareholderName1ID?: number | null | undefined;
  shareholderName2?: ShareHolderDetailType | null | undefined;
  shareholderName2ID?: number | null | undefined;
  shareholderName3?: ShareHolderDetailType | null | undefined;
  shareholderName3ID?: number | null | undefined;
  shareCertificateMaster?: ShareCertificateMasterQueryType | null;
  shareCertificateID?: number | null;
  createdAt?: Date | null | undefined;
};

export type FolioCreateType = Omit<
  FolioType,
  | "id"
  | "createdAt"
  | "shareholderName1"
  | "shareholderName2"
  | "shareholderName3"
  | "shareCertificateMaster"
>;

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
  // type: "Equity" | "Bonus" | "Splits" | "Rights" | "ShareBought";
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
