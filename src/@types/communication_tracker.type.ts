import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type CommunicationTrackerFolioType = {
  id: number;
  Folio: string;
  shareCertificateMaster: {
    companyMaster: {
      nameChangeMasters: { currentName: string | null }[];
    } | null;
  } | null;
};

export type CommunicationTrackerType = {
  id: number;
  stage: "DocumentsCouriered" | "DocumentsReceived";
  folios: string | null;
  comments?: string | null;
  dateSent?: string | null;
  dateReceived?: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
};

export type CommunicationTrackerCreateType = Omit<
  CommunicationTrackerType,
  "id" | "createdAt" | "projectID"
>;

export interface CommunicationTrackerUpdateType
  extends CommunicationTrackerCreateType {}

export type CommunicationTrackerRepoCreateType = Prisma.Args<
  typeof prisma.communicationTracker,
  "create"
>["data"];
export type CommunicationTrackerRepoUpdateType = Prisma.Args<
  typeof prisma.communicationTracker,
  "update"
>["data"];
