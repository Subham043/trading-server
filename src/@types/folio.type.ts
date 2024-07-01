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
  equityType: "Bonus" | "Shares" | "Splits" | "Rights";
};

export type FolioType = {
  id: number;
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
