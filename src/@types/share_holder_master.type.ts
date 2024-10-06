import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type ShareHolderMasterMainType = {
  id: number;
  caseType:
    | "Claim"
    | "ClaimIssueDuplicate"
    | "ClaimTransposition"
    | "Transmission"
    | "TransmissionIssueDuplicate"
    | "TransmissionIssueDuplicateTransposition"
    | "Deletion"
    | "DeletionIssueDuplicate"
    | "DeletionIssueDuplicateTransposition";
  noOfShareHolder: string;
  noOfLegalHeir: string;
  transpositionOrder?: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
  shareHolderDetails: ShareHolderDetailType[];
};

export type ShareHolderMasterType = {
  id: number;
  caseType:
    | "Claim"
    | "ClaimIssueDuplicate"
    | "ClaimTransposition"
    | "Transmission"
    | "TransmissionIssueDuplicate"
    | "TransmissionIssueDuplicateTransposition"
    | "Deletion"
    | "DeletionIssueDuplicate"
    | "DeletionIssueDuplicateTransposition";
  noOfShareHolder: string;
  noOfLegalHeir: string;
  transpositionOrder?: string | null;
  projectID?: number | null;
  createdAt?: Date | null;
};

export type ShareHolderMasterCreateType = Omit<
  ShareHolderMasterType,
  "id" | "createdAt" | "projectID"
>;

export interface ShareHolderMasterUpdateType
  extends ShareHolderMasterCreateType {}

export type ShareHolderMasterRepoCreateType = Prisma.Args<
  typeof prisma.shareHolderMaster,
  "create"
>["data"];
export type ShareHolderMasterRepoUpdateType = Prisma.Args<
  typeof prisma.shareHolderMaster,
  "update"
>["data"];
export type ShareHolderDetailType = Prisma.Args<
  typeof prisma.shareHolderDetail,
  "update"
>["data"];
