import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export type RegistrarMasterBranchType = {
  id: number;
  address?: string | null | undefined;
  city?: string | null | undefined;
  state?: string | null | undefined;
  pincode?: string | null | undefined;
  telephone1?: string | null | undefined;
  telephone2?: string | null | undefined;
  email?: string | null | undefined;
  website?: string | null | undefined;
  nameContactPerson?: string | null | undefined;
  designationContactPerson?: string | null | undefined;
  emailContactPerson?: string | null | undefined;
  phoneContactPerson?: string | null | undefined;
  officerAssigned?: string | null | undefined;
  branch: string | null | undefined;
  createdAt?: Date | null;
  registrarMasterID?: number | null | undefined;
  registrarMaster: {
    registrar_name: string;
    sebi_regn_id: string;
  } | null;
};

export interface RegistrarMasterBranchCreateType
  extends Omit<
    RegistrarMasterBranchType,
    | "id"
    | "createdAt"
    | "registrar_name"
    | "sebi_regn_id"
    | "registrarMasterId"
    | "registrarMaster"
  > {}

export interface RegistrarMasterBranchUpdateType
  extends RegistrarMasterBranchCreateType {}

export type RegistrarMasterBranchRepoCreateType = Prisma.Args<
  typeof prisma.registrarMasterBranch,
  "create"
>["data"];
export type RegistrarMasterBranchRepoUpdateType = Prisma.Args<
  typeof prisma.registrarMasterBranch,
  "update"
>["data"];
