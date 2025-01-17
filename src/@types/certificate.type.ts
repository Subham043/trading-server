import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { ShareHolderDetailType } from "./share_holder_detail.type";
import { Decimal } from "@prisma/client/runtime/library";

export type CertificateType = {
  id: number;
  equityType: "Bonus" | "Equity" | "ShareBought" | "Splits" | "Rights";
  certificateNumber: string;
  certificateSerialNumber?: string | null | undefined;
  shareholderName1Txt?: string | null | undefined;
  shareholderName2Txt?: string | null | undefined;
  shareholderName3Txt?: string | null | undefined;
  noOfShares?: string | null | undefined;
  noOfSharesWords?: string | null | undefined;
  dateOfAllotment?: Date | null | undefined;
  dateOfAction?: Date | null | undefined;
  faceValue: Decimal | null | undefined;
  distinctiveNosFrom?: string | null | undefined;
  distinctiveNosTo?: string | null | undefined;
  endorsement: "Yes" | "No";
  endorsementFolio?: string | null;
  endorsementDate?: Date | null;
  endorsementShareholderName1?: ShareHolderDetailType | null;
  endorsementShareholderName1ID?: number | null;
  endorsementShareholderName2?: ShareHolderDetailType | null;
  endorsementShareholderName2ID?: number | null;
  endorsementShareholderName3?: ShareHolderDetailType | null;
  endorsementShareholderName3ID?: number | null;
  folioID?: number | null;
  createdAt?: Date | null | undefined;
};

export type CertificateCreateType = Omit<
  CertificateType,
  | "id"
  | "createdAt"
  | "endorsementDate"
  | "dateOfAllotment"
  | "dateOfAction"
  | "endorsementShareholderName1"
  | "endorsementShareholderName2"
  | "endorsementShareholderName3"
> & {
  dateOfAllotment: Date | string | undefined;
  dateOfAction: Date | string | undefined;
  endorsementDate: Date | string | undefined;
};

export interface CertificateUpdateType extends CertificateCreateType {}

export type CertificateRepoCreateType = Prisma.Args<
  typeof prisma.certificate,
  "create"
>["data"];
export type CertificateRepoUpdateType = Prisma.Args<
  typeof prisma.certificate,
  "update"
>["data"];