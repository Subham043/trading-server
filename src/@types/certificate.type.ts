import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type CertificateType = {
  id: number;
  certificateNumber: string;
  certificateSerialNumber?: string | null | undefined;
  folioID?: number | null;
  createdAt?: Date | null | undefined;
};

export type CertificateCreateType = Omit<
  CertificateType,
  | "id"
  | "createdAt"
>;

export interface CertificateUpdateType extends CertificateCreateType {}

export type CertificateRepoCreateType = Prisma.Args<
  typeof prisma.certificate,
  "create"
>["data"];
export type CertificateRepoUpdateType = Prisma.Args<
  typeof prisma.certificate,
  "update"
>["data"];